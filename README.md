# react-context-session
[![NPM](https://img.shields.io/npm/v/react-context-session.svg)](https://www.npmjs.com/package/react-context-session) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save react-context-session
```

## Getting started

```tsx
import React from "react";
import {ProvideSession, useSession} from "react-context-session";

// Arbitrary session data structure
type MySessionType = {
  x: number;
  y: number;
  z: string;
}

// Create type strict hook alias
const useMySession = useSession<MySessionType>();

// Read usage
function MyCalculation() {
  const [{x,y}] = useMySession(["x", "y"]);

  return <p>{x} + {y} = {x + y}</p>;
}

// Read usage
function MyMessage() {
  const [{z}] = useMySession(["z"]);

  return <p>{z}</p>;
}

// Write usage
function MyButton() {
  const [, setValue] = useMySession();
  return <button onClick={() => setValue("z", "My new string")}>Click me</button>;
}

// Setup session in the root of your application, or at least higher in
// the component hierarchy than the component using the `useSession` hook.
// * Mandatory: Set default session values in the data prop
function MyApp() {
  return (
    <ProvideSession data={{x: 5, y: 10, z: "My string"}}>
      <MyCalculation />
      <MyMessage />
      <MyButton />
    </ProvideSession>
  )
}
```

## Multiple contexts
If your app has different sections where the session data should to be shared between, you can set up different session providers
for each section as following.
```tsx
function AdminSection() {
  return (
    <ProvideSession data={...} context={"admin"}>...</ProvideSession>
  )
}
function UserSection() {
  return (
    <ProvideSession data={...} context={"user"}>...</ProvideSession>
  )
}
```

## Save session data to storage
react-context-session has no support for saving to storage, but do instead have a callback function for every time the data changes.
Please notice that the callback only calls with updated data to its context.
```tsx
function MyProvider() {
  return (
    <ProvideSession data={...} onChange={data => {
        console.log("Your storage implementation here", data);
    }}>...</ProvideSession>
  )
}
```

## License

MIT © [Peteck](https://github.com/Peteck)
