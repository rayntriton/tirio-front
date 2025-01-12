import { createSessionSignals, createMemorySignals, createMemory, createSession } from "@/feats/stateSystem"
import { User } from "@/feats/types"
import { createContext } from "solid-js"

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
      'unlock', [ () => auth.setIsLocked( false ) ],
    ] as const ),
    
  }
  
  return auth
}

export type AuthContext = ReturnType< typeof authState>

export const AuthContext = createContext< AuthContext >();
