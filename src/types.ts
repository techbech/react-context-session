import { Dispatch, SetStateAction } from "react";
import { Dispatcher } from "./dispatcher";

export type SessionValueType = {} | null | undefined;
export type SessionGenericData = { [key: string]: SessionValueType };
export type SessionDispatchFunc = Dispatch<SetStateAction<any>>;
export type SessionContextKey = string;
export type SessionOnChange<DataType extends SessionGenericData> = (
    data: DataType,
) => void;
export type SessionGenericContext<
    DataType extends SessionGenericData = SessionGenericData
> = {
    data: DataType;
    dispatcher: Dispatcher<DataType>;
    onChange?: SessionOnChange<DataType>;
};
