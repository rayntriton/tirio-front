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
import { onMount, Show } from "solid-js"

export function CreateUser(){
  const global = useGlobal()
  const theme = useTheme()
  const params = useParams()
  const location = useLocation< { user:Shopman, from:string } >()
  const navigate = useNavigate()
  console.log( 'CreateUser: we here!' )

  const setCaret = useEvent( ( event:Event, position:number ) => {
    ( event as any ).target.setSelectionRange( position, position )
  } )

  const [ localUser, setLocalUser ] = useMemory( { name:'', login:'', permissions:[ 'BASIC' ] } as Shopman )
  const [ password, setPassword ] = useMemory( "" )
  const [ repassword, setRepassword ] = useMemory( "" )
  const [ serverMessage, setServerMessage ] = useMemory( '' )
  const [ serverSuccess, setServerSuccess ] = useMemory( false )
  console.log( 'CreateUser: localUser:' + JSON.stringify( localUser() ) )
  const setUser = useEvent( ( fun:() => [ Event, string ] ) => {
    const [ event, field ] = fun()
    const caret = ( event as any ).target.selectionStart
      ? ( event as any ).target.selectionStart
      : 0
    console.log( 'CreateUser:setUser: caret', caret )
    setLocalUser( customer => {
      if( field == 'login' )
        ( customer as any )[ field ] = ( event as InputEventHTMLInput ).target.value.toLowerCase().split( ' ' ).join( '' )
      else ( customer as any )[ field ] = ( event as any ).target.value
      return customer
    } )
    setCaret( event, caret )
  } )
  
  const navigateBack = useEvent( () => {
    let from = '/'
    if( location.state )
     from = location.state.from ? location.state.from : from
    console.log( "CreateUser: navigating to " + from )
    navigate( from, { replace: true } )
  } )

  const saveUser = async ( event:SubmitEvent ) => {
    event.preventDefault(); // Evita que el formulario se envíe de forma predeterminada
    console.log( 'CreateUser: customer', localUser() )
    backend< { message:string, user:Shopman} >( {
      command: "CREATE_USER",
      user: localUser(),
      password: password(),
      repassword: repassword()
    } )
      .then( response => {
        setServerSuccess( true )
        setTimeout( () => { navigateBack() }, 2000 )
      } )
      .catch( error => {
        setServerMessage( error )
        setTimeout( () => { setServerMessage( '' ) }, 2000 )
      } )
  }

  const onKeyDown = ( event:KeyboardEventHTMLDiv ) => {
    console.log( "CreateUser: onKeyPress: event.key", event.key )
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
    document.getElementById( "edit-user:login" )?.focus()
  } )
  
  return (
    <div class = { `w-full` } onkeydown = { onKeyDown } >
    <div class = 'flex flex-row items-center' >
      <p class = { theme.paragraph() } >Crear usuario</p>
    </div>
    <Show when = { serverMessage() != '' }>
      <div class = 'fixed bg-red-400'>{ serverMessage() }</div>
    </Show>
    <Show when = { serverSuccess() }>
      <div class = 'fixed bg-green-300' >Usuario creado exitosamente</div>
    </Show>
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
              <input
                id = 'edit-user:login'
                class = { theme.input() }
                onInput = { ( event ) => setUser( () => [ event, 'login' ] ) }
                value = { localUser().login || '' }
                autocomplete = "new-password"
              />
            </td></tr>
            <tr><td>
              Nombre
            </td><td>
              <input
                id = 'edit-user:name'
                class = { theme.input() }
                onInput = { ( event ) => setUser( () => [ event, 'name' ] ) }
                value = { localUser().name || '' }
                autocomplete = "new-password"
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
                autocomplete = "new-password"
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
                autocomplete = "new-password"
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
                class = { theme.button( 'w-11/12' ) } >
              Guardar
            </button>
          </div>
          <div class = 'items-center'>
            <button
                class = { theme.button( 'w-11/12' ) }
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