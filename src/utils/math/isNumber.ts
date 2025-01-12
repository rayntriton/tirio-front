function isNativeNumber( value:any ){
  return typeof value === 'number' && isFinite( value )
}

function isNumberObject( value:any ) {
  return ( Object.prototype.toString.apply( value ) === '[object Number]' )
}

function isCustomNumber( value:any ){
  return isNativeNumber( value ) || isNumberObject( value )
}

export function isNumber( value:any ){
  return isCustomNumber( value )
}

export function parseFloat( value:any ){
  if( isNumber( value ) ) return Number.parseFloat( value )
  else return NaN
}