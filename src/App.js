import React from 'react'
import { Controls, Map } from '@bayer/ol-kit'

function App() {
  const onMapInit = map => {
    console.log('we got a map!', map)
    window.map = map
  }

  return (
    <Map onMapInit={onMapInit} fullScreen>
      <Controls />
    </Map>
  )
}

export default App
