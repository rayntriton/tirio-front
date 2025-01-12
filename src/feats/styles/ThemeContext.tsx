import { createMemory, createSession, Setter, useMemory } from "@/feats/stateSystem"
import { buttonTheme, inputTheme, paragraphTheme } from "./GeneralTheme"
import { createContext } from "solid-js"
import { AvailableThemes } from "@/feats/styles/types"

let counter = 0

export const themeState = () => {
  const [ button, setButton ] = useMemory( "" )
  setButton( "" )
  const themeSession = {
    ...createSession( [
      'theme', 'setTheme', [ 'dark' as AvailableThemes ],
    ] as const )
  }
  const themeMemory = {
      'button': ( value = '' ) => {
        return  buttonTheme[ themeSession.theme() ].getStyle( value )
      },
      'paragraph': ( value = '' ) => {
        return  paragraphTheme[ themeSession.theme() ].getStyle( value )
      },
      'input': ( value = '' ) => {
        return  inputTheme[ themeSession.theme() ].getStyle( value )
      },
  }
  console.log( 'themeState: count', counter ++, 'return', { ...themeSession, ...themeMemory } )
  return { ...themeSession, ...themeMemory }
}

export type ThemeContext = ReturnType< typeof themeState >

export const ThemeContext = createContext< ThemeContext >();
