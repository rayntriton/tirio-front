import { KeyboardEventHTMLInput } from "@/feats/types";
import { onMount } from "solid-js";
import { useTheme } from "@/feats/styles";
import { useCommandControl } from "./CommandControlProvider";
import { useNavigate } from "@solidjs/router";

export function CommandControl(){
  const theme = useTheme()
  const local = useCommandControl()
  const navigate = useNavigate()
  local.setNavigator( { navigate } )
  const handleInputEvent = ( event:KeyboardEventHTMLInput ) => {
    const currentValue = event.currentTarget.value
    local.preventDefault( event )
    setTimeout( () => {
      local.setCommandLine( event, currentValue )
        .then( commandLine => {
          console.log( "CommandControl: commandLine", local.commandLine() )
          local.setCommandLineValue( commandLine.rawValue )
          local.handleKeyDownTask( event )
        } )
    }, 10 )
  }

  onMount( () => {
    document.getElementById( "commandLine" )!.focus()
  } )

  return ( 
    <>
      <div class = "w-full flex items-center justify-center content-center" >
        <input class = { theme.input( 'w-11/12' ) }
          id = 'commandLine'
          value = { local.commandLineValue() }
          onkeydown = { ( event ) => {
            handleInputEvent( event )
          } }
        />
        <label class = "text-yellow-400" >{ local.warning() }</label>
        <label class = "text-red-600" >{ local.error() }</label>
      </div>
    </>
  )
}
