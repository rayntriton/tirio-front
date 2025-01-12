import { AuthContext, useAuth } from "@/feats/authentication";
import { CommandLine, handleCommandLine } from "@/feats/commandLine";
import { SearchProducts } from "@/feats/components/searchProducts";
import { SelectedItems } from "@/feats/components/selectedItems";
import { GlobalContext, useGlobal } from "@/feats/globalState";
import { InputEventDOMInput, KeyboardEventDOMInput } from "@/feats/types";
import { onMount, Show } from "solid-js";
import { searchProducts } from '@/feats/commandLine/commands'
import { createMemorySignals } from "@/feats/stateSystem";
import { useTheme } from "@/feats/styles";

export type CommandControlContext = ReturnType< typeof commandControlState >
export const commandControlState = ( global:GlobalContext, auth:AuthContext ) =>{
  const local = 
    { 
      ...createMemorySignals( [ 'highlight', 'setHighlight' ], 0 ),
      ...createMemorySignals( [ 'isItemSelected', 'setIsItemSelected' ], false ),
      ...createMemorySignals( [ 'isVisible', 'setIsVisible' ], false ),
      ...createMemorySignals( [ 'searchProducts' ],
        () => {
          const args = global.commandLine().args
          console.log( "CommandControl:searchProductsTask args", args )
          searchProducts( global, auth, args! )
        } ),
      ...createMemorySignals( [ 'preventDefault' ],
        ( event:any ) => {
          if(
            event.key == 'ArrowUp' ||
            event.key == 'ArrowDown' ||
            event.key == 'Escape' ||
            event.key == 'Enter' 
          )( event as KeyboardEventDOMInput ).preventDefault()
        } ),
      ...createMemorySignals( [ 'setCommandLine' ],
        ( event:any ) => {
          const commandLine = new CommandLine( event as InputEventDOMInput ) 
          console.log( "CommandControl:setCommandLine commandLine", commandLine )
          global.setCommandLine( commandLine )
        } ),
      ...createMemorySignals( [ 'handleKeyDownTask' ], 
        ( event:any ) => {
          handleKeyDown( global, auth, local, event )
        } ),
      ...createMemorySignals( [ 'warning', 'setWarning' ], '' ),
      ...createMemorySignals( [ 'error', 'setError' ], '' ),
      ...createMemorySignals( [ 'handleCommandKind' ],
        () => {
          handleCommandLine( global, auth, local )
        } )
    }
    return local
}

export function CommandControl(){
  const auth = useAuth()
  const global = useGlobal()
  const theme = useTheme()
  const local = commandControlState( global, auth )
  

  const handleInputEvent = ( event:any ) => {
    local.preventDefault( event )
    console.log( "CommandControl:handleInputEvent event", event.explicitOriginalTarget )
    local.setCommandLine( event )
    local.handleKeyDownTask( event )
  }
  onMount( () => {
    document.getElementById( "commandLine" )?.focus()
  } )
  
  return ( 
    <>
      <div  class = "w-screen flex items-center justify-center content-center" >
        <input class = { theme.input() }
          id = 'commandLine'
          onkeydown = { ( event ) => {
            handleInputEvent( event ) } }
        />
        <label class = "text-yellow-400" >{ local.warning() }</label>
        <label class = "text-red-600" >{ local.error() }</label>
      </div>
      <Show when = { local.isVisible() } >
        <SearchProducts elements={ global.itemsFound() } highlight={ local.highlight() } setHighlight = { local.setHighlight  } />
      </Show>
      {/*<SelectedItems elements={ global.publicItems() } />*/}
      <div id = "itemsList" ></div>
      <div id = "searchResultSet" ></div>
    </>
  )
}

function handleKeyDown(
    global:GlobalContext,
    auth:AuthContext,
    local:CommandControlContext,
    event:KeyboardEventDOMInput ){
  
  const commandLine = global.commandLine()
  const kind = commandLine.kind
  console.log( 'CommandControl: handleKeyDown commandLine', commandLine )
  if( kind == 'retrieve' ){
    local.searchProducts()
  }
  
  if( commandLine.isDynamicCatalogMode ){
    const itemsSize = global.itemsFound().length
    if( event.key == 'ArrowUp' ){
      event.preventDefault()
      local.setHighlight( ( value:number ) => {
        if( value == 0 ) return itemsSize - 1
        return value - 1
      } )
    }
    else if( event.key == 'ArrowDown' ){
      event.preventDefault()
      local.setHighlight( ( value:number ) => {
        if( value == itemsSize - 1 ) return 0
        return value + 1
      } )
    }
    else if( event.key == 'Enter' ){
      event.preventDefault()
      const highlight = local.highlight()
      const item = global.itemsFound()[ highlight ]
      console.log( 'CommandControl: handleKeyDown(Enter) highlight, item', highlight, item )

      global.setPublicItems( items => {
        items.unshift( item )
        return items
      } )
      //setIsItemSelected( true )
      //setHighlight( 0 )
      //setIsVisible( false )
      event.currentTarget.value = ""
    }
    else if( event.key == 'Escape' ){
      //setHighlight( 0 )
      //setIsVisible( false )
    }
    else{
      if( global.commandLine().isDynamicCatalogMode ){
        //setIsVisible( true )
      }
      if( global.commandLine().command = "" ){
        //setIsVisible( false )
      }
    }
  }
}
