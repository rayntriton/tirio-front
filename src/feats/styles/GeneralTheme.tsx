import { useTheme } from "./ThemeProvider"
import { ComponentStyle, createtStyle } from "./ComponentStyle"
import { AvailableThemes, Style } from "./types"

export const buttonTheme:Style = {
  dark:createtStyle( () => {
    return new ComponentStyle( 
      ( <p class = { `bg-gray-800 hover:bg-cyan-800` } ></p> as any ).getAttribute( 'class' ),
      ( <p class = { `` } ></p> as any ).getAttribute( 'class' ),
      ( <p class = { `rounded-md p-2 m-2` } ></p> as any ).getAttribute( 'class' ),
    ) } ),
  light: ( ( <button class = {
    `m-2 p-1 bg-slate-700 bg-opacity-50 rounded-md hover:bg-blue-400`
  } ></button> ) as any ).getAttribute( 'class' )
}

export const buttonLargeTheme = {
  darkk: buttonTheme.dark.newSpacing( '' )
}

export const paragraphTheme:Style = {
  dark:createtStyle( () => {
    return new ComponentStyle( 
      ( <p class = { `` } ></p> as any ).getAttribute( 'class' ),
      ( <p class = { `` } ></p> as any ).getAttribute( 'class' ),
      ( <p class = { `m-2 p-1` } ></p> as any ).getAttribute( 'class' ),
    ) } ),
  light: ( ( <button class = {
    `m-2 p-1 bg-slate-700 bg-opacity-50 rounded-md hover:bg-blue-400`
  } ></button> ) as any ).getAttribute( 'class' )
}

export const inputTheme:Style = {
  dark:createtStyle( () => {
    return new ComponentStyle( 
      ( <p class = { `bg-gray-700 hover:bg-gray-600` } ></p> as any ).getAttribute( 'class' ),
      ( <p class = { `` } ></p> as any ).getAttribute( 'class' ),
      ( <p class = { `rounded-md p-2 m-2` } ></p> as any ).getAttribute( 'class' ),
    ) } ),
  light: ( ( <button class = {
    `m-2 p-1 bg-slate-700 bg-opacity-50 rounded-md hover:bg-blue-400`
  } /> ) as any ).getAttribute( 'class' )
}

const Any:HTMLElement = <p></p> as HTMLElement