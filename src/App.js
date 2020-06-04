import React, { useState } from 'react'
import { BasemapManager, Controls, Map, Popup, Provider, LayerPanel, ZoomControls, loadDataLayer } from '@bayer/ol-kit'

// import { loadDataLayer } from './dataLoaderUtil' // temp solution
import DataLoader from './DataLoader'
// import Popup from './Popup'
import TimeTicker from './TimeTicker'
import US_STATES from './data/us_states.json'
import { exportFeatures } from './export'
import COVID from './data/covid.json'

function App() {
  const [dates, setDates] = useState([])
  let dataLayer = null
  const onMapInit = async map => {
    console.log('we got a map!', map)
    window.map = map

    dataLayer = await loadDataLayer(map, 'https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_10m_coastline.geojson')

    // await loadDataLayer(map, 'https://gis.ncdc.noaa.gov/kml/gsod.kmz')

    console.log('dataLayer', dataLayer)
  }
  const onExportFeatures = e => {

    exportFeatures(e, dataLayer.getSource().getFeatures())
  }

  return (
    <>
      <Map onMapInit={onMapInit} fullScreen>
        <Controls><ZoomControls /></Controls>
        <Popup />
        <LayerPanel onExportFeatures={onExportFeatures} />
      </Map>
    </>
  )
}

export default App
