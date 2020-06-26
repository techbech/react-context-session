import { Dispatch, SetStateAction } from "react";
import { Dispatcher } from "./dispatcher";
export declare type SessionValueType = {} | null;
export declare type SessionGenericData = {
    [key: string]: SessionValueType;
};
export declare type SessionDispatchFunc = Dispatch<SetStateAction<any>>;
export declare type SessionContextKey = string;
export declare type SessionOnChange<DataType extends SessionGenericData> = (data: DataType) => void;
export declare type SessionGenericContext<DataType extends SessionGenericData = SessionGenericData> = {
    data: DataType;
    dispatcher: Dispatcher<DataType>;
    onChange?: SessionOnChange<DataType>;
};
