import { SessionGenericData } from "./types";
export declare function useSession<DataType extends SessionGenericData>(): <S extends keyof DataType>(dependencies?: S[]) => [{
    [K in S]: DataType[K];
}, <P extends keyof DataType>(key: P, value: DataType[P]) => void];
export declare function useSessionBase<DataType extends SessionGenericData, S extends keyof DataType = keyof DataType>(dependencies?: S[]): [{
    [K in S]: DataType[K];
}, <P extends keyof DataType>(key: P, value: DataType[P]) => void];
