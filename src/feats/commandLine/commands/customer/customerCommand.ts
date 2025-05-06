import { CommandControlContext } from "@/feats/commandLine";
import { GlobalContext } from "@/feats/globalState";
import { SETTINGS } from "@/feats/settings";

export function customerCommand( global:GlobalContext, commandControl:CommandControlContext ){
  const commandLine = commandControl.commandLine()
  const event = commandLine.event
  //local.setHighlight( 0 )
  if( commandLine.allowFetching ){
    commandControl.searchCustomers()
    commandControl.setHighlight( 0 )
  }
  commandControl.setIsCustomersCatalogVisible( true )
    .then( () => {
      const itemsSize = global.customersFound().length > SETTINGS.MAX_DYNAMIC_CATALOG_SIZE
        ? SETTINGS.MAX_DYNAMIC_CATALOG_SIZE
        : global.customersFound().length
      if( event.key == 'ArrowUp' ){
        commandControl.setHighlight( ( value:number ) => {
          if( value == 0 ) return itemsSize - 1
          return value - 1
        } )
      }
      else if( event.key == 'ArrowDown' ){
        commandControl.setHighlight( ( value:number ) => {
          if( value == itemsSize - 1 ) return 0
          return value + 1
        } )
      }
      else if( event.key == 'Enter' ){
        const highlight = commandControl.highlight()
        const item = global.customersFound()[ highlight ]
        if( item == undefined ) return
        console.log( 'CommandControl: handleKeyDown(Enter) highlight, item', highlight, item )

        global.setCustomer( item )
        global.setDiscount( item.discountPercentage || 0 )
        global.recomputeSelectedItems()
        global.updateTotals()
        commandControl.cleanPrompt()
      }
      else if( event.key == 'Escape' ){
        commandControl.setIsCustomersCatalogVisible( false )
        //setHighlight( 0 )
        //setIsVisible( false )
      }
      else{
        if( commandControl.commandLine().isDynamicCatalogMode ){
          //setIsVisible( true )
        }
        if( commandControl.commandLine().command = "" ){
          //setIsVisible( false )
        }
      }
    } )
}