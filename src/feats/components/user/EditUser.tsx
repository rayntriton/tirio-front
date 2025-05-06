import { useAuth } from "@/feats/authentication"
import { CFDIUse } from "@/feats/components/cdfiUse"
import { FiscalRegime } from "@/feats/components/fiscalRegime"
import { backend } from "@/feats/fetch"
import { useGlobal } from "@/feats/globalState"
import { SETTINGS } from "@/feats/settings"
import { queueEvent, registerMemory, useEvent, useMemory } from "@/feats/stateSystem"
import { useTheme } from "@/feats/styles"
import { Customer, InputEventHTMLInput, KeyboardEventHTMLDiv, KeyboardEventHTMLInput, Shopman } from "@/feats/types"
import { DecoupledPromise } from "@/utils/core"
import { useLocation, useNavigate, useParams } from "@solidjs/router"
import { onMount } from "solid-js"

export function EditUser(){
  const global = useGlobal()
  const theme = useTheme()
  const params = useParams()
  const location = useLocation< { user:Shopman, from:string } >()
  const navigate = useNavigate()
  console.log( 'EditUser: user:', location.state?.user )

  const setCaret = useEvent( ( event:Event, position:number ) => {
    ( event as any ).target.setSelectionRange( position, position )
  } )

  const [ localUser, setLocalUser ] = useMemory( { ...location.state?.user } as Shopman )
  setLocalUser( () => location.state?.user! )
  const [ password, setPassword ] = useMemory( "" )
  const [ repassword, setRepassword ] = useMemory( "" )
  
  const setUser = useEvent( ( fun:() => [ Event, string ] ) => {
    const [ event, field ] = fun()
    const caret = ( event as any ).target.selectionStart
      ? ( event as any ).target.selectionStart
      : 0
    console.log( 'EditUser:setUser: caret', caret )
    setLocalUser( customer => {
      ( customer as any )[ field ] = ( event as any ).target.value
      return customer
    } )
    setCaret( event, caret )
  } )
  
  const navigateBack = useEvent( () => {
    let from = '/'
    if( location.state )
     from = location.state.from ? location.state.from : from
    console.log( "EditCustomer: navigating to " + from )
    navigate( from, { replace: true } )
  } )

  const saveUser = async ( event:SubmitEvent ) => {
    event.preventDefault(); // Evita que el formulario se envíe de forma predeterminada
    console.log( 'EditCustomer: customer', localUser() )
    backend< { message:string, user:Shopman} >( {
      command: "UPDATE_USER",
      user: localUser(),
      password: password(),
      repassword: repassword()
    } )
      .then( response => {
        navigateBack()
      } )
  }

  const onKeyDown = ( event:KeyboardEventHTMLDiv ) => {
    console.log( "EditCustomer: onKeyPress: event.key", event.key )
    if( event.key == 'Enter'){
      saveUser( event as any )
    }
    else if( event.key == 'Escape'){
      navigateBack()
    }
  }
  
  const updatePermissions = () => {
    let permissions = [] as string[]
    document.querySelectorAll( '[data-user-permissions]' ).forEach( ( element:Element ) => {
      const permission = element.getAttribute( 'data-user-permissions' )!
      const checked = ( element as HTMLInputElement).checked
      if( checked ) permissions.push( permission )
    } )
    setLocalUser( user => {
      user.permissions = permissions
      return user
    } )
  }

  onMount( () => {
    document.getElementById( "edit-user:name" )?.focus()
  } )
  
  return (
    <div class = { `w-full` } onkeydown = { onKeyDown } >
    <div class = 'flex flex-row items-center' >
      <p class = { theme.paragraph() } >Editar Usuario</p>
    </div>

    <div class = { global.isPortableDevice() ? 'flex-back flex-wrap-back ' : '' } >
      <form onsubmit = { saveUser } class = 'w-full'>
        <table class = 'table-as-form w-full min-w-full' >
          <colgroup>
            <col class = "w-1/2"/>
            <col class = "w-1/2"/>
          </colgroup>
          <tbody>
            <tr><td>
              Login
            </td><td>
              <p
                class = { theme.input() + "bg-black bg-opacity-30" } >
                { localUser().login || '' }
              </p>
            </td></tr>
            <tr><td>
              Nombre
            </td><td>
              <input
                id = 'edit-user:name'
                class = { theme.input() }
                onInput = { ( event ) => setUser( () => [ event, 'name' ] ) }
                value = { localUser().name || '' }
              />
            </td></tr>
            <tr><td>
              Password
            </td><td>
              <input
                class = { theme.input() }
                type = 'password'
                onInput = { ( event:InputEventHTMLInput ) => setPassword( () => event.target.value ) }
                value = { password() }
              />
            </td></tr>
            <tr><td>
              Re password
            </td><td>
              <input
                class = { theme.input() }
                type = 'password'
                onInput = { ( event:InputEventHTMLInput ) => setRepassword( () => event.target.value ) }
                value = { repassword() }
              />
            </td></tr>
            { SETTINGS.ALLOWED_PERMISSIONS.map( permission => {
              return (
                <tr><td>
                  { permission }
                </td><td>
                  <input
                    data-user-permissions = { permission }
                    type = 'checkbox'
                    checked = { localUser().permissions.includes( permission ) }
                    class = { theme.input() }
                    onChange = { updatePermissions }
                  />
            </td></tr>
              )
            } ) }
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