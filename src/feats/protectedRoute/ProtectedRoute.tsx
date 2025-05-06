import { useAuth } from "@/feats/authentication";
import { getValue } from "@/feats/stateSystem";
import { ChildrenProps } from "@/feats/types";
import { Navigate, useLocation } from "@solidjs/router";
import { Component, Show } from "solid-js";

export const ProtectedRoute:Component< ChildrenProps > = ( props ) => {
  const location = useLocation()
  const auth = useAuth()

  console.log( "ProtectedRoute: isauthenticated", auth.isAuthenticated() )
  

  return (
    <div>
      <Show
          when={ auth.isAuthenticated() }
          fallback = { <Navigate href = "/login" state = { { from: location.pathname } } /> } >
        { props.children }
      </Show>
    </div>
  )
}
