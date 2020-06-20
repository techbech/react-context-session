import {
  useState,
  useEffect,
  useCallback,
  useContext,
  Dispatch,
  SetStateAction
} from 'react'
import {
  SessionContextKey,
  SessionGenericContext,
  SessionGenericData,
  SessionOnChange
} from './types'
import { SessionContext } from './provider'
export { ProvideSession } from './provider'

const sessionContexts: { [key: string]: SessionGenericContext } = {}

export function initializeSession(
  contextKey: SessionContextKey,
  data: SessionGenericData,
  onChange?: SessionOnChange
) {
  if (!sessionContexts[contextKey]) {
    sessionContexts[contextKey] = { data: data, dispatcher: {}, onChange }
  }
}

export function useSession<DataType>(): <S extends keyof DataType>(
  dependencies?: S[]
) => [
  { [K in S]: DataType[K] },
  <P extends keyof DataType>(key: P, value: DataType[P]) => void
] {
  return useSessionBase
}

export function useSessionBase<
  DataType,
  S extends keyof DataType = keyof DataType
>(
  dependencies?: S[]
): [
  { [K in S]: DataType[K] },
  <P extends keyof DataType>(key: P, value: DataType[P]) => void
] {
  const context = sessionContexts[useContext<string>(SessionContext)]
  if (typeof context === 'undefined' || typeof context.data === 'undefined') {
    throw new Error(
      `Call "initializeSession({...defaultValues})" before using "useSession(...)".`
    )
  }

  const k = dependencies || []
  const states: {
    [key: string]: [any, Dispatch<SetStateAction<any>>]
  } = {}

  for (let i = 0; i < k.length; i++) {
    // eslint-disable-next-line
    states[k[i] as string] = useState(context.data[k[i] as string]);
  }

  useEffect(() => {
    for (let i = 0; i < k.length; i++) {
      if (typeof context.dispatcher[k[i] as string] === 'undefined') {
        context.dispatcher[k[i] as string] = [states[k[i] as string][1]]
      } else {
        context.dispatcher[k[i] as string].push(states[k[i] as string][1])
      }
    }

    return () => {
      for (let i = 0; i < k.length; i++) {
        for (let j = 0; j < context.dispatcher[k[i] as string].length; j++) {
          if (
            context.dispatcher[k[i] as string][j] === states[k[i] as string][1]
          ) {
            context.dispatcher[k[i] as string].splice(j, 1)
          }
        }
      }
    }
    // eslint-disable-next-line
  }, []);

  const set = useCallback(
    (key, value) => {
      if (!context.data) {
        return
      }

      context.data[key] = value

      if (context.onChange) {
        context.onChange(context.data)
      }

      if (!context.dispatcher[key]) {
        return
      }

      for (let i = 0; i < context.dispatcher[key].length; i++) {
        context.dispatcher[key][i](value)
      }
    },
    // eslint-disable-next-line
    []
  )

  const output: any = {}
  for (let i = 0; i < k.length; i++) {
    output[k[i]] = states[k[i] as string][0]
  }

  return [output, set]
}
