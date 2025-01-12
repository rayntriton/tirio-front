import { ComponentStyle } from "./ComponentStyle"

export type AvailableThemes = 'light'|'dark'
export type Style = Record< AvailableThemes, ComponentStyle >
