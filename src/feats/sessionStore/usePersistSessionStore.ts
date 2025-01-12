import { SetterMutable } from "@/feats/types"
import { usePersistentStorage } from "./usePersistentStorage"
import { Accessor } from "solid-js"
import { deprecate } from "util"

/** @deprecated */
export function usePersistentSessionStore
    < A extends any[] >( ...values: A ):Alternate< A >{
  const result:any[] = []
  let keyId = 0
  for( const value of values ){
    const [ getter, setter ] = usePersistentStorage( value, ++ keyId )
    result.push( getter )
    result.push( setter )
    console.log( "usePersistentSessionStore getter()", getter(), "value", value )
  }
  return result as Alternate< A >
}

export type Alternate< A extends any[], Result extends any[] = [] > = 
  A extends [ infer First, ...infer Rest ]
    ? Alternate< Rest, [ ...Result, Accessor< First >, SetterMutable< First > ] >
    : Result
