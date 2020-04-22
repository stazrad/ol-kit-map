import React, { useEffect } from 'react'
import { connectToMap, VectorLayer } from '@bayer/ol-kit'
import proj from 'ol/proj'
import olFeature from 'ol/feature'
// import olVectorLayer from 'ol/layer/vector'
import olPoint from 'ol/geom/point'
import olVectorSource from 'ol/source/vector'
import olStyle from 'ol/style/style'
import olStroke from 'ol/style/stroke'
import olFill from 'ol/style/fill'
import olCircleStyle from 'ol/style/circle'

function DataLoader (props) {
  const { map } = props
  const dataFetcher = async () => {
    const dataUrl = 'https://services1.arcgis.com/0MSEUqKaxRlEPj5g/arcgis/rest/services/ncov_cases_US/FeatureServer/0/query?where=1%3D1&outFields=*&outSR=4326&f=json'
    const request = await fetch(dataUrl)
    const data = await request.json()
    const features = []

    data.features.forEach(feat => {
      if (feat.geometry) {
        const {x, y} = feat.geometry
        const coords = proj.fromLonLat([x,y])
        const feature = new olFeature(new olPoint(coords))
        const hasConfirmed = feat.attributes.Confirmed > 0
        const color = hasConfirmed > 0 ? 'rgba(255, 0, 0, 0.4)' : 'rgba(0, 0, 255, 0.4)'
        const radius = hasConfirmed ? feat.attributes.Confirmed / 250 : feat.attributes.Confirmed

        feature.setProperties({ ...feat.attributes, radius, color, title: `Confirmed: ${feat.attributes.Confirmed}` })
        features.push(feature)
      }
    })

    const source = new olVectorSource({ features })
    const layerStyle = feature => {
      const { radius = 4, color = 'rgba(255, 0, 0, 0.4)' } = feature?.getProperties?.() || {}
      return new olStyle({
        image: new olCircleStyle({
          radius,
          fill: new olFill({ color }),
          stroke: new olStroke({
            color,
            width: 1
          })
        })
      })
    }
    const vectorLayer = new VectorLayer({ source, title: 'COVID-19', style: layerStyle })

    map.addLayer(vectorLayer)
  }

  useEffect(() => {
    dataFetcher()
  }, [])

  return null
}

export default connectToMap(DataLoader)
