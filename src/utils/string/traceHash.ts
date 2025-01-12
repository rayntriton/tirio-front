import { hash10 } from "@/utils/math";
import { firstLines } from "@/utils/string";

export function traceHash(){
  //return hash10( new Error().stack!.split( "\n" ).slice( 0, 10 ).join( "" ) )
  return hash10( firstLines( new Error().stack!, 10 ) )
}

/*
function getFirstLines( text, n ) {
  if (n <= 0) return null;

  var index = -1;
  for (var i = 0; i < n; i++) {
      index = text.indexOf("\n", index) + 1;
      if (index === 0) return null;
  }
  return { 0: text.substring(0, index - 1), 1: text.substring(index) }
}*/