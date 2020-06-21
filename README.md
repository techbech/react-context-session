# react-context-session
[![NPM](https://img.shields.io/npm/v/@peteck/react-context-session.svg)](https://www.npmjs.com/package/@peteck/react-context-session) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

react-context-session is designed to minimize the number of rerenders, but still offer an elegant type-strict API that make development easy and fast.
With one generic `useSession` hook, and one context provider `<ProvideSession />`, you will be up and ready to go, using your own session data structure.
The session state dispatcher makes sure that only the requested session data properties will cause the necessary side effects and rerendering.

## Install

```bash
npm install --save @peteck/react-context-session
```

## Getting started

```tsx
import React from "react";
import { ProvideSession, useSession } from "react-context-session";

type MySessionType = {
    x: number;
    y: number;
    z: string;
};

// Create type strict hook alias
const useMySession = useSession<MySessionType>();

// Read usage
function MyCalculation() {
    const [{ x, y }] = useMySession(["x", "y"]);

    return (
        <p>
            {x} + {y} = {x + y}
        </p>
    );
}

// Read usage
function MyMessage() {
    const [{ z }] = useMySession(["z"]);

    return <p>{z}</p>;
}

// Write usage
function MyButton() {
    const [, setValue] = useMySession();
    return (
        <button onClick={() => setValue("z", "My new string")}>Click me</button>
    );
}

// Setup session in the root of your application, or at least higher in
// the component hierarchy than the component using the `useSession` hook.
// * Mandatory: Set default session values in the data prop
function MyApp() {
    return (
        <ProvideSession <MySessionType> data={{ x: 5, y: 10, z: "My string" }}>
            <MyCalculation />
            <MyMessage />
            <MyButton />
        </ProvideSession>
    );
}
```

## Multiple contexts
If your app has different sections where the session data should to be shared between, you can set up different session providers
for each section as following.
```tsx
function AdminSection() {
    return (
        <ProvideSession <MySessionType> data={...} context={"admin"}>...</ProvideSession>
    )
}
function UserSection() {
    return (
        <ProvideSession <MySessionType> data={...} context={"user"}>...</ProvideSession>
    )
}
```

## Save session data to storage
react-context-session has no support for saving to storage, but do instead have a callback function for every time the data changes.
Please notice that multiple contexts is still supported with this feature, and the callback only calls with updated data to its context.
Here is an example how one could implement storage with with [react-native-community/async-storage](https://github.com/react-native-community/async-storage)
```tsx
type MySessionType = {
    x: number;
    y: number;
    z: string;
};

function MyProvider() {
    const [defaultData, setDefaultData] = useState<MySessionData>();
    useEffect(() => {
        AsyncStorage.getItem("session").then((value) => {
            if (value !== null) {
                setDefaultData(JSON.parse(value) as MySessionData);
            } else {
                // If no session data was found in storage, we still need to give an default data set
                setDefaultData({
                    x: 5,
                    y: 5,
                    z: "My String",
                });
            }
        });
    }, []);

    if (!defaultData) {
        return <p>Loading session data, please wait..</p>;
    } else {
        return (
            <ProvideSession
                data={defaultData}
                context={"my-context"}
                onChange={async (data) => {
                    const jsonValue = JSON.stringify(data);
                    await AsyncStorage.setItem("session", jsonValue);
                }}>
                ...
            </ProvideSession>
        );
    }
}
```

## The gotcha's
##### No deep session data comparison
The dispatcher only offer side effect on 1 level, meaning that, changes to a nested data of a data property, will cause that property to cause a side effect or rerender.

##### Required dependencies given to `useSession` must be constant
It's not possible to give a changing dependency to the `useSession` hook. The requested dependencies must never change inside a component.


## License

MIT © [Peteck](https://github.com/Peteck)
