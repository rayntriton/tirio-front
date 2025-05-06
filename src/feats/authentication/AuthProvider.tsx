import { AuthContext } from "./AuthContext";
import { Component, useContext } from "solid-js";
import { ChildrenProps } from '@/feats/types'
import { authState } from "@/feats/authentication";
import { createIdleTimer } from "@solid-primitives/idle";
import { useNavigate } from "@solidjs/router";

export const AuthProvider:Component< ChildrenProps > = ( props ) => {

  const auth = authState()

  return (
    <AuthContext.Provider value={ auth } >
      { props.children }
    </AuthContext.Provider>
  )

}

export function useAuth() {
  return useContext( AuthContext )!
}
