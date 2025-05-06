import { useAuth } from "@/feats/authentication"
import { CFDIUse } from "@/feats/components/cdfiUse"
import { FiscalRegime } from "@/feats/components/fiscalRegime"
import { backend } from "@/feats/fetch"
import { useGlobal } from "@/feats/globalState"
import { queueEvent, registerMemory, useEvent, useMemory } from "@/feats/stateSystem"
import { useTheme } from "@/feats/styles"
import { Customer, KeyboardEventHTMLDiv } from "@/feats/types"
import { DecoupledPromise } from "@/utils/core"
import { useLocation, useNavigate, useParams } from "@solidjs/router"
import { onMount } from "solid-js"

export function EditCustomer(){
  const global = useGlobal()
  const theme = useTheme()
  const params = useParams()
  const location = useLocation< { setCustomer:string, from:string } >()
  const navigate = useNavigate()
  console.log( 'EditCustomer: we here!' )

  const setCaret = useEvent( ( event:Event, position:number ) => {
    ( event as any ).target.setSelectionRange( position, position )
  } )

  const [ localCustomer, setLocalCustomer ] = useMemory( { ...global.customer() } as Customer )
  
  const setCustomer = useEvent( ( fun:() => [ Event, string ] ) => {
    const [ event, field ] = fun()
    const caret = ( event as any ).target.selectionStart
      ? ( event as any ).target.selectionStart
      : 0
    console.log( 'EditCustomer:setCustomer: caret', caret )
    setLocalCustomer( customer => {
      ( customer as any )[ field ] = ( event as any ).target.value.toUpperCase()
      return customer
    } )
    setCaret( event, caret )
  } )
  const getRfc = () => {
    return localCustomer().rfc
  }
  const getFiscalRegime = () => {
    return localCustomer().fiscalRegime
  }
  const getCfdiUse = () => {
    return localCustomer().cfdiUse
  }
  const setCfdiUse = useEvent( ( cfdiUse:string ) => {
    return setLocalCustomer( customer => {
      customer.cfdiUse = cfdiUse
      return customer
    } )
  } )
  const setLocalCustomerRegistry = registerMemory( ( customer:Customer ) => {
    console.log( 'EditCustomer:setLocalCustomerRegistry: customer', customer )
    return setLocalCustomer( customer )
  } )
  
  const navigateBack = useEvent( () => {
    let from = '/'
    if( location.state )
     from = location.state.from ? location.state.from : from
    console.log( "EditCustomer: navigating to " + from )
    navigate( from, { replace: true } )
  } )

  const updateCustomer = async ( event:SubmitEvent ) => {
    event.preventDefault(); // Evita que el formulario se envíe de forma predeterminada
    console.log( 'EditCustomer: customer', localCustomer() )
    backend< { message:string, customer:Customer} >( {
      command: "UPDATE_CUSTOMER_V2",
      customer: localCustomer()
    } )
      .then( response => {
        if( location.state && location.state.setCustomer ){
          queueEvent( location.state.setCustomer, response.customer )
        }
        navigateBack()
      } )
  }

  const onKeyDown = ( event:KeyboardEventHTMLDiv ) => {
    console.log( "EditCustomer: onKeyPress: event.key", event.key )
    if( event.key == 'Enter'){
      updateCustomer( event as any )
    }
    else if( event.key == 'Escape'){
      navigateBack()
    }
  }

  useEvent( ()=>{
    const { promise, fine, fail } = new DecoupledPromise< { success:boolean } >()
    return backend< { result:Customer } >( {
      command: "GET_CUSTOMER",
      id: params.id
    } )
      .then( response  => {
        console.log( "EditCustomer: response", response )
        const customer = response.result
        setLocalCustomer( customer )
        fine( { success: true } )
      } )
      .catch( error => {
        fail( error )
      } )
  } )()
  
  onMount( () => {
    document.getElementById( "edit-customer:name" )?.focus()
  } )
  
  return (
    <div class = { `w-full` } onkeydown = { onKeyDown } >
    <div class = 'flex flex-row items-center' >
      <p class = { theme.paragraph() } >Editar Cliente</p>
    </div>

    <div class = { global.isPortableDevice() ? 'flex-back flex-wrap-back ' : '' } >
      <form onsubmit = { updateCustomer } class = 'w-full'>
        <table class = 'table-as-form w-full min-w-full' >
          <colgroup>
            <col class = "w-1/2"/>
            <col class = "w-1/2"/>
          </colgroup>
          <tbody>
            <tr><td>
              Nombre
            </td><td>
              <input
                id = 'edit-customer:name'
                class = { theme.input() }
                onInput = { ( event ) => setCustomer( () => [ event, 'consummer' ] ) }
                value = { localCustomer().consummer || '' }
              />
            </td></tr>
            <tr><td>
              RFC
            </td><td>
              <input
                contentEditable
                class = { theme.input() }
                onInput = { ( event ) => setCustomer( () => [ event, 'rfc' ] ) }
                value = { localCustomer().rfc || '' }
              />
            </td></tr>
            <tr><td>
              CP
            </td><td>
              <input
                contentEditable
                class = { theme.input() }
                onInput = { ( event ) => setCustomer( () => [ event, 'cp' ] ) }
                value = { localCustomer().cp || '' }
              />
            </td></tr>
            <tr><td>
              Email(s)
            </td><td>
              <input
                contentEditable
                class = { theme.input() }
                onInput = { ( event ) => setCustomer( () => [ event, 'email' ] ) }
                value = { localCustomer().email || '' }
              />
            </td></tr>
            <tr><td>
              Tel(s)
            </td><td>
              <input
                contentEditable
                class = { theme.input() }
                onInput = { ( event ) => setCustomer( () => [ event, 'tel' ] ) }
                value = { localCustomer().tel || '' }
              />
            </td></tr>
            <tr><td>
              Régimen
            </td><td>
              <FiscalRegime style = { theme.input() } customer = { localCustomer } setCustomer = { setLocalCustomerRegistry } />
            </td></tr>
            <tr><td>
              Uso de CFDI
            </td><td>
              <CFDIUse
                style = { theme.input() }
                rfc = { getRfc }
                fiscalRegime = { getFiscalRegime }
                cfdiUse = { getCfdiUse }
                setCfdiUse = { setCfdiUse as any } />
            </td></tr>
            <tr><td>
              Descuento(%)
            </td><td>
              <input
                contentEditable
                class = { theme.input() }
                onInput = { ( event ) => setCustomer( () => [ event, 'discountPercentage' ] ) }
                value = { localCustomer().discountPercentage || '' }
              />
            </td></tr>
            <tr><td>
              Credito(días)
            </td><td>
              <input
                contentEditable
                class = { theme.input() }
                onInput = { ( event ) => setCustomer( () => [ event, 'payment' ] ) }
                value = { localCustomer().payment || '' }
              />
            </td></tr>
            <tr><td>
              Calle
            </td><td>
              <input
                contentEditable
                class = { theme.input() }
                onInput = { ( event ) => setCustomer( () => [ event, 'address' ] ) }
                value = { localCustomer().address || '' }
              />
            </td></tr>
            <tr><td>
              No exterior
            </td><td>
              <input
                contentEditable
                class = { theme.input() }
                onInput = { ( event ) => setCustomer( () => [ event, 'exteriorNumber' ] ) }
                value = { localCustomer().exteriorNumber || '' }
              />
            </td></tr>
            <tr><td>
              No interior
            </td><td>
              <input
                contentEditable
                class = { theme.input() }
                onInput = { ( event ) => setCustomer( () => [ event, 'interiorNumber' ] ) }
                value = { localCustomer().interiorNumber || '' }
              />
            </td></tr>
            <tr><td class = 'text-wrap' >
              Referencias(entre calles)
            </td><td>
              <input
                contentEditable
                class = { theme.input() }
                onInput = { ( event ) => setCustomer( () => [ event, 'aditionalReference' ] ) }
                value = { localCustomer().aditionalReference || '' }
              />
            </td></tr>
            <tr><td>
              Colonia
            </td><td>
              <input
                contentEditable
                class = { theme.input() }
                onInput = { ( event ) => setCustomer( () => [ event, 'suburb' ] ) }
                value = { localCustomer().suburb || '' }
              />
            </td></tr>
            <tr><td>
              Localidad
            </td><td>
              <input
                contentEditable
                class = { theme.input() }
                onInput = { ( event ) => setCustomer( () => [ event, 'locality' ] ) }
                value = { localCustomer().locality || '' }
              />
            </td></tr>
            <tr><td>
              Ciudad
            </td><td>
              <input
                contentEditable
                class = { theme.input() }
                onInput = { ( event ) => setCustomer( () => [ event, 'city' ] ) }
                value = { localCustomer().city || '' }
              />
            </td></tr>
            <tr><td>
              Estado
            </td><td>
              <input
                contentEditable
                class = { theme.input() }
                onInput = { ( event ) => setCustomer( () => [ event, 'state' ] ) }
                value = { localCustomer().state || '' }

              />
            </td></tr>
            <tr><td>
              País
            </td><td>
              <input
                contentEditable
                class = { theme.input() }
                onInput = { ( event ) => setCustomer( () => [ event, 'country' ] ) }
                value = { localCustomer().country || '' }
              />
            </td></tr>
          </tbody>
        </table>
        <div>
          <div class = 'items-center'>
            <button
                type = 'submit'
                class = { theme.button( 'w-full' ) } >
              Guardar
            </button>
          </div>
          <div class = 'items-center'>
            <button
                class = { theme.button( 'w-full' ) }
                onclick = { navigateBack } >
              Cancelar
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
  )

}