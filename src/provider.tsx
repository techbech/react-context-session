import React, { createContext, ReactNode } from 'react'
import { SessionContextKey, SessionGenericData } from './types'
import { initializeSession } from './index'

export const SessionContext = createContext<SessionContextKey>('default')

export function ProvideSession({
  children,
  context,
  data,
  onChange,
}: {
  children: ReactNode;
  context?: string;
  data: SessionGenericData;
  onChange?: (data: any) => void;
}) {
  initializeSession(context || 'default', data, onChange)
  return (
    <SessionContext.Provider value={context || 'default'}>
      {children}
    </SessionContext.Provider>
  )
}
