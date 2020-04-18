import React, { useState } from 'react'
import { Controls, Map, Popup, centerAndZoom, VectorLayer } from '@bayer/ol-kit'
import olFeature from 'ol/feature'
import olVectorLayer from 'ol/layer/vector'
import olPoint from 'ol/geom/point'
import olVectorSource from 'ol/source/vector'

import DataLoader from './DataLoader'
import TimeTicker from './TimeTicker'
import { createUSStatesLayer } from './utils'

function App() {
  const [dates, setDates] = useState([])
  const onMapInit = map => {
    console.log('we got a map!', map)
    window.map = map

    map.addLayer(createUSStatesLayer())
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
