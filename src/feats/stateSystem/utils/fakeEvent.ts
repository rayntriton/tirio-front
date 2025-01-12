
const fakeEvents = new Map< string, Function >()

export function createFakeEvent( name:string, body:string ){
  // Crea una nueva función dinámicamente
  const macroCode = `
    //# sourceURL=/events/${ name }
    fakeEvents.set( '${ name }',
      function ${ name }( ...args ){
        ${ body }
      } )
  `
  eval( macroCode ) as ( ...args:any[] ) => any
}

export function executeFakeEvent( name:string, ...args:any[] ):Promise< any >{
  const result = fakeEvents.get( name )!( ...args )
  fakeEvents.delete( name )
  return result
}