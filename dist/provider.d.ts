import { ReactNode } from "react";
import { SessionGenericContext, SessionGenericData, SessionOnChange } from "./types";
export declare function useSessionContext<DataType extends SessionGenericData>(): SessionGenericContext<DataType> | undefined;
export declare function getSessionContexts(): {};
export declare function hasSessionContext(contextKey: string): boolean;
export declare function ProvideSession<DataType extends SessionGenericData>({ children, name, data, onChange, keepOnUnmount, }: {
    children: ReactNode;
    name?: string;
    data: DataType;
    onChange?: SessionOnChange<DataType>;
    keepOnUnmount?: boolean;
}): JSX.Element;
