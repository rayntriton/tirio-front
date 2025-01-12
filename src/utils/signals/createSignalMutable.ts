import { SetterMutable } from "@/feats/types";
import { Accessor, createSignal } from "solid-js";

export function createSignalMutable< MUTABLE >( value: MUTABLE )
  :[ Accessor< MUTABLE >, SetterMutable< MUTABLE > ] {
    const [ mutable, setMutable ] =
      createSignal< { value:MUTABLE } >( { value } )

    const getter:Accessor< MUTABLE > = () => { return mutable().value }

    const setter:SetterMutable< MUTABLE > = ( input ) => {
      if( input instanceof Function ){
        console.log( "createSignalMutable:setter input is function" )
        setMutable( ( signal ) => {
          return { value: input( signal.value ) }
        } )
      }
      else{
        console.log( "createSignalMutable:setter input is var", input )
        setMutable( { value: input } )
      }
      return mutable().value
    }
    return [ getter, setter ]
  }
