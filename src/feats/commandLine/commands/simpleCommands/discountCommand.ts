import { CommandControlContext } from "@/feats/commandLine";
import { GlobalContext } from "@/feats/globalState";

export function discountCommand(
    global:GlobalContext,
    commandControl:CommandControlContext ){
  const
    discount = Number.parseFloat( commandControl.commandLine().args![ 0 ] ),
    keyPressed = commandControl.commandLine().event.key
  global.setDiscount( discount )
  global.recomputeSelectedItems()
  global.updateTotals()    
  if( keyPressed == 'Enter' ){
    commandControl.cleanPrompt()
  }
}