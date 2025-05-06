import { Pojo, Primitive } from "@/feats/types";

export function jsonToFormUrlEncoded( json:Pojo ) {
  // Convierte el objeto JSON en un array de pares clave-valor
  const keyValuePairs = Object.entries< any >( json ).map( ( [ key, value ] ) => {
    // Escapa los valores para que sean seguros para usar en una URL
    const value_ = ( value instanceof Object ) ? JSON.stringify( value ) : value
    return encodeURIComponent( key ) + '=' + encodeURIComponent( value_ )
  } )

  // Une los pares clave-valor con un "&"
  return keyValuePairs.join( '&' )
}

