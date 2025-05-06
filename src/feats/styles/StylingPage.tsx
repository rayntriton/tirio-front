import { SETTINGS } from "@/feats/settings"
import { useTheme } from "./ThemeProvider"

export function StylingPage(){

  const theme = useTheme()
  return (
    <>
      <button class = { theme.button() } >button</button>
      <p class = { theme.paragraph() } >this is a paragraph</p>
      <input class = { theme.input() } />
      <input class = { theme.input( SETTINGS.PORTABLE ? 'w-screen' : 'w-6/12' ) } />
    </>
  )
  
}