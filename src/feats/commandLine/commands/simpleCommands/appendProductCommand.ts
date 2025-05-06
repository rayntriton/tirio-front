import { CommandControlContext } from "@/feats/commandLine/CommandControlContext";
import { GlobalContext } from "@/feats/globalState";

export function appendProductCommand( global:GlobalContext, commandControl:CommandControlContext ){
  const keyPressed = commandControl.commandLine().event.key
  if( keyPressed == 'Enter' ){
    commandControl.cleanPrompt()
    commandControl.navigate( '/products/append' )
  }
}