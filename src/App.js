import React, { useState } from 'react'
import { Controls, Map, Popup, createDataLayer } from '@bayer/ol-kit'

import DataLoader from './DataLoader'
import TimeTicker from './TimeTicker'

function App() {
  const [dates, setDates] = useState([])
  const onMapInit = map => {
    console.log('we got a map!', map)
    window.map = map

    map.addLayer(createDataLayer('us_states'))
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
