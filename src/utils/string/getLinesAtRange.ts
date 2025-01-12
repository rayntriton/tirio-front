export function getLinesAtRange( text:string, init:number, end = Number.MAX_VALUE ){
  const lineRegex = /.*[\n\S]/gm
  let lines = ""
  let line:RegExpExecArray|null
  for( let i = 0; i < end && ( line = lineRegex.exec( text ) ) != null ; i ++ )
    if( init <= i && i < end )
      lines += line[0]
  return lines
}