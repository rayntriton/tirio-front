import { CommandControlContext } from "@/feats/commandLine";
import { GlobalContext } from "@/feats/globalState";
import { SETTINGS } from "@/feats/settings";
import { it } from "node:test";

export function productCommand( global:GlobalContext, local:CommandControlContext ){
  const commandLine = local.commandLine()
  const event = commandLine.event
  //local.setHighlight( 0 )
  if( commandLine.allowFetching ){
    local.searchProducts()
    local.setHighlight( 0 )
  }
  local.setIsProductsCatalogVisible( true )
    .then( () => {
      const itemsSize = global.itemsFound().length > SETTINGS.MAX_DYNAMIC_CATALOG_SIZE
        ? SETTINGS.MAX_DYNAMIC_CATALOG_SIZE
        : global.itemsFound().length
      if( event.key == 'ArrowUp' ){
        local.setHighlight( ( value:number ) => {
          if( value == 0 ) return itemsSize - 1
          return value - 1
        } )
      }
      else if( event.key == 'ArrowDown' ){
        local.setHighlight( ( value:number ) => {
          if( value == itemsSize - 1 ) return 0
          return value + 1
        } )
      }
      else if( event.key == 'Enter' ){
        const highlight = local.highlight()
        const item = global.itemsFound()[ highlight ]
        if( item == undefined ) return
        console.log( 'CommandControl: handleKeyDown(Enter) highlight, item', highlight, item )
        global.addItem( item )
        local.cleanPrompt()
        //local.setIsProductsCatalogVisible( false )
        /*global.commandLine().event.explicitOriginalTarget.value = ''
        global.commandLine().value = ''
        global.commandLine().event.explicitOriginalTarget.focus()
        global.setItemsFound( [] )
        */
        //setIsItemSelected( true )
        //setHighlight( 0 )
        //setIsVisible( false )
        event.currentTarget.value = ""
      }
      else if( event.key == 'Escape' ){
        local.setIsProductsCatalogVisible( false )
        //setHighlight( 0 )
        //setIsVisible( false )
      }
      else{
        if( local.commandLine().isDynamicCatalogMode ){
          //setIsVisible( true )
        }
        if( local.commandLine().command = "" ){
          //setIsVisible( false )
        }
      }
    } )
}