import { useCommandControl } from "@/feats/commandLine";
import { useGlobal } from "@/feats/globalState";
import { MouseEventDOMDiv } from "@/feats/types"
import { useNavigate } from "@solidjs/router";

export function SearchUsers(){
  const global = useGlobal()
  const local = useCommandControl()
  const navigate = useNavigate()

  console.log( "SearchUsers: elements", global.usersFound() )
  const onClick = ( event:MouseEventDOMDiv ) => {
      let index = event.currentTarget.tabIndex
      const item = global.usersFound()[ index ]
      local.cleanPrompt()
      navigate( '/users/edit/' + item.id, { state: { user:item } } )
  }
  const evenClass = "bg-cyan-950"
  const oddClass = "bg-cyan-900"
  const getColor = ( index:number ) => index % 2 == 0 ? evenClass : oddClass
  return (
    <div class = { `w-full items-center content-center justify-center` } >
      { global.usersFound().slice( 0, 15 ).map( ( item, index ) => {
        
        console.log( 'SearchUsers: highltght', local.highlight() )
        return (
          <div
              tabIndex = { index }
              on:click = { onClick }
              class = { `flex flex-wrap content-center rounded-md m-1 hover:bg-cyan-600 cursor-pointer
                ${ index == local.highlight() ? "bg-cyan-600" : getColor( index ) }` }
              >
            <div class = { `m-1 p-1 bg-slate-700 bg-opacity-50 rounded-md` } >{ item.login }</div>
            <div class = { `m-1 p-1 bg-slate-400 bg-opacity-50 rounded-md` } >{ item.name }</div>
          </div>
        ) } ) }
    </div>
  )
}
