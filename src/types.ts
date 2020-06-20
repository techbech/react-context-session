import { Dispatch, SetStateAction } from 'react'

export type SessionGenericData = { [key: string]: any }
export type SessionGenericDispatcher = {
  [key: string]: [Dispatch<SetStateAction<any>>]
}
export type SessionContextKey = string
export type SessionOnChange = (data: any) => void;
export type SessionGenericContext = {
  data?: SessionGenericData;
  dispatcher: SessionGenericDispatcher;
  onChange?: SessionOnChange;
}
