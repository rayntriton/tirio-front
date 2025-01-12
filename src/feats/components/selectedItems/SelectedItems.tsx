import { useGlobal } from "@/feats/globalState"
import { InputEventDOMDiv, InputEventDOMInput, MouseEventDOMDiv, MouseEventDOMTableRow, MouseEventDOMTextArea, PublicItem } from "@/feats/types"
import { DOMElement } from "solid-js/jsx-runtime"

export function SelectedItems( props:Props ){

  const global = useGlobal()

  //JSX.EventHandler< HTMLInputElement, MouseEvent > =
  const onClick = ( event:MouseEventDOMDiv ) => {
    //event. buttons preventDefault()
    const button = event.buttons
    let index = event.currentTarget.tabIndex
    console.log( 'SelectedItems: onClick event.button, index', event.button, index )

    //const item = global.searchItems()[ index ]
    if( button == 0 ){
      global.setPublicItems( items => {
        items[ index ].edited = true
        return items 
      } )
    }
    else if( button == 1 ){
      
      global.setPublicItems( items => items.splice( index, 1 ) )
    }
    else if( button == 2 ){
      global.setPublicItems( items => {
        items[ index ].disabled = ! items[ index ].disabled
        return items 
      } )
    }
  }

  const onQuantityInput = ( event:InputEventDOMDiv ) => {
    const quantity = event.currentTarget.textContent!
    const index = event.currentTarget.tabIndex
    global.setPublicItems( items => {
      items[ index ].quantity = Number.parseInt( quantity ) 
      return items 
    } )
  }

  const onUnitPriceInput = ( event:InputEventDOMDiv ) => {
    const unitPrice = event.currentTarget.textContent!
    const index = event.currentTarget.tabIndex
    global.setPublicItems( items => {
      items[ index ].unitPrice = Number.parseInt( unitPrice ) 
      return items 
    } )
  }

  const onUnitCodeInput = ( event:InputEventDOMDiv ) => {
    const text = event.currentTarget.textContent!
    const index = event.currentTarget.tabIndex
    global.setPublicItems( items => {
      items[ index ].unitCode = text
      return items 
    } )
  }

  const onDescriptionInput = ( event:InputEventDOMDiv ) => {
    const text = event.currentTarget.textContent!
    const index = event.currentTarget.tabIndex
    global.setPublicItems( items => {
      items[ index ].description = text
      return items
    } )
  }

  return (
    <table>
      { props.elements.map( ( item, index ) => (
        <tr tabIndex={ index } on:click={ onClick } on:contextmenu = { ( event )=>{ event.preventDefault() } } >
          <td><div on:click={ onClick }  contentEditable tabIndex={ index } onInput={ onQuantityInput } >{ global.commandLine().quantity }</div></td>
          <td><div contentEditable tabIndex={ index } onInput={ onUnitCodeInput }>{ item.unitCode } </div></td>
          <td><div contentEditable tabIndex={ index } onInput={ onDescriptionInput }>{ item.description } </div></td>
          <td><div contentEditable tabIndex={ index } onInput={ onUnitPriceInput }>{ item.unitPrice } </div></td>
        </tr>
      ) ) }
    </table>
  )
}

type Props = { elements:PublicItem[]  }

//const a:EventHandlerWithOptionsUnion<HTMLDivElement, MouseEvent, EventHandler<HTMLDivElement, MouseEvent>>