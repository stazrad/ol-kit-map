import React, { useState } from 'react'
import { Controls, Map, Popup, createDataLayer, loadDataLayer } from '@bayer/ol-kit'

import DataLoader from './DataLoader'
import TimeTicker from './TimeTicker'

function App() {
  const [dates, setDates] = useState([])
  const onMapInit = async map => {
    console.log('we got a map!', map)
    window.map = map

    const dataLayer = await loadDataLayer(map, 'https://opendata.arcgis.com/datasets/628578697fb24d8ea4c32fa0c5ae1843_0.geojson')

    console.log('dataLayer', dataLayer)

    // map.addLayer(createDataLayer('us_counties'), { stroke: {width: 2}})
    // map.addLayer(createDataLayer('us_waterways'))
    // map.addLayer(createDataLayer('us_covid'))
  }

  return (
    <Map onMapInit={onMapInit} fullScreen>
      <DataLoader setDates={setDates} />
      <Controls />
      <Popup />
      <TimeTicker dates={dates} />
    </Map>
  )
}

export default App
