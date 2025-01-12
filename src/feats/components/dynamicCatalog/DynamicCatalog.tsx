import { useGlobalState } from "@/feats/globalState";
import { Customer, PublicItem } from "@/feats/types"
import { JSX } from "solid-js";

export function DynamicCatalog( { elements }:Props ){

  const global = useGlobalState()

  const onClick:
    JSX.EventHandlerUnion< HTMLInputElement, MouseEvent > = ( event ) => {
      // currentTarget: EventTarget & HTMLInputElement
      let index = event.currentTarget.tabIndex
      let commandLine = new CommandLine( event ) 
      console.log( commandLine );
  }

  if( "quantity" in  elements ){
    const e = elements as PublicItem[]
    return (
      // Renderizar si es un array de PublicItem
      <table>
        { e.map( ( item, index ) => (
          <tr tabIndex={ index } on:click={ ()=>[ ] }>
            <td>{ item.quantity }</td>
            <td>{ item.unit + "|" + item.unitCode }</td>
            <td>{ item.mark }</td>
            <td>{ item.description }</td>
            <td>{ item.unitPrice }</td>
          </tr>
        ) ) }
      </table>
    )
  }
  else{
    const e = elements as Customer[]
    return (
      // Renderizar si es un array de PublicItem
      <table>
        { e.map( ( item, index ) => (
          <tr tabIndex={ index } on:click={  }>
            <td>{ item.consummer }</td>
            <td>{ item.rfc }</td>
            <td>{ item.address }</td>
            <td>{ item.city }</td>
            <td>{ item.email }</td>
            <td>{ item.tel }</td>
          </tr>
        ) ) }
      </table>
    )
  }

}

type Props = { elements:PublicItem[]|Customer[] }