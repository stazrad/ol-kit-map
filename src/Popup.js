import React, { useState } from 'react'
import { Popup } from '@bayer/ol-kit'
import Chart from 'chart.js'
import getStateAbbr from './stateNameConversion'

function PopupContainer (props) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const onMapClick = e => {
    const { features } = e

    if (features.length) {
      const title = features[0].get('NAME')

      setLoading(true)
      dataFetcher(title)
    }
  }
  const dataFetcher = async (state) => {
    const shortName = getStateAbbr(state, 'abbr')
    const req = await fetch(`https://covidtracking.com/api/states/daily?state=${shortName}`)
    const data = await req.json()

    setData(data)
    setLoading(false)

    const convertData = data => {
      const output = data.map(d => (
        {
          x: Number(d.date.toString().substr(5)),
          y: d.hospitalizedIncrease
        }
      )).sort((a, b) => a.x - b.x)

      return output
    }
    const convertedData = convertData(data)

    console.log(data, convertData(data))

    const myChart = new Chart('myChart', {
        type: 'bar',
        data: {
            labels: convertedData.map(d => d.x),
            datasets: [{
                label: `# of Hospitalized Increase in ${state}`,
                data: convertedData,
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
            }]
        }
    });
  }

  return (
    <Popup
      onMapClick={onMapClick}
      actions={<div>custom child</div>}>
      <div style={{ padding: '10px' }}>
        <h3>Hospitalization Trends</h3>
        <canvas id="myChart" height="150" width="200"></canvas>
      </div>
    </Popup>
  )
}

export default PopupContainer
