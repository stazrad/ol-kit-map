import React, { useEffect } from 'react'
import { connectToMap } from '@bayer/ol-kit'
import proj from 'ol/proj'
import olFeature from 'ol/feature'
import olVectorLayer from 'ol/layer/vector'
import olPoint from 'ol/geom/point'
import olVectorSource from 'ol/source/vector'
import olStyle from 'ol/style/style'
import olStroke from 'ol/style/stroke'
import olFill from 'ol/style/fill'
import olCircleStyle from 'ol/style/circle'

function DataLoader (props) {
  const { map, setDates } = props
  const dataFetcher = async () => {
    const dataUrl = 'https://covidtracking.com/api/v1/states/daily.json'
    const request = await fetch(dataUrl)
    const data = await request.json()
    const features = []
    const dates = data.filter(d => d.state === 'MO')

    setDates(dates)

    // data.features.forEach(feat => {
    //   if (feat.geometry) {
    //     const {x, y} = feat.geometry
    //     const coords = proj.fromLonLat([x,y])
    //     const feature = new olFeature(new olPoint(coords))
    //     const hasConfirmed = feat.attributes.Confirmed > 0
    //     const color = hasConfirmed ? 'red' : 'blue'
    //     const radius = hasConfirmed ? feat.attributes.Confirmed / 250 : feat.attributes.Confirmed
    //
    //     feature.setProperties({ ...feat.attributes, title: feat.attributes.Combined_Key })
    //     feature.setStyle(
    //       new olStyle({
    //         image: new olCircleStyle({
    //           radius,
    //           fill: new olFill({ color }),
    //           stroke: new olStroke({
    //             color,
    //             width: 1
    //           })
    //         })
    //       })
    //     )
    //     feature.getStyle().getImage().setOpacity(.4)
    //
    //     features.push(feature)
    //   }
    // })

    const source = new olVectorSource({ features })
    const vectorLayer = new olVectorLayer({ source })

    map.addLayer(vectorLayer)
  }

  useEffect(() => {
    dataFetcher()
  }, [])

  return null
}

export default connectToMap(DataLoader)
