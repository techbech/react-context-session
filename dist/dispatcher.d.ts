import { SessionDispatchFunc, SessionGenericData, SessionValueType } from "./types";
export declare class Dispatcher<DataType extends SessionGenericData> {
    dispatchers: Partial<{
        [key in keyof DataType]: [SessionDispatchFunc];
    }>;
    dispatch(key: keyof DataType, value: SessionValueType): void;
    register(key: keyof DataType, dispatchFunc: SessionDispatchFunc): void;
    unregister(key: keyof DataType, dispatchFunc: SessionDispatchFunc): void;
}
