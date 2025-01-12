export function getParentEventId(){
  const fingerPrint = new Error().stack!.split( '\n' ).map( string => string.substring( string.lastIndexOf( '/' ) + 1 ) ).join( '\n' )

  const results = fingerPrint.match( /eventFingerPrint__(\d+)__/g )
  if( results && results.length > 0 ){
    const id = results[ 0 ].match( /eventFingerPrint__(\d+)__/ )![ 1 ]
    return Number.parseInt( id )
  }
  else return -1
}