import { Setter, useEvent } from "@/feats/stateSystem";
import { onMount } from "solid-js";

export function PaymentMethod( props:{ setPaymentMethod:Setter< string >, style:string } ){
  const updatePaymentMethod = useEvent( ( event:Event ) => {
    props.setPaymentMethod( ( event as any ).value )
  } )
  onMount( ( ) => {
    props.setPaymentMethod( 'PUE')
    document.getElementById( 'paymentMethod' )?.setAttribute( 'value', 'PUE' )
  } )
  return (
    <select
        id="paymentMethod"
        class = { "w-full " + props.style }
        onchange = { updatePaymentMethod } >
      <option disabled>Metodo de Pago</option>
      <option value="PUE" selected = { true }>PUE Pago en una sola exhibición</option>
    </select>
  )
}