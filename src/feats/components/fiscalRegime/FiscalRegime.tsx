import { allowedFiscalRegimes } from "./allowedFiscalRegime"
import { useGlobalState } from "@/feats/globalState"

export function FiscalRegime(){
  const global = useGlobalState()
  const rfc = global.customer().rfc
  const fiscalRegime = global.fiscalRegime()
  const fiscalRegimes = allowedFiscalRegimes( rfc )
  return(
    <select id="fiscalRegimes" style="width: 10%">
      <option disabled>Regimen fiscal</option>
      { fiscalRegimes.map( ( option ) => (
        <option value={ option.code } selected={ option.code == fiscalRegime } >
          { option.description }
        </option>
      ))}
    </select>
  )
}