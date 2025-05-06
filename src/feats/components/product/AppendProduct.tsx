import { useCommandControl } from "@/feats/commandLine"
import { CFDIUse } from "@/feats/components/cdfiUse"
import { FiscalRegime } from "@/feats/components/fiscalRegime"
import { backend } from "@/feats/fetch"
import { useGlobal } from "@/feats/globalState"
import { GlyphDelete } from "@/feats/glyphs"
import { SETTINGS } from "@/feats/settings"
import { queueEvent, registerMemory, useEvent, useMemory } from "@/feats/stateSystem"
import { useTheme } from "@/feats/styles"
import { Customer, KeyboardEventHTMLDiv, PublicItem } from "@/feats/types"
import { useLocation, useNavigate } from "@solidjs/router"
import { onMount, Show } from "solid-js"

export function AppendProduct(){
  const global = useGlobal()
  const commandControl = useCommandControl()
  const theme = useTheme()
  const location = useLocation< { addProduct:string, from:string } >()
  const navigate = useNavigate()
  console.log( 'AddProduct: we here!' )
  const setCaret = useEvent( ( event:Event, position:number ) => {
    ( event as any ).explicitOriginalTarget.setSelectionRange( position, position )
  } )
  const [ localProduct, setLocalProduct ] = useMemory( { ...SETTINGS.DEFAULT_PRODUCT } as PublicItem )
  console.log( 'AddProduct:setCustomer: localCustomer', localProduct() )
  setLocalProduct( { ...SETTINGS.DEFAULT_PRODUCT } )
    .then( product => {
      console.log( 'AddProduct:setProduct: localProduct', localProduct() )
    } )

  const setProduct = useEvent( ( fun:() => [ Event, string ] ) => {
    const [ event, field ] = fun()
    const caret = ( event as any ).target.selectionStart
      ? ( event as any ).target.selectionStart
      : 0
    console.log( 'AddProduct:setProduct: caret', caret )
    setError( '' )
    setLocalProduct( product => {
      ( product as any )[ field ] = ( event as any ).target.value.toUpperCase()
      return product
    } )
    setCaret( event, caret )
  } )
  const productSetterEvent = registerMemory( ( product:PublicItem ) => {
    console.log( 'AddProduct:productSetterEvent: product', product )
    return setLocalProduct( product )
  } )

  const [ error, setError ] = useMemory( '' )

  const navigateBack = useEvent( () => {
    let from = '/'
    if( location.state )
     from = location.state.from ? location.state.from : from
    console.log( "AddProduct: navigating to " + from )
    navigate( from, { replace: true } )
  } )

  const addProduct = async ( event:SubmitEvent ) => {
    event.preventDefault(); // Evita que el formulario se envíe de forma predeterminada
    console.log( 'AddProduct: product', localProduct() )
    global.addItem( localProduct() )
  }

  const onKeyDown = ( event:KeyboardEventHTMLDiv ) => {
    console.log( "AddProduct: onKeyPress: event.key", event.key )
    if( event.key == 'Enter'){
      navigateBack()
      addProduct( event as any )
    }
    else if( event.key == 'Escape'){
      navigateBack()
    }
  }

  onMount( () => {
    document.getElementById( "edit-product:quantity" )?.focus()
  } )
  
  return (
    <div class = { `w-full` } onkeydown = { onKeyDown } >
    <div class = 'flex flex-row items-center' >
      <p class = { theme.paragraph() } >Agregar producto</p>
    </div>
    <Show when = { error() != '' } >
      <div class = 'bg-red-950 fixed flex flex-row'>
        <p class = { theme.paragraph() }> { error() } </p>
        <button class = { theme.button() } onclick = { () => setError( '' ) }> <GlyphDelete /></button>
      </div>
    </Show>

    <div class = { global.isPortableDevice() ? 'flex-back flex-wrap-back ' : '' } >
      <form onsubmit = { addProduct } class = 'w-full'>
        <table class = 'table-as-form w-full min-w-full' >
          <colgroup>
            <col class = "w-1/2"/>
            <col class = "w-1/2"/>
          </colgroup>
          <tbody>
            <tr><td>
              Cantidad
            </td><td>
              <input
                id = 'edit-product:quantity'
                class = { theme.input() }
                onInput = { ( event ) => setProduct( () => [ event, 'quantity' ] ) }
                value = { localProduct().quantity || '' }
              />
            </td></tr>
            <tr><td>
              Codigo
            </td><td>
              <input
                contentEditable
                class = { theme.input() }
                onInput = { ( event ) => setProduct( () => [ event, 'code' ] ) }
                value = { localProduct().code || '' }
              />
            </td></tr>
            <tr><td>
              Marca
            </td><td>
              <input
                contentEditable
                class = { theme.input() }
                onInput = { ( event ) => setProduct( () => [ event, 'mark' ] ) }
                value = { localProduct().mark || '' }
              />
            </td></tr>
            <tr><td>
              Unidad
            </td><td>
              <input
                contentEditable
                class = { theme.input() }
                onInput = { ( event ) => setProduct( () => [ event, 'unit' ] ) }
                value = { localProduct().unit || '' }
              />
            </td></tr>
            <tr><td>
              Unidad SAT
            </td><td>
              <input
                contentEditable
                class = { theme.input() }
                onInput = { ( event ) => setProduct( () => [ event, 'unitCode' ] ) }
                value = { localProduct().unitCode || '' }
              />
            </td></tr>
            <tr><td>
              Codigo SAT
            </td><td>
              <input
                contentEditable
                class = { theme.input() }
                onInput = { ( event ) => setProduct( () => [ event, 'prodservCode' ] ) }
                value = { localProduct().prodservCode || '' }
              />
            </td></tr>
            <tr><td>
              Descripcion
            </td><td>
              <input
                contentEditable
                class = { theme.input() }
                onInput = { ( event ) => setProduct( () => [ event, 'description' ] ) }
                value = { localProduct().description || '' }
              />
            </td></tr>
            <tr><td>
              Precio unitario
            </td><td>
              <input
                contentEditable
                class = { theme.input() }
                onInput = { ( event ) => setProduct( () => [ event, 'unitPrice' ] ) }
                value = { localProduct().unitPrice || '' }
              />
            </td></tr>
          </tbody>
        </table>
        <div>
          <div class = 'items-center'>
            <button
                type = 'submit'
                class = { theme.button( 'w-full' ) } >
              Agregar
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