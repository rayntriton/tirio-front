import { SETTINGS } from "@/feats/settings"
import { createSessionSignals, createMemorySignals, createMemory, createSession } from "@/feats/stateSystem"
import { User } from "@/feats/types"
import { IdleTimer } from "@solid-primitives/idle"
import { createContext } from "solid-js"

let AUTH_STATE = {} as AuthContext

export const getAuthState = () => AUTH_STATE

export const authState = () => {

  
  const auth = {
    ...createSession( [
      'isAuthenticated', 'setIsAuthenticated', [ false ],
      'isLocked', 'setIsLocked', [ false ],
      'user', 'setUser', [ {} as User ],
      'token', 'setToken', [ "" ],
      'sessionId', 'setSessionId', [ "" ],
      'clientReference', 'setClientReference', [ -1 ]
    ] as const ),
    ...createMemory( [
      "login", [ () => auth.setIsAuthenticated( true ) ],
      'logout', [ () => auth.setIsAuthenticated( false ) ],
      'lock', [ () => auth.setIsLocked( true ) ],
      'unlock', [ () => auth.setIsLocked( false ) ]
    ] as const ),
    
  }
  if( ! SETTINGS.PRODUCTION_ENV ){
    ( window as any ).auth = auth
  }
  AUTH_STATE = auth
  return auth
}

export type AuthContext = ReturnType< typeof authState>

export const AuthContext = createContext< AuthContext >();
