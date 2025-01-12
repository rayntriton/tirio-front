import { FISCAL_REGIMES } from "./FISCAL_REGIMES"

export function allowedFiscalRegimes( rfc:string ){
  return FISCAL_REGIMES.filter( function( regime ) {
    if( rfc.replace( '-', '' ).replace( ' ', '' ).length == 13 ){
      if( regime.contributorType1Allowed )
        return true
    }
    if( rfc.replace( '-', '' ).replace( ' ', '' ).length == 12 ){
      if( regime.contributorType2Allowed )
        return true
    }
  } )
}