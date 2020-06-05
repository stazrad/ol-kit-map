import React, { useState, useEffect } from 'react'
import { BasemapManager, Controls, Map, Popup, LayerPanel, ZoomControls, VectorLayer } from '@bayer/ol-kit'

// import { loadDataLayer } from './dataLoaderUtil' // temp solution
import DataLoader from './DataLoader'
// import Popup from './Popup'
import TimeTicker from './TimeTicker'
import US_STATES from './data/us_states.json'
import COVID from './data/covid.json'

import olLayerTile from 'ol/layer/tile'
import olLayerImage from 'ol/layer/image'
import olSourceXYZ from 'ol/source/xyz'
import olSourceRaster from 'ol/source/raster'
import olLayerVector from 'ol/layer/vector'
import olSourceVector from 'ol/source/vector'
import olFormatKML from 'ol/format/kml'
import olSourceTileWMS from 'ol/source/tilewms'
import { HillshadeControlContainer } from './styled'

function shade(inputs, data) {
  let elevationImage = inputs[0];
  let width = elevationImage.width;
  let height = elevationImage.height;
  let elevationData = elevationImage.data;
  let shadeData = new Uint8ClampedArray(elevationData.length);
  let dp = data.resolution * 2;
  let maxX = width - 1;
  let maxY = height - 1;
  let pixel = [0, 0, 0, 0];
  let twoPi = 2 * Math.PI;
  let halfPi = Math.PI / 2;
  let sunEl = Math.PI * data.sunEl / 180;
  let sunAz = Math.PI * data.sunAz / 180;
  let cosSunEl = Math.cos(sunEl);
  let sinSunEl = Math.sin(sunEl);
  let pixelX, pixelY, x0, x1, y0, y1, offset,
      z0, z1, dzdx, dzdy, slope, aspect, cosIncidence, scaled;
  for (pixelY = 0; pixelY <= maxY; ++pixelY) {
    y0 = pixelY === 0 ? 0 : pixelY - 1;
    y1 = pixelY === maxY ? maxY : pixelY + 1;
    for (pixelX = 0; pixelX <= maxX; ++pixelX) {
      x0 = pixelX === 0 ? 0 : pixelX - 1;
      x1 = pixelX === maxX ? maxX : pixelX + 1;

      // determine elevation for (x0, pixelY)
      offset = (pixelY * width + x0) * 4;
      pixel[0] = elevationData[offset];
      pixel[1] = elevationData[offset + 1];
      pixel[2] = elevationData[offset + 2];
      pixel[3] = elevationData[offset + 3];
      z0 = data.vert * (pixel[0] + pixel[1] * 2 + pixel[2] * 3);

      // determine elevation for (x1, pixelY)
      offset = (pixelY * width + x1) * 4;
      pixel[0] = elevationData[offset];
      pixel[1] = elevationData[offset + 1];
      pixel[2] = elevationData[offset + 2];
      pixel[3] = elevationData[offset + 3];
      z1 = data.vert * (pixel[0] + pixel[1] * 2 + pixel[2] * 3);

      dzdx = (z1 - z0) / dp;

      // determine elevation for (pixelX, y0)
      offset = (y0 * width + pixelX) * 4;
      pixel[0] = elevationData[offset];
      pixel[1] = elevationData[offset + 1];
      pixel[2] = elevationData[offset + 2];
      pixel[3] = elevationData[offset + 3];
      z0 = data.vert * (pixel[0] + pixel[1] * 2 + pixel[2] * 3);

      // determine elevation for (pixelX, y1)
      offset = (y1 * width + pixelX) * 4;
      pixel[0] = elevationData[offset];
      pixel[1] = elevationData[offset + 1];
      pixel[2] = elevationData[offset + 2];
      pixel[3] = elevationData[offset + 3];
      z1 = data.vert * (pixel[0] + pixel[1] * 2 + pixel[2] * 3);

      dzdy = (z1 - z0) / dp;

      slope = Math.atan(Math.sqrt(dzdx * dzdx + dzdy * dzdy));

      aspect = Math.atan2(dzdy, -dzdx);
      if (aspect < 0) {
        aspect = halfPi - aspect;
      } else if (aspect > halfPi) {
        aspect = twoPi - aspect + halfPi;
      } else {
        aspect = halfPi - aspect;
      }

      cosIncidence = sinSunEl * Math.cos(slope) +
          cosSunEl * Math.sin(slope) * Math.cos(sunAz - aspect);

      offset = (pixelY * width + pixelX) * 4;
      scaled = 255 * cosIncidence;
      shadeData[offset] = scaled;
      shadeData[offset + 1] = scaled;
      shadeData[offset + 2] = scaled;
      shadeData[offset + 3] = elevationData[offset + 3];
    }
  }

  return {data: shadeData, width: width, height: height};
}

