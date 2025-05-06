import { Component, useContext } from "solid-js";
import { ChildrenProps } from '@/feats/types'
import { useAuth } from "@/feats/authentication";
import { CommandControlContext, commandControlState } from './CommandControlContext'
import { useGlobal } from "@/feats/globalState";

export const CommandControlProvider:Component< ChildrenProps > = ( props ) => {
  
  const global = useGlobal()
  const auth = useAuth()
  const commandControl = commandControlState( global, auth )

  return (
    <CommandControlContext.Provider value={ commandControl } >
      { props.children }
    </CommandControlContext.Provider>
  )

}

export function useCommandControl() {
  return useContext( CommandControlContext )!
}
