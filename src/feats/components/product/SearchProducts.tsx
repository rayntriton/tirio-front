import { useCommandControl } from "@/feats/commandLine";
import { useGlobal } from "@/feats/globalState";
import { MouseEventDOMDiv } from "@/feats/types"

export function SearchProducts(){
  const global = useGlobal()
  const local = useCommandControl()
  console.log( "SearchProducts: elements", global.itemsFound() )
  const onClick = ( event:MouseEventDOMDiv ) => {
      let index = event.currentTarget.tabIndex
      const item = global.itemsFound()[ index ]
      global.addItem( item )
      local.cleanPrompt()
  }
  const evenClass = "bg-cyan-950"
  const oddClass = "bg-cyan-900"
  const getColor = ( index:number ) => index % 2 == 0 ? evenClass : oddClass
  return (
    <div class = { `w-full items-center content-center justify-center` } >
      { global.itemsFound().slice( 0, 15 ).map( ( item, index ) => {
        
        console.log( 'SearchProducts: highltght', local.highlight() )
        return (
          <div
              tabIndex = { index }
              on:click = { onClick }
              class = { `flex flex-wrap content-center rounded-md m-1 hover:bg-cyan-600 cursor-pointer
                ${ index == local.highlight() ? "bg-cyan-600" : getColor( index ) }` }
              >
            <div class = { `m-1 p-1 bg-slate-700 bg-opacity-50 rounded-md` } >{ item.code }</div>
            <div class = { `m-1 p-1 bg-slate-400 bg-opacity-50 rounded-md` } >{ item.unit + " " + ( item.unitCode || "" ) }</div>
            <div class = { `m-1 p-1 bg-slate-700 bg-opacity-50 rounded-md` } >{ item.mark }</div>
            <div class = { `m-1 p-1 bg-slate-400 bg-opacity-50 rounded-md` } >{ item.description }</div>
            <div class = { `m-1 p-1 bg-slate-700 bg-opacity-50 rounded-md` } >{ item.unitPrice }</div>
          </div>
        ) } ) }
    </div>
  )
}
