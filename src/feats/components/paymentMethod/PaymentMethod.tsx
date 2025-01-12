export function PaymentMethod(){
  return (
    <select id="paymentMethod" style="width: 10%">
      <option disabled>Metodo de Pago</option>
      <option value="PUE" selected = { true }>PUE Pago en una sola
        exhibición</option>
    </select>
  )
}