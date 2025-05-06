import { CommandControlContext } from "@/feats/commandLine";
import { GlobalContext } from "@/feats/globalState";
import { SETTINGS } from "@/feats/settings";

export function addUserCommand( global:GlobalContext, commandControl:CommandControlContext ){
  const commandLine = commandControl.commandLine()
  const event = commandLine.event
  if( event.key == 'Enter' ){
    commandControl.cleanPrompt()
    commandControl.navigate( '/users/new' )
  }
}