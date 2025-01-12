import { post } from "@/feats/fetch";
import { CommandResponse } from "@/feats/types";
import { DecoupledPromise } from "@/utils/core";

export function backend< RESPONSE, REQUEST = any >( request:REQUEST )
  :Promise< RESPONSE >{
    const decoupledPromise = new DecoupledPromise< RESPONSE, string >();
    post( request )
      .then( response => {
        if( response.ok ){
          console.log( "backend: post response ok", response )
          const jsonResponse = response.json()
          jsonResponse
            .then( ( response:RESPONSE ) => {
              decoupledPromise.fine( response )
            } )
            .catch( error =>{
              decoupledPromise.fail( "Error: " + error )
            } )
        }
      } )
      .catch( error =>{
        decoupledPromise.fail( "Error: " + error )
      } )
    return decoupledPromise.promise;
  }
