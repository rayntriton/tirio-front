import { Accessor, queueEvent, useEvent } from "@/feats/stateSystem"
import { allowedFiscalRegimes } from "./allowedFiscalRegime"
import { Customer, EventHTMLSelect } from "@/feats/types"

export function FiscalRegime( props:{ customer:Accessor< Customer >, setCustomer:string, style:string  } ){

  const getCustomer = () => {
    if( props.customer().rfc == undefined ) return { rfc: '', fiscalRegime: '' } as Customer
    else return props.customer()
  }

  function updateFiscalRegime( event:EventHTMLSelect ){
    queueEvent( props.setCustomer, ( customer:Customer ) => {
      customer.fiscalRegime = ( event.target as any).value
      console.log( 'FiscalRegime.updateFiscalRegime: event:', event )
      return customer
    } )
  }

  return(
    <select onChange = { updateFiscalRegime } class = { props.style }>
      <option disabled>Regimen fiscal</option>
      {
        ( () => {
          console.log( "FiscalRegime.updateFiscalRegime customer", getCustomer )
          console.log( "FiscalRegime.updateFiscalRegime customer()", getCustomer() )
          return allowedFiscalRegimes( getCustomer().rfc ).map( ( option ) => {
            return (
              <option value={ option.code } selected={ option.code == getCustomer().fiscalRegime } >
                { option.code + " - " + option.description }
              </option>
            ) } )
        } )()
      }
    </select>
  )
}