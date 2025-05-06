import { useCommandControl } from "@/feats/commandLine";
import { useGlobal } from "@/feats/globalState";
import { Accessor, Setter } from "@/feats/stateSystem";
import { MouseEventDOMDiv, PublicItem } from "@/feats/types"

export function SearchCustomers(){
  //const currentElements = () => elements
  const global = useGlobal()
  const local = useCommandControl()
  console.log( "SearchCustomers: elements", global.customersFound() )
  //JSX.EventHandler< HTMLInputElement, MouseEvent > =
  const onClick = ( event:MouseEventDOMDiv ) => {
      let index = event.currentTarget.tabIndex
      const item = global.customersFound()[ index ]
      global.setCustomer( item )
      global.setDiscount( item.discountPercentage || 0 )
      global.updateTotals()
      local.cleanPrompt()
  }
  const evenClass = "bg-cyan-950"
  const oddClass = "bg-cyan-900"
  const getColor = ( index:number ) => index % 2 == 0 ? evenClass : oddClass
  return (
    <div class = { `w-full items-center content-center justify-center` } >
      { global.customersFound().slice( 0, 15 ).map( ( item, index ) => {
        
        console.log( 'SearchProducts: highltght', local.highlight() )
        return (
          <div
              tabIndex = { index }
              on:click = { onClick }
              class = { `flex flex-wrap content-center rounded-md m-1 hover:bg-cyan-600 cursor-pointer
                ${ index == local.highlight() ? "bg-cyan-600" : getColor( index ) }` }
              >
            <div class = { `m-1 p-1 bg-slate-700 bg-opacity-50 rounded-md` } >{ item.consummer }</div>
            <div class = { `m-1 p-1 bg-slate-400 bg-opacity-50 rounded-md` } >{ item.rfc }</div>
            <div class = { `m-1 p-1 bg-slate-700 bg-opacity-50 rounded-md` } >{ `${ item.address }, ${ item.exteriorNumber }, ${ item.interiorNumber || '' }, ${ item.suburb }` }</div>
            <div class = { `m-1 p-1 bg-slate-400 bg-opacity-50 rounded-md` } >{ item.city }</div>
            <div class = { `m-1 p-1 bg-slate-700 bg-opacity-50 rounded-md` } >{ item.state }</div>
          </div>
        ) } ) }
    </div>
  )
}

