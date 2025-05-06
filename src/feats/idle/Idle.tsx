import { useLocation, useNavigate } from "@solidjs/router";
import { HistoryFrom, OnlineClient } from "@/feats/types";
import { onMount } from "solid-js";
import { createMemory, createMemorySignals, createSession, createSignals, useEvent } from "@/feats/stateSystem";
import { useTheme } from "@/feats/styles";
import { useGlobal } from "@/feats/globalState";
import { useAuth } from "@/feats/authentication";
import { backend } from "@/feats/fetch";

export function Idle(){

  const global = useGlobal()
  const auth = useAuth()
  useEvent( () => {
    backend( {
      command: 'LOCK'
    } )
    auth.lock()
  } )()
  const theme = useTheme()
  const location = useLocation()

  const navigate = useNavigate()
  
  const local = createMemory( [
    "password", "setPassword", [ "" ],
    "error", "setError", [ "" ]
  ] as const )

  const navigateBack = useEvent( () => {
    let from = '/'
    if( location.state )
     from = ( location.state as HistoryFrom ).from
    console.log( "Idle.navigateBack: navigating to " + from )
    if( from == '/lock' || from == '/login' ) from = '/'
    navigate( from, { replace: true } )
  } )
  
  const unlock = useEvent( () => {
    backend( {
      command: 'UNLOCK',
      user: auth.user().login,
      password: local.password()
    } )
      .then( () => {
        auth.unlock()
        global.idleTimer().reset()
        navigateBack()
      } )
      .catch ( error => {
        // Maneja errores de red u otros errores
        local.setError( error )
        setTimeout( () => { local.setError( '' ) }, 2000 )
      } )
  } )

  //( window as any ).navigateBack = navigateBack
  
  onMount( () => {
    document.getElementById( "password" )?.focus()
  } )

  console.log( "Idle: isLocked", auth.isLocked() )

  const handleSubmit = async ( event:SubmitEvent ) => {
    event.preventDefault() // Evita que el formulario se envíe de forma predeterminada
    unlock()    
  }
  
  return (
    <div  class = 'w-full flex items-center justify-center content-center' >
      <form onSubmit = { handleSubmit } class = { '' }  >
        {/* Campo de usuario */}
        <div class = 'flex flex-col items-center'>
          <p>Desbloquear</p>
          <label for = "user" ><p class = { theme.paragraph( 'text-center w-full' ) } >Usuario:</p></label>
          <p
              class = { theme.input( 'w-full' ) }
              id = "user" >
            { auth.user().login }
          </p>
        </div>

        {/* Campo de contraseña */}
        <div class = 'flex flex-col items-center'>
          <label for = "password" ><p class = { theme.paragraph( 'text-center w-full' ) } >Contraseña:</p></label>
          <input
            class = { theme.input( 'w-full' ) }
            type = "password"
            id = "password"
            value = { local.password() }
            onInput = { ( event ) => local.setPassword( event.currentTarget.value ) }
            required
          />
        </div>

        {/* Mensaje de error */}
        { local.error() && <p style = { { color: "red" } } >{ local.error() }</p> }

        {/* Botón de envío */}
        <div class = 'flex flex-col items-center'>
          <button
              type = 'submit'
              class = {
                theme.button( 'w-full' ) } >
            Desbloquear
          </button>
        </div>
      </form>
    </div>
  )

}
