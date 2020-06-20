import React, { useEffect, useState } from "react";
import { ProvideSession } from "../../src";
import AsyncStorage from "@react-native-community/async-storage";

type MySessionType = {
    x: number;
    y: number;
    z: string;
};

export function MyProvider() {
    const [defaultData, setDefaultData] = useState<MySessionType>();
    useEffect(() => {
        AsyncStorage.getItem("session").then((value) => {
            if (value !== null) {
                setDefaultData(JSON.parse(value) as MySessionType);
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
