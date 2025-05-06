import { CommandControlContext } from "@/feats/commandLine";
import { GlobalContext } from "@/feats/globalState";
import { SETTINGS } from "@/feats/settings";

export function searchUsersCommand( global:GlobalContext, commandControl:CommandControlContext ){
  const commandLine = commandControl.commandLine()
  const event = commandLine.event
  //local.setHighlight( 0 )
  if( commandLine.allowFetching ){
    commandControl.searchUsers()
    commandControl.setHighlight( 0 )
  }
  commandControl.setIsUsersCatalogVisible( true )
    .then( () => {
      const itemsSize = global.usersFound().length > SETTINGS.MAX_DYNAMIC_CATALOG_SIZE
        ? SETTINGS.MAX_DYNAMIC_CATALOG_SIZE
        : global.usersFound().length
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
        const item = global.usersFound()[ highlight ]
        if( item == undefined ) return
        console.log( 'CommandControl: handleKeyDown(Enter) highlight, item', highlight, item )
        commandControl.cleanPrompt()
        commandControl.navigate( '/users/edit/' + item.id, { state: { user:item } } )
      }
      else if( event.key == 'Escape' ){
        commandControl.setIsUsersCatalogVisible( false )
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