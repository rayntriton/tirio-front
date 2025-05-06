import { FISCAL_REGIMES } from "./FISCAL_REGIMES"

export function allowedFiscalRegimes( rfc:string ){
  if( rfc == undefined || rfc == '' ) return []
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

export function getFiscalRegimeDescriptionByCode( code:string ){
  const fiscalRegime = FISCAL_REGIMES.filter( fiscalRegime => {
    if( fiscalRegime.code == code ) return true
    return false 
  } )
  if( fiscalRegime.length > 0 )
    return fiscalRegime[ 0 ].description
  return ''
}