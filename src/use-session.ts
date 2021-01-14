import {
    useState,
    useEffect,
    useCallback,
    Dispatch,
    SetStateAction,
} from "react";
import { useSessionContext } from "./provider";
import { SessionGenericData } from "./types";

export function useSession<DataType extends SessionGenericData>(): <
    S extends keyof DataType
>(
    dependencies?: S[],
) => [
    { [K in S]: DataType[K] },
    <P extends keyof DataType>(key: P, value: DataType[P]) => void,
] {
    return useSessionBase;
}

export function useSessionBase<
    DataType extends SessionGenericData,
    S extends keyof DataType = keyof DataType
>(
    dependencies?: S[],
): [
    { [K in S]: DataType[K] },
    <P extends keyof DataType>(key: P, value: DataType[P]) => void,
] {
    const context = useSessionContext<DataType>();
    if (typeof context === "undefined") {
        throw new Error(
            `"useSession" is called outside a session context. Make sure to wrap your component with a "<ProvideSession data={...} />"`,
        );
    }

    const k = dependencies || [];
    const states: {
        [key: string]: [any, Dispatch<SetStateAction<any>>];
    } = {};

    for (let i = 0; i < k.length; i++) {
        // By design the dependencies cannot change, and therefore the states will always be the same
        // eslint-disable-next-line
        states[k[i] as string] = useState(context.data[k[i] as string]);
    }

    useEffect(() => {
        let didUnmount = false;

        for (let i = 0; i < k.length; i++) {
            context.dispatcher.register(k[i] as string, (value) => {
                if (!didUnmount) {
                    states[k[i] as string][1](value);
                }
            });
        }

        return () => {
            didUnmount = true;

            for (let i = 0; i < k.length; i++) {
                context.dispatcher.unregister(
                    k[i] as string,
                    states[k[i] as string][1],
                );
            }
        };
    }, []);

    const set = useCallback(
        <P extends keyof DataType>(key: P, value: DataType[P]) => {
            context.data[key] = value;

            if (context.onChange) {
                context.onChange(context.data);
            }

            context.dispatcher.dispatch(key, value);
        },
        [],
    );

    const output: any = {};
    for (let i = 0; i < k.length; i++) {
        output[k[i]] = states[k[i] as string][0];
    }

    return [output, set];
}
