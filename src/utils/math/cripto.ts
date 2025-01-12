import { MD5 } from 'crypto-js'

export function hash10( string:string ){
  return MD5( string ).toString().substring( 0 , 10 )
}
