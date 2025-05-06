import { post } from "@/feats/fetch";
import { Accessor, useMemory } from "@/feats/stateSystem";
import { CommandResponse } from "@/feats/types";

export function useBackend< RESPONSE, REQUEST = Record< string, any > >
    ( request:REQUEST ):[ Accessor< RESPONSE | undefined >, Accessor< boolean >, Accessor< any > ]{
  const [ response, setResponse ] = useMemory< RESPONSE | undefined >( undefined )
  const [ loading, setLoading ] = useMemory( true )
  const [ error, setError ] = useMemory< any >( undefined )

  post( request )
    .then( httpResponse => {
      setLoading( false )
      if( httpResponse.ok ){
        console.log( "backend: post response ok", httpResponse )
        const jsonResponse = httpResponse.json()
        jsonResponse
          .then( ( response:CommandResponse< RESPONSE, string > ) => {
            console.log( "backend: jsonResponse then response", response )
            if( response.success ){
              setResponse( () => response.content )
            }
            else{
              setError( error )
            }
          } )
          .catch( error =>{
            console.log( "backend: jsonResponse catch", error )
            setError( error )
          } )
      }
      else{
        setError( httpResponse.status + ". " + httpResponse.statusText )
      }
    } )
    .catch( error =>{
      setError( error )
    } )
  return [ response, loading, error ]
}
