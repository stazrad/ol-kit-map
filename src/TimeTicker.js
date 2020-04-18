import React, { useState } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import styled from 'styled-components'

moment().format('YYY-MM-DD')

export const Container = styled.div`
  position: absolute;
  top: 10px;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
  margin-top: 0;
  justify-content: center;
  width: 80%;
  height: 80px;
  border-radius: 6px;
  background: white;
  opacity: .92;
`

export const ActiveContainer = styled.div`
  width: 140px;
  margin: auto;
`

export const Ticks = styled.div`
  /* width: 80%; */
  height: 60%;
  margin: auto;
  display: flex;
  flex-direction: row;
  flex-flow: space-evenly;
  justify-content: center;
`

export const Tick = styled.div`
  width: 3px;
  height: 100%;
  margin: 0 3px;
  background: ${p => p.active ? 'black' : '#a5a5a5'};
  cursor: pointer;
  display: flex;
`

function TimeTicker (props) {
  const { dates = [] } = props
  const [active, setActive] = useState(null)
  const [selected, setSelected] = useState(null)
  // console.log(active?.date && moment(active?.dateChecked))

  return (
    <Container className='_popup_boundary'>
      <Ticks>
        {dates.map((date, i) =>
          <Tick
            key={i}
            active={active === date}
            onClick={() => setSelected(date)}
            onMouseEnter={() => setActive(date)}
            onMouseLeave={() => setActive(selected)} />
        )}
      </Ticks>
      <ActiveContainer>{active?.date && moment(active?.dateChecked).toString()}</ActiveContainer>
    </Container>
  )
}

TimeTicker.defaulProps = {
  dates: []
}

export default TimeTicker
