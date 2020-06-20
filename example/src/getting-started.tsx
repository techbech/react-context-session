import React from 'react'
import { ProvideSession, useSession } from 'react-context-session'

type MySessionType = {
  x: number
  y: number
  z: string
}

const useMySession = useSession<MySessionType>()

function MyCalculation() {
  const [{ x, y }] = useMySession(['x', 'y'])

  return (
    <p>
      {x} + {y} = {x + y}
    </p>
  )
}

function MyMessage() {
  const [{ z }] = useMySession(['z'])

  return <p>{z}</p>
}

function MyButton() {
  const [, setValue] = useMySession()
  return (
    <button onClick={() => setValue('z', 'My new string')}>Click me</button>
  )
}

function MyApp() {
  return (
    <ProvideSession data={{ x: 5, y: 10, z: 'My string' }}>
      <MyCalculation />
      <MyMessage />
      <MyButton />
    </ProvideSession>
  )
}

export default MyApp
