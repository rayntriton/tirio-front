import { getAuthState } from "@/feats/authentication";
import { post } from "@/feats/fetch";
import { CommandResponse } from "@/feats/types";
import { DecoupledPromise } from "@/utils/core";

export function backend< RESPONSE, REQUEST = Record< string, any > >
    ( request:REQUEST ):Promise< RESPONSE >{
  const clientReference = getAuthState().clientReference()
  const token = getAuthState().token()
  const { promise, fine, fail } = new DecoupledPromise< RESPONSE, string >()
  post( request )
    .then( httpResponse => {
      if( httpResponse.ok ){
        console.log( "backend: post response ok", httpResponse )
        const jsonResponse = httpResponse.json()
        jsonResponse
          .then( ( response:CommandResponse< RESPONSE, string > ) => {
            console.log( "backend: jsonResponse then response", response )
            if( response.success ) fine( response.content )
            else fail( response.error )
          } )
          .catch( error =>{
            console.log( "backend: jsonResponse catch", error )
            fail( error )
          } )
      }
      else fail( httpResponse.status + ". " + httpResponse.statusText )
    } )
    .catch( error =>{
      fail( "Error: " + error )
    } )
  return promise;
}
