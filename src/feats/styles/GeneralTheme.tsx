import { useTheme } from "./ThemeProvider"
import { ComponentStyle, createtStyle } from "./ComponentStyle"
import { AvailableThemes, Style } from "./types"

export const buttonTheme:Style = {
  dark:createtStyle( () => {
    <button class = {
      `m-2 p-1 bg-slate-700 bg-opacity-50 rounded-md hover:bg-cyan-800`
    } ></button>
    return new ComponentStyle(
      'bg-slate-700 bg-opacity-50 hover:bg-cyan-800', 'm-2 p-1', 'rounded-md' )
  } ) ,
  light: ( ( <button class = {
    `m-2 p-1 bg-slate-700 bg-opacity-50 rounded-md hover:bg-blue-400`
  } ></button> ) as any ).getAttribute( 'class' )
}

export const paragraphTheme:Style = {
  dark:createtStyle( () => {
    <p class = {
      `bg-slate-800 border-0 opacity-50 m-2 p-1`
    } ></p>
    return new ComponentStyle(
      '', 'm-2 p-1' )
  } ) ,
  light: ( ( <button class = {
    `m-2 p-1 bg-slate-700 bg-opacity-50 rounded-md hover:bg-blue-400`
  } ></button> ) as any ).getAttribute( 'class' )
}

export const inputTheme:Style = {
  dark:createtStyle( () => {
    <input class = {
      `w-full h-7 bg-gray-700 rounded-md p-2 m-2 `
    } ></input>
    return new ComponentStyle(
      'bg-gray-700', 'w-full h-7', 'rounded-md p-2 m-2' )
  } ) ,
  light: ( ( <button class = {
    `m-2 p-1 bg-slate-700 bg-opacity-50 rounded-md hover:bg-blue-400`
  } /> ) as any ).getAttribute( 'class' )
}
