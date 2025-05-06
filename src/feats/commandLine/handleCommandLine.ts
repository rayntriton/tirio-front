import { AuthContext } from "@/feats/authentication"
import { CommandControlContext } from "./CommandControlContext"
import { GlobalContext } from "@/feats/globalState"
import { KeyboardEventHTMLInput } from "@/feats/types"
import { absoluteDiscountCommand, addUserCommand, appendProductCommand, customerCommand, discountCommand, operateDocumentCommand, productCommand, searchUsersCommand } from "@/feats/commandLine"

export function handleCommandLine(
    global:GlobalContext,
    auth:AuthContext,
    local:CommandControlContext ){
  const 
    commandLine = local.commandLine(),
    event = commandLine.event,
    keyPressed = (event as KeyboardEventHTMLInput).key
  const kind = commandLine.kind
  console.log( 'CommandControl: handleKeyDown commandLine', commandLine )
  if( ! commandLine.isDynamicCatalogMode ){
    if( local.isProductsCatalogVisible() )
      local.setIsProductsCatalogVisible( false )
    if( local.isCustomersCatalogVisible() )
      local.setIsCustomersCatalogVisible( false )
    if( local.isCustomersCatalogVisible() )
      local.setIsUsersCatalogVisible( false )
  }
  if( kind == 'retrieve' || kind == 'product' ){
    productCommand( global, local )
  }
  else if( kind == 'client' || kind == 'agent' ){
    customerCommand( global, local )
  }
  else if( kind == 'searchusers' ){
    searchUsersCommand( global, local )
  }
  else if( kind == 'adduser' ){
    addUserCommand( global, local )
  }
  else if( kind == 'discount' ){
    discountCommand( global, local )
  }
  else if( kind == 'absolutediscount' ){
    absoluteDiscountCommand( global, local )
  }
  else if( kind == 'appendproduct' ){
    appendProductCommand( global, local )
  }
  else if( kind == 'operatedocument' ){
    operateDocumentCommand( global, local )
  }

}