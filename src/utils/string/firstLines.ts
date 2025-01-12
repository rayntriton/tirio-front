export function firstLines( text:string, n:number ){
  const lineRegex = /.*\n/g
  let lines = ""
  let line:RegExpExecArray|null = null
  for( let i = 0; i < n && ( line = lineRegex.exec( text ) ) != null ; i ++ )
    lines += line[0]
  return lines
}