import React, { useState } from 'react'
import { Controls, Map, DataSearchBar } from '@bayer/ol-kit'

import DataLoader from './DataLoader'

function App() {
  console.log({ Controls, Map, DataSearchBar }) // eslint-disable-line no-console
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
      </Map>
      <div style={{ height: '100%', width: '500px', backgroundColor: 'white', position: 'absolute' }}>
        {map && <DataSearchBar maps={[map]}/> }
      </div>
    </div>
  )
}

export default App
