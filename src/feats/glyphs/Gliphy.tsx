import { useGlobal } from "@/feats/globalState"

export function Glyph( props:{ char:string, class?:string } ){
  return <pre class = { 'glyph ' + ( props.class || '' ) } >{ props.char }</pre>
}

export function GlyphEye( props:{ class?:string } ){
  return <Glyph char = "a" class = { "text-2xl " + ( props.class || '' ) } />
}

export function GlyphEyeClosed( props:{ class?:string } ){
  return <Glyph char = "b" class = { "text-2xl " + ( props.class || '' ) } />
}

export function GlyphHome( props:{ class?:string } ){
  return <Glyph char = "c" class = { "text-2xl " + ( props.class || '' ) } />
}

export function GlyphMenu( props:{ class?:string } ){
  return <Glyph char = "d" class = { "text-2xl " + ( props.class || '' ) } />
}

export function GlyphAvatar( props:{ class?:string } ){
  return <Glyph char = "e" class = { "text-2xl " + ( props.class || '' ) }  />
}

export function GlyphYellowFlag( props:{ class?:string } ){
  return <Glyph char = "f" class = { "text-2xl text-yellow-400 " + ( props.class || '' ) } />
}

export function GlyphRedFlag( props:{ class?:string } ){
  return <Glyph char = "g" class = { "text-2xl text-red-700 " + ( props.class || '' ) } />
}

export function GlyphPurpleFlag( props:{ class?:string } ){
  return <Glyph char = "h" class = { "text-2xl text-violet-700 " + ( props.class || '' ) }  />
}

export function GlyphRainckeck( props:{ class?:string } ){
  return <Glyph char = "i" class = { "text-2xl text-violet-700 " + ( props.class || '' ) }  />
}

export function GlyphDelete( props:{ class?:string } ){
  return <Glyph char = "j" class = { "text-2xl text-black " + ( props.class || '' ) } />
}

export function GlyphDisable( props:{ class?:string } ){
  return <Glyph char = "k" class = { "text-2xl text-red-700 " + ( props.class || '' ) } />
}

export function GlyphEdit( props:{ class?:string } ){
  return <Glyph char = "l" class = { "text-2xl " + ( props.class || '' ) } />
}

export function GlyphPlus( props:{ class?:string } ){
  return <Glyph char = "m" class = { "text-2xl " + ( props.class || '' ) } />
}
