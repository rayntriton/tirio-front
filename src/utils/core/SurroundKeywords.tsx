import { ChildrenProps } from "@/feats/types";
import { splitAt, stringTimes } from "@/utils/string";
import { JSX, Show } from "solid-js";

export function SurroundKeywords( props:{ string:string, keywords:string[], surround:( props: ChildrenProps ) => JSX.Element } ){
  // Recorremos cada keyword en el array
  let text = props.string
  let overSurroundAvoid:{ left:string, right:string, replacement:string  }[] = []
  props.keywords.forEach( ( keyword, index ) => {
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
  const splitedString:{ subString:string, keywordIndex:number }[] = []

  let rest = text
  let continueSpliting = true
  while( continueSpliting ){
    const split = splitAt( /\(\u0000+\)/,  rest )
    if( split != null ){
      const subString = split.left
      const keywordIndex = ( split.removed - 2 ) / 2
      splitedString.push( { subString, keywordIndex } )
      rest = split.right
    }
    else{
      splitedString.push( { subString: rest, keywordIndex: -1 } )
    }
  }
  return (
    <>
      { splitedString.map( ( part ) => (
        <>
          { part.subString }
          <Show when={  part.keywordIndex != -1 } >
            <props.surround>
              { overSurroundAvoid[ part.keywordIndex ].replacement }
            </props.surround>
          </Show>
        </>
      ) ) }
    </>
  )
}
