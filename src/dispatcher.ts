import {
    SessionDispatchFunc,
    SessionGenericData,
    SessionValueType,
} from "./types";

export class Dispatcher<DataType extends SessionGenericData> {
    dispatchers: Partial<
        {
            [key in keyof DataType]: [SessionDispatchFunc];
        }
    > = {};

    dispatch(key: keyof DataType, value: SessionValueType): void {
        if (typeof this.dispatchers[key] === "undefined") {
            return;
        }

        for (let i = 0; i < this.dispatchers[key]!.length; i++) {
            this.dispatchers[key][i](value);
        }
    }

    register(key: keyof DataType, dispatchFunc: SessionDispatchFunc): void {
        if (typeof this.dispatchers[key] === "undefined") {
            this.dispatchers[key] = [dispatchFunc];
        } else {
            this.dispatchers[key]!.push(dispatchFunc);
        }
    }

    unregister(key: keyof DataType, dispatchFunc: SessionDispatchFunc): void {
        if (typeof this.dispatchers[key] === "undefined") {
            return;
        }

        for (let j = 0; j < this.dispatchers[key]!.length; j++) {
            if (this.dispatchers[key][j] === dispatchFunc) {
                this.dispatchers[key]!.splice(j, 1);
            }
        }
    }
}
