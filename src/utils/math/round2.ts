export function round2( number:number ){
  return Number.parseFloat( ( Math.round( number * 100 ) / 100 ).toFixed( 2 ) )
}