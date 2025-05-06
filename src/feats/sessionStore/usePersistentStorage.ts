import { SetterMutable } from "@/feats/types"
import { createSignalMutable } from "@/utils/signals"
import { traceHash } from "@/utils/string"
import { Accessor } from "solid-js"

export function usePersistentStorage< TYPE >(
    value:TYPE,
    keyId?:number,
    persistent?:'sessionStorage'|'localStorage'|'memoryStorage'
  ):[ Accessor< TYPE >, SetterMutable< TYPE > ]{
  const [ getSignal, setSignal ] = createSignalMutable< TYPE >( value )
  const fingerPrint = traceHash()
  const key = fingerPrint + ( keyId ? keyId : "" )
  console.log( "usePersistSession: keyr", key, "persistense", persistent )
  let storage:Storage
  if( persistent == 'sessionStorage' || persistent == 'localStorage' ){
    storage = persistent == 'sessionStorage' ? sessionStorage : localStorage
    const recover = storage.getItem( key )
    if( recover != null ){
      setSignal( JSON.parse( recover ) )
      console.log( "usePersistentSession: recover", JSON.parse( recover ), "key", key )
    }
    else{
      setSignal( value )
      storage.setItem( key, JSON.stringify( getSignal() ) )
      console.log( "usePersistentSession: not recover. value ", value, "key", key )
    }
  }
  //sessionStorage.setItem( key, JSON.stringify( value ) )
  const getter:Accessor< TYPE > = () => {
    return getSignal()
  }
  const setter:SetterMutable< TYPE > = ( value ) => {
    setSignal( value )
    if( persistent == 'sessionStorage' || persistent == 'localStorage' )
      storage.setItem( key, JSON.stringify( getSignal() ) )
    console.log( "usePersistentSession:setter getSignal()", getSignal(), "key", key, "value", value )

    return getSignal()
  }
  return [ getter, setter ]
}