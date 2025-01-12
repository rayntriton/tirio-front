import { useGlobal } from "@/feats/globalState";
import { Setter } from "@/feats/stateSystem";
import { MouseEventDOMDiv, PublicItem } from "@/feats/types"
import { createEffect } from "solid-js";

export function SearchProducts( props:Props ){
  //const currentElements = () => elements
  const global = useGlobal()
  console.log( "SearchProducts: elements", props.elements )
  //JSX.EventHandler< HTMLInputElement, MouseEvent > =
  const onClick = ( event:MouseEventDOMDiv ) => {
      let index = event.currentTarget.tabIndex
      const item = global.itemsFound()[ index ]
      global.setPublicItems( items => {
        items.unshift( item )
        return items
      } )
      global.setItemsFound( [] )
  }
  createEffect( () => { 
    global.itemsFound()
  } )
  //const hk = ( string:string ) => highlightKeywords( string, global.commandLine().args! )
  //<tr tabIndex = { index } on:click = { onClick } style = { index == props.highlight ? { "background-color":"#f3e455" } : ""}>
  return (
    <div class = "w-screen items-center content-center justify-center">
      { global.itemsFound().slice( 0, 15 ).map( ( item, index ) => {
        let evenClass = "bg-cyan-950"
        let oddClass = "bg-cyan-900"
        return (
          <div
              tabIndex = { index }
              on:click = { onClick }
              class = { `w-11/12 flex flex-wrap content-center rounded-md m-1
                ${ index == props.highlight ? "font-bold bg-cyan-700" : "" }
                ${ index % 2 == 0 ? evenClass : oddClass }` }
              >
            <div class = { `m-1 p-1 bg-slate-700 bg-opacity-50 rounded-md` } >{ item.code }</div>
            <div class = { `m-1 p-1 bg-slate-400 bg-opacity-50 rounded-md` } >{ item.unit + " " + ( item.unitCode || "" ) }</div>
            <div class = { `m-1 p-1 bg-slate-700 bg-opacity-50 rounded-md` } >{ item.mark }</div>
            <div class = { `m-1 p-1 bg-slate-400 bg-opacity-50 rounded-md` } >{ item.description }</div>
            <div class = { `m-1 p-1 bg-slate-700 bg-opacity-50 rounded-md` }>{ item.unitPrice }</div>
          </div>
        ) } ) }
    </div>
  )
}


type Props = { elements:PublicItem[], highlight:number, setHighlight:Setter< number > }

