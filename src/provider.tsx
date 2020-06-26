import React, {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useState,
} from "react";
import {
    SessionContextKey,
    SessionGenericContext,
    SessionGenericData,
    SessionOnChange,
} from "./types";
import { Dispatcher } from "./dispatcher";
import cloneDeep from "lodash.clonedeep";

const ReactSessionContext = createContext<SessionContextKey>("default");

type SessionContexts = {
    [key: string]: SessionGenericContext | undefined;
};
const sessionContexts: SessionContexts = {};

export function useSessionContext<DataType extends SessionGenericData>() {
    return sessionContexts[useContext<string>(ReactSessionContext)] as
        | SessionGenericContext<DataType>
        | undefined;
}

export function getSessionContexts() {
    const data = {};
    for (const i in sessionContexts) {
        data[i] = cloneDeep(sessionContexts);
    }
    return data;
}

export function hasSessionContext(contextKey: string) {
    return !!sessionContexts[contextKey];
}

function initializeSession(
    contextKey: SessionContextKey,
    data: SessionGenericData,
    onChange?: SessionOnChange<SessionGenericData>,
) {
    if (!hasSessionContext(contextKey)) {
        sessionContexts[contextKey] = {
            data: cloneDeep(data),
            dispatcher: new Dispatcher<SessionGenericData>(),
            onChange,
        };
    }
}

function clearSessionContext(contextKey: string) {
    delete sessionContexts[contextKey];
}

function getUniqueContextName() {
    return `default-${Date.now()}-${Math.floor(Math.random() * 999999)}`;
}

export function ProvideSession<DataType extends SessionGenericData>({
    children,
    name,
    data,
    onChange,
    keepOnUnmount,
}: {
    children: ReactNode;
    name?: string;
    data: DataType;
    onChange?: SessionOnChange<DataType>;
    keepOnUnmount?: boolean;
}) {
    const [contextKey] = useState<string>(name || getUniqueContextName);

    initializeSession(
        contextKey,
        data,
        onChange as SessionOnChange<SessionGenericData>,
    );

    useEffect(() => {
        return () => {
            if (!keepOnUnmount) {
                clearSessionContext(contextKey);
            }
        };
    });

    return (
        <ReactSessionContext.Provider value={contextKey}>
            {children}
        </ReactSessionContext.Provider>
    );
}
