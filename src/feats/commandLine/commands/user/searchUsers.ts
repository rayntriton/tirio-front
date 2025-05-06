import { AuthContext } from "@/feats/authentication"
import { CommandControlContext } from "@/feats/commandLine"
import { backend } from "@/feats/fetch"
import { GlobalContext } from "@/feats/globalState"
import { PublicItem, Shopman } from "@/feats/types"
import { DecoupledPromise } from "@/utils/core"

export const searchUsers = ( global:GlobalContext, local:CommandControlContext, auth:AuthContext ) => {
  const args = local.commandLine().args!
  const { promise, fine, fail } = new DecoupledPromise< { success:boolean } >()
  backend< { result:Shopman[], requestNumber:number } >( {
    command: "SEARCH_USERS",
    search: args.join(" "),
    token: auth.token(),
    clientReference: auth.clientReference(),
  } )
    .then( response  => {
      console.log( "Default:searchUsers response", response )
      const items = response.result
      const requestNumber = response.requestNumber
      //setItemsList( products )
      global.setUsersFound( items )
      console.log( "searchUsers itemsList", global.usersFound() )
      fine( { success: true } )
    } )
    .catch( error => {
      fail( error )
    } )
  return promise
}