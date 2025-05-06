import { useGlobal } from "@/feats/globalState"
import { GlyphDelete, GlyphDisable, GlyphPurpleFlag, GlyphRainckeck, GlyphRedFlag, GlyphYellowFlag } from "@/feats/glyphs"
import { useMemory } from "@/feats/stateSystem"
import { useTheme } from "@/feats/styles"
import { MouseEventHTMLButton, FocusEventHTMLDiv, MouseEventDOMDiv, MouseEventHTMLTableRow, MouseEventHTMLDiv } from "@/feats/types"
import { round2 } from "@/utils/math"
import { Show } from "solid-js"

export function SelectedProducts(){
  const global = useGlobal()
  const theme = useTheme()
  const [ mouseEnterIndex, setMouseEnterIndex ] = useMemory( -1 )
  const [ targetDimensions, setTargetDimensions ] = useMemory( {} as DOMRect )
  const onClick = ( event:MouseEventDOMDiv ) => {
    const button = event.buttons
    const index = Number.parseInt( event.currentTarget.getAttribute( 'data-index' )! )
    console.log( 'SelectedItems: onClick event.button, index', event.button, index )

    if( button == 0 ){
      event.preventDefault()
    }
    else if( button == 1 ){
      global.setPublicItems( items => { items.splice( index, 1 ); return items } )
    }
    else if( button == 2 ){
      event.preventDefault()
      global.setPublicItems( items => {
        items[ index ].disabled = ! items[ index ].disabled
        return items 
      } )
      global.updateTotals()
    }
  }

  const onQuantityBlur = ( event:FocusEventHTMLDiv ) => {
    const quantity = event.currentTarget.textContent!
    const index = Number.parseInt( event.currentTarget.getAttribute( 'data-index' )! )
    global.setPublicItems( items => {
      items[ index ].quantity = Number.parseFloat( quantity ) 
      return items 
    } )
    global.updateTotals()
  }

  const onUnitPriceBlur = ( event:FocusEventHTMLDiv ) => {
    const unitPrice = event.currentTarget.textContent!
    const index = Number.parseInt( event.currentTarget.getAttribute( 'data-index' )! )
    if( global.isPortableDevice() )
      event.currentTarget.parentElement!.parentElement!.setAttribute( 'class', `bg-yellow-600` )
    else event.currentTarget.parentElement!.parentElement!.parentElement!.setAttribute( 'class', `bg-yellow-600` )
    setTimeout( () => {
      global.setPublicItems( items => {
        items[ index ].unitPrice = Number.parseFloat( unitPrice ) 
        items[ index ].unitPriceComputed = Number.parseFloat( unitPrice ) 
        items[ index ].edited = true
        return items 
      } )
      global.recomputeSelectedItems()
      global.updateTotals()
    }, 50 )
  }

  const onRowBlur = ( event:FocusEventHTMLDiv ) => {
    const text = event.currentTarget.textContent!
    const index = Number.parseInt( event.currentTarget.getAttribute( 'data-index' )! )
    const id = event.currentTarget.getAttribute( 'id' )!
    if( global.isPortableDevice() )
      event.currentTarget.parentElement!.parentElement!.setAttribute( 'class', `bg-yellow-600` )
    else event.currentTarget.parentElement!.parentElement!.parentElement!.setAttribute( 'class', `bg-yellow-600` )
    setTimeout( () => {
      global.setPublicItems( items => {
        ( items[ index ] as any )[ id ] = text.toUpperCase()
        items[ index ].edited = true
        return items 
      } )
      global.updateTotals()
    }, 50 )
  }

  const disableItem = ( event:MouseEventHTMLButton|MouseEventHTMLDiv ) => {
    const index = Number.parseInt( event.currentTarget.getAttribute( 'data-index' )! )
    if( global.isPortableDevice() ){
      const parent = event.currentTarget.parentElement!
      const class_ = parent.getAttribute( 'class' )
      if( global.publicItems()[ index ].disabled )
        parent.setAttribute( 'class', `${ class_ } bg-green-700` )
      else parent.setAttribute( 'class', `${ class_ } bg-red-700` )
    }
    else{
      const parent = event.currentTarget.parentElement!.parentElement!.parentElement!
      const class_ = parent.getAttribute( 'class' )
      if( global.publicItems()[ index ].disabled )
        parent.setAttribute( 'class', `${ class_ } bg-green-700` )
      else parent.setAttribute( 'class', `${ class_ } bg-red-700` )
    }
    setTimeout( () => {
      global.setPublicItems( items => {
        items[ index ].disabled = ! items[ index ].disabled
        return items 
      } )
      global.updateTotals()
    }, 50 )
  }

  const raincheck = ( event:MouseEventHTMLButton|MouseEventHTMLDiv ) => {
    const index = Number.parseInt( event.currentTarget.getAttribute( 'data-index' )! )
    if( global.isPortableDevice() ){
      const parent = event.currentTarget.parentElement!
      const class_ = parent.getAttribute( 'class' )
      if( ! global.publicItems()[ index ].raincheck )
        parent.setAttribute( 'class', `${ class_ } bg-purple-700` )
      else parent.setAttribute( 'class', `${ class_ } bg-gray-700` )
    }
    else {
      const parent = event.currentTarget.parentElement!.parentElement!.parentElement!
      const class_ = parent.getAttribute( 'class' )
      if( ! global.publicItems()[ index ].raincheck )
        parent.setAttribute( 'class', `${ class_ } bg-purple-700` )
      else parent.setAttribute( 'class', `${ class_ } bg-gray-700` )
    }
    setTimeout( () => {
      global.setPublicItems( items => {
      items[ index ].raincheck = ! items[ index ].raincheck
      return items 
    } ) }, 50 )
  }

  const deleteItem = ( event:MouseEventHTMLButton|MouseEventHTMLDiv ) => {
    const index = Number.parseInt( event.currentTarget.getAttribute( 'data-index' )! )
    if( global.isPortableDevice() ){
      const parent = event.currentTarget.parentElement!
      const class_ = parent.getAttribute( 'class' )
      parent.setAttribute( 'class', `${ class_ } bg-black` )
      console.log( 'SelectedProducts:deleteItem', parent )
    }
    else{
      const parent = event.currentTarget.parentElement!.parentElement!.parentElement!
      const class_ = parent.getAttribute( 'class' )
      parent.setAttribute( 'class', `${ class_ } bg-black transition-opacity ease-out duration-100 opacity-100 hover:opacity-0` )
      console.log( 'SelectedProducts:deleteItem', parent )
    }
    setTimeout( () => {
      global.setPublicItems( items => {
        items.splice( index, 1 )
        return items
      } )
      global.updateTotals()
    }, 50)
  }

  const onMouseEnter = ( event:MouseEventHTMLTableRow|MouseEventHTMLDiv ) => {
    const index = Number.parseInt( event.currentTarget.getAttribute( 'data-index' )! )
    const targetDimensions_ = event.currentTarget.getBoundingClientRect()
    setTargetDimensions( targetDimensions_ )
    setMouseEnterIndex( index )
  }
  const onMouseLeave = () => {
    setMouseEnterIndex( -1 )
  }

  const evenClass = "bg-cyan-950"
  const oddClass = "bg-cyan-900"
  const getColor = ( index:number ) => index % 2 == 0 ? evenClass : oddClass
  return (
    <Show
      when = { global.isPortableDevice() }
      fallback = { <>
        <table class = { `w-ful min-w-full` } >
          { global.publicItems().map( ( item, index ) => {
            const Flags = <>
                { item.disabled ? <GlyphRedFlag class = 'glyph-shadow-black' /> : <></> }
                { item.raincheck ? <GlyphPurpleFlag class = 'glyph-shadow-black' /> : <></> }
                { item.edited ? <GlyphYellowFlag class = 'glyph-shadow-black' /> : <></> }
              </>
            const row =
              <tr class = { getColor( index ) } data-index = { index } on:contextmenu={ onClick } on:click = { onClick } on:mouseenter = { onMouseEnter } on:mouseleave = { onMouseLeave }>
                <td class = 'bg-opacity-50 rounded-md flex flex-row flex-shrink w-11' >
                  { Flags }</td>
                <td class = 'w-14 m-1 p-1 bg-indigo-800 bg-opacity-50 rounded-md' >
                  <div tabindex = { index } contentEditable data-index = { index } onblur = { onQuantityBlur } id = 'quantity' >{ item.quantity }</div></td>
                <td class = 'm-1 p-1 bg-indigo-950 bg-opacity-50 rounded-md' >
                  <div tabindex = "-1" contentEditable data-index = { index } onblur = { onRowBlur } id = 'unit' >{ item.unit } </div></td>
                <td class = 'm-1 p-1 bg-indigo-800 bg-opacity-50 rounded-md' >
                  <div tabindex = "-1" contentEditable data-index = { index } onblur = { onRowBlur } id = 'code' >{ item.code } </div></td>
                <td class = 'm-1 p-1 bg-indigo-950 bg-opacity-50 rounded-md' >
                  <div tabindex = "-1" contentEditable data-index = { index } onblur = { onRowBlur } id = 'description' >{ item.description } </div></td>
                <td class = 'm-1 p-1 bg-indigo-800 bg-opacity-50 rounded-md' >
                  <div tabindex = "-1" contentEditable data-index = { index } onblur = { onRowBlur } id = 'unitCode' >{ item.unitCode } </div></td>
                <td class = 'm-1 p-1 bg-indigo-950 bg-opacity-50 rounded-md' >
                  <div tabindex = "-1" contentEditable data-index = { index } onblur = { onRowBlur } id = 'prodservCode' >{ item.prodservCode } </div></td>
                <td class = 'w-14 m-1 p-1 bg-indigo-800 bg-opacity-50 rounded-md' >
                  <div tabindex = "-1" contentEditable data-index = { index } onblur = { onUnitPriceBlur } id = 'unitPrice' >{ round2( item.unitPriceComputed ) } </div></td>
                <td class = 'w-14 m-1 p-1 bg-indigo-950 bg-opacity-50 rounded-md' >
                  <div tabindex = "-1" data-index = { index } >{ round2( item.unitPriceComputed * item.quantity ) } </div></td>
                <td><Show
                    when = { mouseEnterIndex() == index }
                    fallback = <></> >
                  <div class = 'flex flex-row bg-black bg-transparent absolute h-12' style = { { left: `${ targetDimensions().x + targetDimensions().width + document.querySelector( 'html' )!.scrollLeft }px`, top: `${ targetDimensions().y + document.querySelector( 'html' )!.scrollTop - ( 48 - targetDimensions().height ) / 2 }px` } }>
                    <button data-index = { index } on:click = { raincheck } class = { theme.button( 'flex justify-center items-center bg-purple-700 hover:bg-purple-400 active:bg-purple-950' ) } title = 'A vale' ><GlyphRainckeck class = 'text-white' /></button>
                    <button data-index = { index } on:click = { disableItem } class = { theme.button( 'flex justify-center items-center bg-red-700 hover:bg-red-400 active:bg-red-950' ) } title = 'Desactivar' ><GlyphDisable class = 'text-white' /></button>
                    <button data-index = { index } on:click = { deleteItem } class = { theme.button( 'flex justify-center items-center bg-gray-500 hover:bg-gray-400 active:bg-gray-900' ) } title = 'Borrar' ><GlyphDelete class = 'text-white' /></button>
                  </div> 
                </Show></td>
              </tr>
            return row
           } ) }
        </table>
        
      </> } >
      <div class = { `w-full` } >
      { global.publicItems().map( ( item, index ) => {
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
              <div contentEditable data-index = { index } onblur = { onQuantityBlur } id = 'quantity' >{ item.quantity }</div></div>
            <div class = 'm-1 p-1 bg-indigo-950 bg-opacity-50 rounded-md' >
              <div contentEditable data-index = { index } onblur = { onRowBlur } id = 'unit' >{ item.unit } </div></div>
            <div class = 'm-1 p-1 bg-indigo-800 bg-opacity-50 rounded-md' >
              <div contentEditable data-index = { index } onblur = { onRowBlur } id = 'code' >{ item.code } </div></div>
            <div class = 'm-1 p-1 bg-indigo-950 bg-opacity-50 rounded-md' >
              <div contentEditable data-index = { index } onblur = { onRowBlur } id = 'description' >{ item.description } </div></div>
            <div class = 'm-1 p-1 bg-indigo-800 bg-opacity-50 rounded-md' >
              <div contentEditable data-index = { index } onblur = { onRowBlur } id = 'unitCode' >{ item.unitCode } </div></div>
            <div class = 'm-1 p-1 bg-indigo-950 bg-opacity-50 rounded-md' >
              <div contentEditable data-index = { index } onblur = { onRowBlur } id = 'prodservCode' >{ item.prodservCode } </div></div>
            <div class = 'w-14 m-1 p-1 bg-indigo-800 bg-opacity-50 rounded-md' >
              <div contentEditable data-index = { index } onblur = { onUnitPriceBlur } id = 'unitPrice' >{ round2( item.unitPriceComputed ) } </div></div>
            <div class = 'w-14 m-1 p-1 bg-indigo-950 bg-opacity-50 rounded-md' >
              <div data-index = { index } >{ round2( item.unitPriceComputed * item.quantity ) } </div></div>
            <div data-index = { index } on:click = { raincheck } class = {  'w-8 flex justify-center items-center bg-purple-700 hover:bg-purple-400 active:bg-purple-950 cursor-pointer rounded-md' } title = 'Vale' >
              <GlyphRainckeck class = 'text-white'/>
            </div>
            <div data-index = { index } on:click = { disableItem } class = { 'w-8 flex justify-center items-center bg-red-700 hover:bg-red-400 active:bg-red-950 cursor-pointer rounded-md' } title = 'Desactivar' >
              <GlyphDisable class = 'text-white' />
            </div>
            <div data-index = { index } on:click = { deleteItem } class = { 'w-8 flex justify-center items-center bg-gray-500 hover:bg-gray-400 active:bg-gray-900 cursor-pointer rounded-md' } title = 'Delete' >
              <GlyphDelete class = 'text-white'/>
            </div>
          </div>
      ) } ) }
    </div>
    </Show>
  )
}
