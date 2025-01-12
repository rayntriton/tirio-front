import { useLocation, useNavigate } from "@solidjs/router";
import { HistoryFrom, OnlineClient } from "@/feats/types";
import { onMount } from "solid-js";
import { serverLogin } from "./serverLogin";
import { useAuth } from "./AuthProvider";
import { createMemory, createMemorySignals, createSession, createSignals } from "@/feats/stateSystem";
import { useTheme } from "@/feats/styles";

export function AuthPage(){

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

  const navigateBack = createMemorySignals( [ 'now' ], () => {
    let from = '/'
    if( location.state )
     from = ( location.state as HistoryFrom ).from
    console.log( "AuthPage.handleSubmit: navigating to " + from )
    navigate( from )
  } );
  
  const tryLogin = createMemorySignals( [ 'now' ], () => {
    try {
      // Realiza una solicitud OPTIONS al servidor para validar las credenciales
      console.log( "AuthPage.handleSubmit: serverLogin" )
      serverLogin( local.user(), local.password() )
        .then( commandResponse => {
          if( commandResponse.success ){
            const onlineClient:OnlineClient = commandResponse.content
            auth.setSessionId( onlineClient.sessionId )
            auth.setClientReference( onlineClient.clientReference )
            auth.setToken( onlineClient.token )
            auth.setUser( onlineClient.shopman )
            auth.unlock()
            auth.login()
            navigateBack.now()
          }
          else {
            console.log( "AuthPage.handleSubmit: serverLogin error " + commandResponse.error )
            local.setError( commandResponse.error )
          }
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

  const handleSubmit = async ( event:SubmitEvent ) => {
    event.preventDefault(); // Evita que el formulario se envíe de forma predeterminada
    tryLogin.now()    
  }
  
  return (
    <div  >
      <form onSubmit = { handleSubmit } class = 'flex-row' >
        {/* Campo de usuario */}
        <div>
          <label for = "user" ><p class = { theme.paragraph() } >Usuario:</p></label>
          <input
            class = { theme.input() }
            type = "text"
            id = "user"
            value = { local.user() }
            onInput = { ( event ) => local.setUser( event.currentTarget.value ) }
            required
          />
        </div>

        {/* Campo de contraseña */}
        <div>
          <label for = "password" ><p class = { theme.paragraph() } >Contraseña:</p></label>
          <input
            class = { theme.input() }
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
        <button
            type = 'submit'
            class = {
              theme.button( 'flex-1 content-center justify-center' ) } >
          Iniciar sesión
        </button>
      </form>
    </div>
  )

}
