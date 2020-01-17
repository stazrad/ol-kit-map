import React from 'react'

import { Controls, Map } from '@monsantoit/olKit' // TODO @monsantoco/ol-kit

function App() {
  const onMapInit = map => {
    console.log('we got a map!', map)
  }

  return (
    <Map onMapInit={onMapInit}>
      <Controls />
    </Map>
  )
}

export default App
