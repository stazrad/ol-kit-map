import React, { useState } from 'react'
import { Controls, Map, LayerStyler } from '@bayer/ol-kit'

import DataLoader from './DataLoader'

function App() {
  const [map, setMap] = useState()
  const onMapInit = map => {
    console.log('we got a map!', map)
    window.map = map
    setMap(map)
  }

  return (
    <div>
      <Map onMapInit={onMapInit} fullScreen>
        {map && <DataLoader map={map} />}
        <Controls />
        <div style={{ height: '100%', width: '500px', backgroundColor: 'white', position: 'absolute' }}>
          {map && <LayerStyler /> }
        </div>
      </Map>
    </div>
  )
}

export default App
