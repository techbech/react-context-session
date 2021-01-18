# react-context-session
[![NPM](https://img.shields.io/npm/v/@peteck/react-context-session.svg)](https://www.npmjs.com/package/@peteck/react-context-session) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

react-context-session is designed to minimize the number of rerenders, but still offer an elegant type-strict API that make development easy and fast.
With one generic `useSession` hook, and one context provider `<ProvideSession />`, you will be up and ready to go, using your own session data structure.
The session state dispatcher makes sure that only the requested session data properties will cause the necessary side effects and rerendering.

This library also works with JavaScript projects. [See a more about this in "Getting started".](#getting-started)

## Install

```bash
npm install --save @peteck/react-context-session
```

## Getting started

The example below is written in TypeScript. [See this codesandbox for a JavaScript example.](https://codesandbox.io/s/admiring-rgb-n1xn6)

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
        // Optional name for the context can be set with the "name" property
        // ... for easier access for it's data with `getSessionContexts()`
        // If no name is given, react-context-session will set an arbitrary name
        <ProvideSession <MySessionType> data={...} name={"admin"}>...</ProvideSession>
    )
}
function UserSection() {
    return (
        <ProvideSession <MySessionType> data={...} name={"user"}>...</ProvideSession>
    )
}
```

To keep the session data for a context between mount and dismount of the `<ProvideSession />` component, one could set a name for the context and add the `keepOnUnmount` property.

```
function UserSection() {
    return (
        <ProvideSession <MySessionType> data={...} context={"user"} keepOnUnmount>...</ProvideSession>
    )
}
```
## Save session data to storage
react-context-session has no built-in support for saving to storage, but do instead have a callback for every time the data changes, and also has a global method to fetch the current contexts' data.
Please notice that multiple contexts is still supported with this feature, and the callback only calls with updated data to its own context.

##### On session data change [React Native]
This example shows how one could implement session persistence with [react-native-community/async-storage](https://github.com/react-native-community/async-storage).
It will load saved session data from storage and put it into a context, and update the storage on any changes to the session data on that same context.
```tsx
import AsyncStorage from "@react-native-community/async-storage";

type MySessionType = {
    x: number;
    y: number;
    z: string;
};

function MyProvider() {
    const [defaultData, setDefaultData] = useState<MySessionData>();
    useEffect(() => {
        AsyncStorage.getItem("my-session").then((value) => {
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
                name={"my-session-context"}
                onChange={async (data) => {
                    const jsonValue = JSON.stringify(data);
                    await AsyncStorage.setItem("my-session", jsonValue);
                }}>
                ...
            </ProvideSession>
        );
    }
}
```

##### On app state change [React Native]
Saving the session data to storage, every time it changes, can be rather expensive and could be avoided by listening to [app state changes](https://reactnative.dev/docs/appstate.html) such as: `active | inactive | background`.
Notice this doesn't guarantee the data will be saved if the app crashes.
This example shows how one would save to async storage whenever the app state changes with help from: `getSessionContexts()`
```tsx
import { ProvideSession, getSessionContexts } from "react-context-session";
import { AppState } from "react-native";

function MyProvider() {
    const [defaultData, setDefaultData] = useState<MySessionData>();

    const handleAppStateChange = useCallback(async () => {
        const contexts = getSessionContexts();
        for (const contextKey in contexts) {
            AsyncStorage.setItem(contextKey, JSON.stringify(contexts));
        }
    }, []);

    useEffect(() => {
        AppState.addEventListener("change", handleAppStateChange);

        return () => {
          AppState.removeEventListener("change", handleAppStateChange);
        };
    }, [handleAppStateChange]);

    // ... see above example on how to load from storage
}
```

## The gotcha's
##### No deep session data comparison
The dispatcher only offer side effect on 1 level, meaning that, changes to a nested data of a data property, will cause that property to cause a side effect or rerender.

##### Required dependencies given to `useSession` must be constant
It's not possible to give a changing dependency to the `useSession` hook. The requested dependencies must never change inside a component.


## License

MIT © [Peteck](https://github.com/Peteck)
