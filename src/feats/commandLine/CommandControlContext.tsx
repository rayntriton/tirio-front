import { AuthContext } from "@/feats/authentication"
import { CommandLine } from "./CommandLine"
import { searchCustomers, searchProducts, searchUsers } from "./commands"
import { handleCommandLine } from "./handleCommandLine"
import { GlobalContext } from "@/feats/globalState"
import { createMemory } from "@/feats/stateSystem"
import { InputEventDOMInput, KeyboardEventDOMInput, PublicItem } from "@/feats/types"
import { createContext } from "solid-js"
import { NavigateOptions, Navigator } from "@solidjs/router"

let COMMAND_CONTROL_STATE = {} as CommandControlContext

export const getCommandControlState = () => COMMAND_CONTROL_STATE

export const commandControlState = ( global:GlobalContext, auth:AuthContext ) =>{
  const local = { 
    ...createMemory( [
      'highlight', 'setHighlight', [ 0 ],
      'commandLineValue', 'setCommandLineValue', [ '' ],
      'isItemSelected', 'setIsItemSelected', [ false ],
      'isCustomersCatalogVisible', 'setIsCustomersCatalogVisible',  [ false ],
      'isProductsCatalogVisible', 'setIsProductsCatalogVisible',  [ false ],
      'isUsersCatalogVisible', 'setIsUsersCatalogVisible',  [ false ],
      'commandLine', '_setCommandLine', [ {} as CommandLine ],
      'searchProducts', [ () => {
        const args = local.commandLine().args
        console.log( "CommandControl:searchProductsTask args", args )
        searchProducts( global, local, auth )
      } ],
      'searchCustomers', [ () => {
        const args = local.commandLine().args
        console.log( "CommandControl:searchProductsTask args", args )
        searchCustomers( global, local, auth )
      } ],
      'searchUsers', [ () => {
        const args = local.commandLine().args
        console.log( "CommandControl:searchProductsTask args", args )
        searchUsers( global, local, auth )
      } ],
      'preventDefault', [ ( event:any ) => {
        if(
          event.key == 'ArrowUp' ||
          event.key == 'ArrowDown' ||
          event.key == 'Escape' ||
          event.key == 'Enter' 
        )( event as KeyboardEventDOMInput ).preventDefault()
      } ],
      'setCommandLine', [ ( event:any, currentValue:string ) => {
        const commandLine = new CommandLine( event as InputEventDOMInput, currentValue ) 
        console.log( "CommandControl:setCommandLine commandLine", commandLine )
        return local._setCommandLine( commandLine )
      } ],
      'handleKeyDownTask', [ ( event:any ) => {
        handleCommandLine( global, auth, local )
      } ],
      'warning', 'setWarning', [ '' ],
      'error', 'setError', [ '' ]
    ] as const ),
    ...createMemory( [
      'cleanPrompt', [ () => {
        const prompt = document.querySelector( '#commandLine' )! as HTMLInputElement;
        prompt.focus()
        local.setCommandLineValue( '' )
        local.setIsProductsCatalogVisible( false )
        local.setIsCustomersCatalogVisible( false )
        local.setIsUsersCatalogVisible( false )
        local.setHighlight( 0 )
        global.setItemsFound( [] )
        global.setCustomersFound( [] )
      } ],
      'navigator', 'setNavigator', [ {} as { navigate:Navigator } ],
      'navigate', [ ( to:string, options?:Partial< NavigateOptions > ) => {
        local.navigator().navigate( to, options )
      } ],
      'appendProduct', [ ( item:PublicItem ) => {
        global.addItem( item )
      } ]
    ] as const )
  };
  ( window as any ).commandControl = local
  COMMAND_CONTROL_STATE = local
  return local
}

export type CommandControlContext = ReturnType< typeof commandControlState>

export const CommandControlContext = createContext< CommandControlContext >();
