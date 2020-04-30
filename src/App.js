import React from 'react'
import { Controls, Map, LayerStyler } from '@bayer/ol-kit'

function App() {
  const onMapInit = map => {
    console.log('we got a map!', map)
    window.map = map
  }

  return (
    <Map onMapInit={onMapInit} fullScreen>
      <Controls />
      <div style={{ height: '100%', width: '500px', backgroundColor: 'white', position: 'absolute' }}>
        <LayerStyler />
      </div>
    </Map>
  )
}

export default App
