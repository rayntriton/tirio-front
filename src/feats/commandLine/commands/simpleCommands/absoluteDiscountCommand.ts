import { CommandControlContext } from "@/feats/commandLine/CommandControlContext";
import { GlobalContext } from "@/feats/globalState";
import { round2 } from "@/utils/math";

export function absoluteDiscountCommand(
    global:GlobalContext,
    commandControl:CommandControlContext ){
  const
    items = global.publicItems(),
    commandLine = commandControl.commandLine(),
    D = ( 100 - Number.parseFloat( commandLine.args![ 0 ] ) ) / 100
  let
    total = 0,
    Total = 0,
    sum = 0,
    variables = 0,
    constants = 0,
    gain = 0,
    init = 0
  for( let i = 0; i < items.length; i++ ){
    const item = items[ i ]
    Total += D * item.quantity * item.unitPrice
    sum += item.quantity * item.unitPrice
    if( item.edited ) {
      constants += item.quantity * item.unitPrice
      const t = item.quantity * item.unitPrice
      total += t
      init += t
    }
    else {
      //float q = item.getQuantity();
      //float j = new Float(dbo.get("unitPrice").toString());
      //float t = new Float(dbo.get("providerOffer").toString());
      variables += item.quantity * item.unitPrice
      total += item.quantity * item.unitPrice
      init += item.quantity * item.providerPrice
      gain += item.quantity * ( item.unitPrice - item.providerPrice )
    }
  }
  const
    discount = round2( ( 1 - ( sum * D - constants ) / variables )  * 100 ),
    keyPressed = commandControl.commandLine().event.key,
    d = round2( ( 1 - ( D * total - init ) / gain ) * 100 )
  if( global.publicItems().length > 0 ){
    global.setDiscount( d )
    global.recomputeSelectedItems()
    global.updateTotals()
    if( keyPressed == 'Enter' )
      commandControl.cleanPrompt()
  }
}