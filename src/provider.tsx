import React, { createContext, ReactNode, useContext, useEffect } from "react";
import {
    SessionContextKey,
    SessionGenericContext,
    SessionGenericData,
    SessionOnChange,
} from "./types";
import { Dispatcher } from "./dispatcher";

const ReactSessionContext = createContext<SessionContextKey>("default");
let sessionContexts: {
    [key: string]: SessionGenericContext | undefined;
} = {};

export function useSessionContext<DataType extends SessionGenericData>() {
    return sessionContexts[useContext<string>(ReactSessionContext)] as
        | SessionGenericContext<DataType>
        | undefined;
}

function initializeSession(
    contextKey: SessionContextKey,
    data: SessionGenericData,
    onChange?: SessionOnChange<SessionGenericData>,
) {
    if (!sessionContexts[contextKey]) {
        // Deep clone data to get rid of references to data argument
        const cloneData = JSON.parse(JSON.stringify(data));

        sessionContexts[contextKey] = {
            data: cloneData,
            dispatcher: new Dispatcher<SessionGenericData>(),
            onChange,
        };
    }
}

export function clearSessionContexts() {
    sessionContexts = {};
}

export function ProvideSession<DataType extends SessionGenericData>({
    children,
    context,
    data,
    onChange,
}: {
    children: ReactNode;
    context?: string;
    data: DataType;
    onChange?: SessionOnChange<DataType>;
}) {
    initializeSession(
        context || "default",
        data,
        onChange as SessionOnChange<SessionGenericData>,
    );

    useEffect(() => {
        return clearSessionContexts;
    }, []);

    return (
        <ReactSessionContext.Provider value={context || "default"}>
            {children}
        </ReactSessionContext.Provider>
    );
}
