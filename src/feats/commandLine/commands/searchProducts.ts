import { AuthContext } from "@/feats/authentication"
import { backend } from "@/feats/fetch"
import { GlobalContext } from "@/feats/globalState"
import { PublicItem } from "@/feats/types"
import { DecoupledPromise } from "@/utils/core"

export const searchProducts = ( global:GlobalContext,auth:AuthContext,args:string[] ) => {
  const requestNumber = global.setRequestNumber( value => value + 1 )
  const { promise, fine, fail } = new DecoupledPromise< { success:boolean } >()
  backend< { result:PublicItem[], requestNumber:number } >( {
    command: "SEARCH_PRODUCTS",
    search: args.join(" "),
    requestNumber: requestNumber,
    token: auth.token(),
    clientReference: auth.clientReference(),
  } )
    .then( response  => {
      console.log( "Default:searchProducts response", response )
      const products = response.result
      const requestNumber = response.requestNumber
      //setItemsList( products )
      global.setItemsFound( products )
      console.log( "searchProducts itemsList", global.itemsFound() )
      fine( { success: true } )
    } )
    .catch( error => {
      fail( error )
    } )
    return promise
}