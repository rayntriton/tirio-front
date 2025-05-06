import { CommandControlContext } from "@/feats/commandLine/CommandControlContext"
import { GlobalContext } from "@/feats/globalState"

export function operateDocumentCommand( global:GlobalContext, commandControl:CommandControlContext ){
  const commandLine = commandControl.commandLine()
  const event = commandLine.event
  if( event.key == 'Enter' ){
    commandControl.cleanPrompt()
    commandControl.navigate( '/documents/operate/:reference' )
  }
}