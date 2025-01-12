import { FiscalRegime } from "@/feats/types"
import { CFDI_USES } from "./CFDI_USES"

export function allowedCFDIUses( rfc:string, fiscalRegime:FiscalRegime ){
  
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