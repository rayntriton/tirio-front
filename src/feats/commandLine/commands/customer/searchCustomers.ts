import { AuthContext } from "@/feats/authentication"
import { CommandControlContext } from "@/feats/commandLine/CommandControlContext"
import { backend } from "@/feats/fetch"
import { GlobalContext } from "@/feats/globalState"
import { Customer } from "@/feats/types"
import { DecoupledPromise } from "@/utils/core"

export const searchCustomers = ( global:GlobalContext, local:CommandControlContext, auth:AuthContext ) => {
  const { promise, fine, fail } = new DecoupledPromise< { success:boolean } >()
  const args = local.commandLine().args!
  backend< { result:Customer[], requestNumber:number } >( {
    command: "SEARCH_CUSTOMERS_V2",
    search: args.join(" "),
    token: auth.token(),
    clientReference: auth.clientReference(),
  } )
    .then( response  => {
      console.log( "Default:searchCustomers response", response )
      const customers = response.result
      const requestNumber = response.requestNumber
      global.setCustomersFound( customers )
      console.log( "searchCustomers itemsList", global.customersFound() )
      fine( { success: true } )
    } )
    .catch( error => {
      console.log( "searchCustomers catch1", error )
      fail( error )
    } )

  return promise
}