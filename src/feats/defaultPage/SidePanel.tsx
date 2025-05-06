import { CFDIUse, Customer, PaymentMethod, PaymentWay } from "@/feats/components"
import { useGlobal } from "@/feats/globalState"
import { Accessor, registerMemory, Setter, useEvent, useMemory } from "@/feats/stateSystem"
import { useTheme } from "@/feats/styles"
import { isNumber, round2 } from "@/utils/math"
import { Customer as CustomerType } from '@feats/types'
import { Match, Show, Switch } from "solid-js"

export function SidePanel(){
  console.log( 'Sidepanel Iteration' )
  const global = useGlobal()
  const theme = useTheme()
  const setCaret = useEvent( ( event:Event, position:number ) => {
    ( event as any ).explicitOriginalTarget.setSelectionRange( position, position )
  } )
  const setCustomer = registerMemory( ( customer:CustomerType ) => {
    global.setCustomer( customer )
    setCfdiUse( cfdiUse() != customer.cfdiUse
      ? cfdiUse()
      : customer.cfdiUse )
  } )
  
  global.setDiscount( global.discount() != 0
    ? global.discount()
    : global.customer().discountPercentage )

  const setDiscount = useEvent( ( event:Event ) => {
    const caret = ( event as any ).target.selectionStart
      ? ( event as any ).target.selectionStart
      : 0
    const actualValue = global.discount()
    const newValue = ( event as any ).target.value.toUpperCase()
    console.log( 'SidePanel: actualDiscount', actualValue, 'newValue', newValue, 'caret', caret, 'event', event )
    if( isNumber( newValue ) ){
      global.setDiscount( newValue )
      setCaret( event, caret )
    }
    else{
      global.setDiscount( actualValue )
      setCaret( event, caret - 1 )
    }
    global.recomputeSelectedItems()
    global.updateTotals()
  } )
  const setDestiny = useEvent( ( event:Event ) => {
    const caret = ( event as any ).target.selectionStart
      ? ( event as any ).target.selectionStart
      : 0
    const newValue = ( event as any ).target.value.toUpperCase()
    global.setDestiny( newValue )
    setCaret( event, caret )
  } )
  const getRfc = () => {
    return global.customer().rfc
  }
  const getFiscalRegime = () => {
    return global.customer().fiscalRegime
  }
  const [ cfdiUse, setCfdiUse ] = [ global.cfdiUse, global.setCfdiUse ]

  return (
    <Switch>
      <Match  when = { ! global.isPortableDevice() } >
        <div class = { `w-full max-w-full flex flex-row` } >
          <div class = { `w-1/2 max-w` } style = 'max-widht:50%' >
            <div class = { `w-11/12 max-w-full text-wrap` } >
              <p class = { theme.paragraph() } >Descuento</p>
              <input class = { theme.input( 'w-full' ) } value = { global.discount() } onInput = { ( event:Event ) => setDiscount( event ) } />
              <p class = { theme.paragraph() } >Forma de pago</p>
              <PaymentWay setPaymentWay = { global.setPaymentWay } style = { theme.input( 'max-w-1/2 text-wrap' ) } />
              <p class = { theme.paragraph() } >Uso del CFDI</p>
              <CFDIUse
                rfc = { getRfc }
                fiscalRegime = { getFiscalRegime }
                cfdiUse = { cfdiUse }
                setCfdiUse = { setCfdiUse }
                style = { theme.input( 'max-w-1/2 text-wrap' ) } />
              <p class = { theme.paragraph() } >Referencias (Lugar de entrega )</p>
              <input class = { theme.input( 'w-full' ) } value = { global.destiny() } onInput = { ( event:Event ) => setDestiny( event ) } />
              <p class = { theme.paragraph() } >Metodo de pago</p>
              <PaymentMethod setPaymentMethod = { global.setPaymentMethod } style = { theme.input() }/>
            </div>
          </div>
          <div class = { `w-1/2` } style = 'max-widht:50%' >
            <div><div class = 'font-bold text-center' >
              Total
            </div><div class = 'bg-black bg-opacity-30 min-h-1' >
              { global.total() }
            </div></div>
            <div><div class = 'font-bold text-center' >
              Total - { round2( global.total() - global.total2() ) }
            </div><div class = 'bg-black bg-opacity-30 min-h-1' >
              { global.total2() }
            </div></div>
            <Customer customer = { global.customer } setCustomer = { setCustomer } />
          </div>
        </div>
      </Match>
      <Match  when = { global.isPortableDevice() } >
        <div class = { `w-full max-w-full flex flex-col` } >
          <div class = { `` } style = 'max-widht:50%' >
            <div class = { `w-11/12 max-w-full text-wrap` } >
              <p class = { theme.paragraph() } >Descuento</p>
              <input class = { theme.input( 'w-full' ) } value = { global.discount() } onInput = { ( event:Event ) => setDiscount( event ) } />
              <p class = { theme.paragraph() } >Metodo de pago</p>
              <PaymentMethod setPaymentMethod = { global.setPaymentMethod } style = { theme.input() }/>
              <p class = { theme.paragraph() } >Forma de pago</p>
              <PaymentWay setPaymentWay = { global.setPaymentWay } style = { theme.input( 'max-w-1/2 text-wrap' ) } />
              <p class = { theme.paragraph() } >Uso del CFDI</p>
              <CFDIUse
                rfc = { getRfc }
                fiscalRegime = { getFiscalRegime }
                cfdiUse = { cfdiUse }
                setCfdiUse = { setCfdiUse }
                style = { theme.input( 'text-wrap' ) } />
              <p class = { theme.paragraph() } >Referencias (Lugar de entrega )</p>
              <input class = { theme.input( 'w-full' ) } value = { global.destiny() } onInput = { ( event:Event ) => setDestiny( event ) } />
            </div>
          </div>
          <div class = { `w-full` } style = '' >
            <Customer customer = { global.customer } setCustomer = { setCustomer } />
          </div>
        </div>
      </Match>
    </Switch>
  )
}