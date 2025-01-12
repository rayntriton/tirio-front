import { allowedCFDIUses } from "./allowedCDFIUses"
import { useGlobal } from "@/feats/globalState"

export function CFDIUse(){
  const global = useGlobal()
  const fiscalRegime = global.fiscalRegime()
  const { rfc = global.customer()
  const cfdiUse = global.cfdiUse()
  const cfdiUses = allowedCFDIUses( rfc, fiscalRegime)
  return(
    <select id="cfdiUse" style="width: 10%">
      <option disabled>Uso de CFDI</option>
      { 
        
        cfdiUses.map( ( option ) => (
        <option value={ option.code } selected={ option.code == cfdiUse }>
          { option.description }
        </option>
      ))}
    </select>
  )
}