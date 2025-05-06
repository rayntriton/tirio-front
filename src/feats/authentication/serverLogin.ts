import { backend, post, preflight } from "@/feats/fetch";
import { OnlineClient, CommandResponse } from "@/feats/types";
import { DecoupledPromise } from "@/utils/core";

export function serverLogin( user:string, password:string ){
  const { promise, fine, fail } = new DecoupledPromise< { onlineClient:OnlineClient }, string >();
  preflight()
    .then( preflightResponse => {
      if( preflightResponse.ok ){
        backend< { onlineClient:OnlineClient } >( { command: "login", user, password } )
          .then( response  => {
            console.log( "serverLogin: response", response )
            fine( response )
          } )
          .catch( error => {
            fail( error )
          } )

        /*
        console.log( "AuthPage.handleSubmit: preflight response ok" )
        return post( { command: "login", user, password } )
          .then( httpResponse => {
            if( httpResponse.ok ){
              console.log( "AuthPage.handleSubmit: post response ok", JSON.stringify( response )  )
              console.log( httpResponse )
              const jsonResponse = httpResponse.json()
              jsonResponse
                .then( ( response:CommandResponse<OnlineClient,string> ) => {
                  if( response.success )
                    fine( response )
                  else 
                    fail( response.error )
                  console.log( "AuthPage.handleSubmit: post response json", response  )
                } )
                .catch( error =>{
                  fail( "Error on content: " + error )
                } )
            }
            //else setError( response. )
          } )
          .catch( error =>{
            fail( "Error when fetching server: " + error )
          } )*/
      }
    } )
    .catch( error =>{
      fail( "Error when preflighting server: " + error )
    } )
  return promise;
}
