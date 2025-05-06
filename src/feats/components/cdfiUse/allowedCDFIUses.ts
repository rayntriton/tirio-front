import { FiscalRegime } from "@/feats/types"
import { CFDI_USES } from "./CFDI_USES"

export function allowedCFDIUses( rfc:string, fiscalRegime:string ){
  if( rfc == '' || fiscalRegime == '' ) return []
  return CFDI_USES.filter( function( use ) {
    if( rfc.replace( '-', '' ).replace( ' ', '' ).length == 13 ){
      if( use.contributorType1Allowed && use.allowedFiscalRegimes.includes( fiscalRegime ) )
        return true
    }
    if( rfc.replace( '-', '' ).replace( ' ', '' ).length == 12 ){
      if( use.contributorType2Allowed && use.allowedFiscalRegimes.includes( fiscalRegime ) )
        return true
    }
  } )

}

export function getCFDIUseDescriptionByCode( code:string ){
  const cfdiUse = CFDI_USES.filter( cfdiUse => {
    if( cfdiUse.code == code ) return true
    return false 
  } )
  if( cfdiUse.length > 0 )
    return cfdiUse[ 0 ].description
  return ''
}