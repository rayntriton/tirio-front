import { Customer, EventHTMLSelect } from "@/feats/types"
import { allowedCFDIUses } from "./allowedCDFIUses"
import { Accessor, queueEvent, Setter, useEvent } from "@/feats/stateSystem"

export function CFDIUse( props:{ rfc:Accessor< string >, fiscalRegime:Accessor< string >, cfdiUse:Accessor< string >, setCfdiUse:string|Setter< string >, style:string  } ){

  function updateCFDIUse( event:EventHTMLSelect ){
    if( props.setCfdiUse instanceof Function ){
      props.setCfdiUse( ( event.target as any).value )
    }
    else {
      queueEvent( props.setCfdiUse, () => {
        const cfdiUse = ( event.target as any).value
        console.log( 'CFDIUse.updateCFDIUse: event:', event )
        return cfdiUse
      } )
    }
  }

  return(
    <select onChange = { updateCFDIUse } class = { 'w-full ' + props.style }>
      <option disabled>Uso de CFDI</option>
      {
        ( () => {
          console.log( 'CFDIUse.updateCFDIUse:' )
          return allowedCFDIUses( props.rfc(), props.fiscalRegime() ).map( ( option ) => {
            return (
              <option
                  value = { option.code }
                  selected = { option.code == props.cfdiUse() } >
                { option.code + " - " + option.description }
              </option>
            ) } )
        } )()
      }
    </select>
  )

}