let elevation = new olSourceXYZ({
  url: 'https://{a-d}.tiles.mapbox.com/v3/aj.sf-dem/{z}/{x}/{y}.png',
  crossOrigin: 'anonymous',
  transition: 0
})

const globalElevation = new olSourceTileWMS({
  url: 'https://elevation.nationalmap.gov:443/arcgis/services/3DEPElevation/ImageServer/WMSServer',
  params: {
    LAYERS: '3DEPElevation:None'
  },
  crossOrigin: 'anonymous',
  transition: 0
})

const hillshade = new olSourceTileWMS({
  url: 'https://elevation.nationalmap.gov:443/arcgis/services/3DEPElevation/ImageServer/WMSServer',
  params: {
    LAYERS: '3DEPElevation:Hillshade Gray'
  },
  crossOrigin: 'anonymous',
  transition: 0
})

let raster = new olSourceRaster({
  sources: [globalElevation],
  operationType: 'image',
  operation: shade
})

function App() {
  const [vert, setVert] = useState(3)
  const [sunEl, setSunEl] = useState(45)
  const [sunAz, setSunAz] = useState(45)
  const onMapInit = async map => {
    console.log('we got a map!', map)
    window.map = map

    const vectorSource = new olSourceVector({
      url: 'https://openlayers.org/en/v4.6.5/examples/data/kml/2012_Earthquakes_Mag5.kml',
      format: new olFormatKML({
        extractStyles: false
      })
    })
    const vector = new olLayerVector({
      title: 'Earthquakes',
      mode: 'image',
      source: vectorSource
    })

    // map.getView().setCenter([-13615645, 4497969])
    map.addLayer(new olLayerImage({
      title: 'Client Rendered Hillshade',
      opacity: 0.4,
      source: raster
    }))
    map.addLayer(new olLayerTile({
      title: 'Server Rendered Hillshade',
      opacity: 0.3,
      source: hillshade
    }))
    map.addLayer(new olLayerTile({
      title: 'Source DEM',
      opacity: 0.65,
      source: globalElevation
    }))
    map.addLayer(vector)
  }

  useEffect(() => {
    const rasterCalculator = (event) => {
      // the event.data object will be passed to operations
      let data = event.data;
      data.resolution = event.resolution;
      data.vert = Number(vert)
      data.sunEl = Number(sunEl)
      data.sunAz = Number(sunAz)
    }

    raster.on('beforeoperations', rasterCalculator)

    return () => {
      raster.un('beforeoperations', rasterCalculator)
    }
  })

  const onVertChange = evt => {
    setVert(evt.target.value)
    raster.changed()
  }
  
  const onSunElChange = evt => {
    setSunEl(evt.target.value)
    raster.changed()
  }

  const onSunAzChange = evt => {
    setSunAz(evt.target.value)
    raster.changed()
  }

  console.log(vert) // eslint-disable-line no-console

  const vertLabel = `Vertical Exaggeration: ${vert}`
  const sunElLabel = `Sun Elevation: ${sunEl}˚`
  const sunAzLabel = `Sun Azimuth: ${sunAz}˚`

  return (
    <>
      <Map onMapInit={onMapInit} fullScreen>
        <Controls>
          <ZoomControls />
        </Controls>
        <Popup />
        <LayerPanel />
        <HillshadeControlContainer>
          <label htmlFor='vert'>{vertLabel}</label>
          <input onChange={onVertChange} id="vert" type="range" min="1" max="10" step='0.1' value={vert}/>
          <label htmlFor='sunEl'>{sunElLabel}</label>
          <input onChange={onSunElChange} id="sunEl" type="range" min="0" max="90" value={sunEl}/>
          <label htmlFor='sunAz'>{sunAzLabel}</label>
          <input onChange={onSunAzChange} id="sunAz" type="range" min="0" max="360" value={sunAz}/>
        </HillshadeControlContainer>
      </Map>
    </>
  )
}

export default App
