import { Component, useContext } from "solid-js";
import { ChildrenProps } from '@/feats/types'
import { ThemeContext, themeState } from "./ThemeContext";

export const ThemeProvider:Component< ChildrenProps > = ( props ) => {

  const theme = themeState()

  return (
    <ThemeContext.Provider value = { theme } >
      { props.children }
    </ThemeContext.Provider>
  )

}

export function useTheme() {
  return useContext( ThemeContext )!
}
