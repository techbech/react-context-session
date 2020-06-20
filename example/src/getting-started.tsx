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
        <ProvideSession data={{ x: 5, y: 10, z: "My string" }}>
            <MyCalculation />
            <MyMessage />
            <MyButton />
        </ProvideSession>
    );
}

export default MyApp;
