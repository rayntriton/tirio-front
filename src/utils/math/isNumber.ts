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
  return ! isNaN( parseFloat( value ) ) && isFinite( value )
}

/*deprecated*/
export function isNumber_( value:any ){
  return isCustomNumber( value )
}
