import React, { useEffect, useState, useCallback } from "react";
import { ProvideSession, getSessionContexts } from "../../src";
import AsyncStorage from "@react-native-community/async-storage";
//import { AppState } from "react-native";

type MySessionData = {
    x: number;
    y: number;
    z: string;
};

export function MyProvider() {
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
                name={"my-context"}
                onChange={async (data) => {
                    const jsonValue = JSON.stringify(data);
                    await AsyncStorage.setItem("session", jsonValue);
                }}>
                ...
            </ProvideSession>
        );
    }
}

export function MyProviderAppState() {
    const handleAppStateChange = useCallback(async () => {
        const contexts = getSessionContexts();
        for (const contextKey in contexts) {
            AsyncStorage.setItem(contextKey, JSON.stringify(contexts));
        }
    }, []);

    useEffect(() => {
        //AppState.addEventListener("change", handleAppStateChange);

        return () => {
            //AppState.removeEventListener("change", handleAppStateChange);
        };
    }, [handleAppStateChange]);

    // ... see above example how to load from storage
}
