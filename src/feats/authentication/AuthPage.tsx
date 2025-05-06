import { useLocation, useNavigate } from "@solidjs/router";
import { HistoryFrom, OnlineClient } from "@/feats/types";
import { onMount } from "solid-js";
import { serverLogin } from "./serverLogin";
import { useAuth } from "./AuthProvider";
import { createMemory, createMemorySignals, createSession, createSignals, useEvent } from "@/feats/stateSystem";
import { useTheme } from "@/feats/styles";
import { useGlobal } from "@/feats/globalState";

export function AuthPage(){

  const global = useGlobal()
  const auth = useAuth()

  const theme = useTheme()
  //const theAuth = auth.getAuth()
  const location = useLocation()

  const navigate = useNavigate()

  //const [ user, setUser ] = createSignal( "" )
  
  const local = createMemory( [
    "user", "setUser", [ "" ],
    "password", "setPassword", [ "" ],
    "error", "setError", [ "" ]
  ] as const )
  
  const password  = createSignals( "memoryStorage" , "asd", [ () => {} ] )
  //const [ error, setError ] = createSignal( "" ); // Para manejar errores

  const navigateBack = useEvent( () => {
    let from = '/'
    if( location.state )
     from = ( location.state as HistoryFrom ).from
    if( from == '/lock' || from == '/login' ) from = '/'
    console.log( "AuthPage.handleSubmit: navigating to " + from )
    navigate( from, { replace: true } )
  } )
  
  const tryLogin = createMemorySignals( [ 'now' ], () => {
    try {
      // Realiza una solicitud OPTIONS al servidor para validar las credenciales
      console.log( "AuthPage.handleSubmit: serverLogin" )
      serverLogin( local.user(), local.password() )
        .then( commandResponse => {
          const onlineClient:OnlineClient = commandResponse.onlineClient
          auth.setSessionId( onlineClient.sessionId )
          auth.setClientReference( onlineClient.clientReference )
          auth.setToken( onlineClient.token )
          auth.setUser( onlineClient.shopman )
          auth.unlock()
          auth.login()
          navigateBack()
        } )
        .catch( error => {
          console.log( "AuthPage.handleSubmit: serverLogin error " + error )
          local.setError( error )
        } )
    } catch (err) {
      // Maneja errores de red u otros errores
      local.setError("Error al conectarse al servidor. Inténtalo de nuevo más tarde.");

      console.log("Error al conectarse al servidor. Inténtalo de nuevo más tarde.");
    }
  } );

  //( window as any ).navigateBack = navigateBack
  
  onMount( () => {
    document.getElementById( "user" )?.focus()
  } )

  console.log( "AuthPage: isauthenticated", auth.isAuthenticated() )
  console.log( "AuthPage: isPortableDevice", global.isPortableDevice() )

  const handleSubmit = async ( event:SubmitEvent ) => {
    event.preventDefault(); // Evita que el formulario se envíe de forma predeterminada
    tryLogin.now()    
  }
  
  return (
    <div  class = 'w-full flex items-center justify-center content-center' >
      <form onSubmit = { handleSubmit } class = { '' }  >
        {/* Campo de usuario */}
        <div class = 'flex flex-col items-center'>
          <p>Login</p>
          <label for = "user" ><p class = { theme.paragraph( 'text-center w-full' ) } >Usuario:</p></label>
          <input
            class = { theme.input( 'w-full' ) }
            type = "text"
            id = "user"
            value = { local.user() }
            onInput = { ( event ) => local.setUser( event.currentTarget.value ) }
            required
          />
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
            Iniciar sesión
          </button>
        </div>
      </form>
    </div>
  )

}
