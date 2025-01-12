export function surroundKeywords( string:string, keywords:string[], surround:{ left:string, right:string } ){
  // Recorremos cada keyword en el array
  let text = string
  let overSurroundAvoid:{ left:string, right:string, replacement:string  }[] = []
  keywords.forEach( ( keyword, index ) => {
    const coveredKeyword = {
      left:`(${ stringTimes( '\u0000', index ) }`,
      right:`${ stringTimes( '\u0000', index ) })`,
      replacement: keyword }
    overSurroundAvoid.push( coveredKeyword )
    // Creamos una expresión regular para buscar el keyword (con soporte para mayúsculas y minúsculas)
    const regex = new RegExp( `(${ keyword })`, 'gi' );
    
    // Reemplazamos cada coincidencia con el tag <strong>keyword[N]</strong>
    text = text.replace( regex, `${ coveredKeyword.left }${ coveredKeyword.right }`);
  });

  overSurroundAvoid.forEach( ( coveredKeyword ) => {
    const regex =
      new RegExp( `(\\(${ coveredKeyword.left }${ coveredKeyword.right }\\))`, 'i' );
    text =
      text.replace(
        regex,
        `${ surround.left }${ coveredKeyword.replacement }${ surround.right }` )
  } )

  return text;
}

export function stringTimes( string:string, size:number ){
  let result = ""
  for ( let i = 0; i < size; i ++ ) 
    result += string
  return result
}

export function splitAt( regex:RegExp, string:string ){
  const index = string.search( regex )
  if( index < 0) return null;//{ left: "", right: "", removed: 0, splited: false }
  const match = string.match( regex )
  const removed = match![ 0 ].length
  const left = string.substring( 0, index )
  const right = string.substring( index + removed )
  return { left, right, removed }
}

export function highlightKeywords( string:string, keywords:string[] ){
  return surroundKeywords( string, keywords, { left: '<strong>', right: '</strong>' } )
}
