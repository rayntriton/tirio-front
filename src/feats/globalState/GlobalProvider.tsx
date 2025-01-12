import { GlobalContext, globalState } from "./GlobalContext";
import { ChildrenProps } from "@/feats/types";
import { useContext } from "solid-js";

export const GlobalProvider = ( props:ChildrenProps ) => {

  const global = globalState()

  const provider = (
    <GlobalContext.Provider value = { global } >
      { props.children }
    </GlobalContext.Provider>
  )
  return provider
}

export function useGlobal() {
  return useContext( GlobalContext )!
}