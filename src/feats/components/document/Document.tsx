import { post, useBackend } from "@/feats/fetch";
import { useGlobal } from "@/feats/globalState";
import { GlyphPurpleFlag, GlyphRedFlag, GlyphYellowFlag } from "@/feats/glyphs";
import { useMemory } from "@/feats/stateSystem";
import { DocumentId, SuperDocument } from "@/feats/types";
import { round2 } from "@/utils/math";
import { useParams } from "@solidjs/router";
import { createResource, Match, Show, Switch } from "solid-js";

export function Document(){
  const params = useParams< DocumentId >()
  const [ serial ] = useMemory( params.serial )
  const [ reference ] = useMemory( params.reference )
  const [ documentId ] = useMemory( { serial: serial(), reference: reference() } as DocumentId )
  const [ response, loading, error ] = useBackend< { result:SuperDocument } >( {
    command: 'GET_DOCUMENT',
    serial: documentId().serial,
    reference: documentId().reference
  } )

  const global = useGlobal()

  const evenClass = "bg-cyan-950"
  const oddClass = "bg-cyan-900"
  const getColor = ( index:number ) => index % 2 == 0 ? evenClass : oddClass

  return (
    <Switch>
      <Match when = { loading() } >
        <span>Loading...</span>
      </Match>
      <Match when = { error() } >
        <span>Error: { error() }</span>
      </Match>
      <Match when={ response() }>{ ( () => {
          const document = response()?.result!
          let docutmentType = document.documentType
          
          return (
             <Show
                  when = { global.isPortableDevice() }
                  fallback = { <>
                    <table class = { `w-ful min-w-full` } >
                      { document.items.map( ( item, index ) => {
                        const Flags = <>
                            { item.disabled ? <GlyphRedFlag class = 'glyph-shadow-black' /> : <></> }
                            { item.raincheck ? <GlyphPurpleFlag class = 'glyph-shadow-black' /> : <></> }
                            { item.edited ? <GlyphYellowFlag class = 'glyph-shadow-black' /> : <></> }
                          </>
                        const row =
                          <tr class = { getColor( index ) } >
                            <td class = 'bg-opacity-50 rounded-md flex flex-row flex-shrink w-11' >
                              { Flags }</td>
                            <td class = 'w-14 m-1 p-1 bg-indigo-800 bg-opacity-50 rounded-md' >
                              <div>{ item.quantity }</div></td>
                            <td class = 'm-1 p-1 bg-indigo-950 bg-opacity-50 rounded-md' >
                              <div>{ item.unit }</div></td>
                            <td class = 'm-1 p-1 bg-indigo-800 bg-opacity-50 rounded-md' >
                              <div>{ item.code }</div></td>
                            <td class = 'm-1 p-1 bg-indigo-950 bg-opacity-50 rounded-md' >
                              <div>{ item.description } </div></td>
                            <td class = 'm-1 p-1 bg-indigo-800 bg-opacity-50 rounded-md' >
                              <div>{ item.unitCode } </div></td>
                            <td class = 'm-1 p-1 bg-indigo-950 bg-opacity-50 rounded-md' >
                              <div>{ item.prodservCode } </div></td>
                            <td class = 'w-14 m-1 p-1 bg-indigo-800 bg-opacity-50 rounded-md' >
                              <div>{ round2( item.unitPriceComputed | item.unitPrice ) } </div></td>
                            <td class = 'w-14 m-1 p-1 bg-indigo-950 bg-opacity-50 rounded-md' >
                              <div>{ round2( ( item.unitPriceComputed | item.unitPrice ) * item.quantity ) } </div></td>
                          </tr>
                        return row
                       } ) }
                    </table>
                    
                  </> } >
                  <div class = { `w-full` } >
                  { document.items.map( ( item, index ) => {
                    const Flags = <>
                        { item.disabled ? <GlyphRedFlag class = 'glyph-shadow-black' /> : <></> }
                        { item.raincheck ? <GlyphPurpleFlag class = 'glyph-shadow-black' /> : <></> }
                        { item.edited ? <GlyphYellowFlag class = 'glyph-shadow-black' /> : <></> }
                      </>
                    return (
                      <div class = { `flex flex-wrap ${ getColor( index ) }` } data-index = { index }>
                      
                        <div class = 'bg-opacity-50 rounded-md flex flex-row flex-shrink' >
                          { Flags }</div>
                        <div class = 'w-14 m-1 p-1 bg-indigo-800 bg-opacity-50 rounded-md' >
                          <div>{ item.quantity }</div></div>
                        <div class = 'm-1 p-1 bg-indigo-950 bg-opacity-50 rounded-md' >
                          <div>{ item.unit } </div></div>
                        <div class = 'm-1 p-1 bg-indigo-800 bg-opacity-50 rounded-md' >
                          <div>{ item.code } </div></div>
                        <div class = 'm-1 p-1 bg-indigo-950 bg-opacity-50 rounded-md' >
                          <div>{ item.description } </div></div>
                        <div class = 'm-1 p-1 bg-indigo-800 bg-opacity-50 rounded-md' >
                          <div>{ item.unitCode } </div></div>
                        <div class = 'm-1 p-1 bg-indigo-950 bg-opacity-50 rounded-md' >
                          <div>{ item.prodservCode } </div></div>
                        <div class = 'w-14 m-1 p-1 bg-indigo-800 bg-opacity-50 rounded-md' >
                          <div>{ round2( item.unitPriceComputed ) } </div></div>
                        <div class = 'w-14 m-1 p-1 bg-indigo-950 bg-opacity-50 rounded-md' >
                          <div>{ round2( item.unitPriceComputed * item.quantity ) }</div></div>
                      </div>
                  ) } ) }
                </div>
                </Show>
          ) } )()
        }
      </Match>
  </Switch>
  )
}