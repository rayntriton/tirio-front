import { getCFDIUseDescriptionByCode } from "@/feats/components/cdfiUse";
import { getFiscalRegimeDescriptionByCode } from "@/feats/components/fiscalRegime";
import { useGlobal } from "@/feats/globalState";
import { GlyphEdit, GlyphPlus } from "@/feats/glyphs";
import { SETTINGS } from "@/feats/settings";
import { Accessor, useEvent } from "@/feats/stateSystem";
import { useTheme } from "@/feats/styles";
import { type Customer } from "@/feats/types";
import { useNavigate } from "@solidjs/router";
import { Show } from "solid-js";

export function Customer( props:{ customer:Accessor< Customer >, setCustomer?:string } ){
  const global = useGlobal()
  const theme = useTheme()
  const navigate = useNavigate()
  const customer = props.customer
  const navigateToEditCustomer = useEvent( () => {
    navigate( "/customers/edit/" + customer().id, { replace: true, state: { setCustomer: props.setCustomer } } )
  } )
  const navigateToNewCustomer = useEvent( () => {
    navigate( "/customers/new", { replace: true, state: { setCustomer: props.setCustomer } } )
  } )
  
  return (
    <div class = { `w-full` } >
      <div class = 'flex flex-row items-center' >
        <p class = { theme.paragraph() } >Cliente</p>
        <Show when = { customer().id != undefined && customer().id != -1 } >
          <button class = { theme.button( 'w-14' ) } onclick = { navigateToEditCustomer } ><GlyphEdit/></button>
        </Show>
        <button class = { theme.button( 'w-14' ) } onclick = { navigateToNewCustomer } ><GlyphPlus/></button>
      </div>
      <div class = { global.isPortableDevice() ? '' : '' } >
        <div class = { `w-full ` } >
          <div><div class = 'font-bold text-center' >
            Nombre
          </div><div class = 'bg-black bg-opacity-30 min-h-1' >
            { customer().consummer || '' }
          </div></div>
          <div><div class = 'font-bold text-center' >
            RFC
          </div><div class = 'bg-black bg-opacity-30 min-h-1' >
            { customer().rfc || '' }
          </div></div>
          <div><div class = 'font-bold text-center' >
            CP
          </div><div class = 'bg-black bg-opacity-30 min-h-1' >
            { customer().cp || '' }
          </div></div>
          <div><div class = 'font-bold text-center' >
            Email(s)
          </div><div class = 'bg-black bg-opacity-30 min-h-1' >
            { customer().email || '' }
          </div></div>
          <div><div class = 'font-bold text-center' >
            Tel(s)
          </div><div class = 'bg-black bg-opacity-30 min-h-1' >
            { customer().tel || '' }
          </div></div>
          <div><div class = 'font-bold text-center' >
            Régimen
          </div><div class = 'bg-black bg-opacity-30 min-h-1' >
            { ( customer().fiscalRegime || '' ) + " - " + getFiscalRegimeDescriptionByCode( customer().fiscalRegime || '' ) }
          </div></div>
          <div><div class = 'font-bold text-center' >
            Uso de CFDI
          </div><div class = 'bg-black bg-opacity-30 min-h-1' >
            { ( customer().cfdiUse || '' ) + " - " + getCFDIUseDescriptionByCode( customer().cfdiUse || '' ) }
          </div></div>
          <div><div class = 'font-bold text-center' >
            Calle
          </div><div class = 'bg-black bg-opacity-30 min-h-1' >
            { `${ customer().address || '' }` }
          </div></div>
          <div><div class = 'font-bold text-center' >
            No exterior
          </div><div class = 'bg-black bg-opacity-30 min-h-1' >
            { customer().exteriorNumber || '' }
          </div></div>
          <div><div class = 'font-bold text-center' >
            No interior
          </div><div class = 'bg-black bg-opacity-30 min-h-1' >
            { customer().interiorNumber || '' }
          </div></div>
          <div><div class = 'font-bold text-center' >
            Colonia
          </div><div class = 'bg-black bg-opacity-30 min-h-1' >
            { customer().suburb || '' }
          </div></div>
          <div><div class = 'font-bold text-center' >
            Referencias ( Entre calles )
          </div><div class = 'bg-black bg-opacity-30 min-h-1' >
            { customer().aditionalReference || '' }
          </div></div>
          <div><div class = 'font-bold text-center' >
            Localidad
          </div><div class = 'bg-black bg-opacity-30 min-h-1' >
            { customer().locality || '' }
          </div></div>
          <div><div class = 'font-bold text-center' >
            Ciudad
          </div><div class = 'bg-black bg-opacity-30 min-h-1' >
            { customer().city || '' }
          </div></div>
          <div><div class = 'font-bold text-center' >
            Estado
          </div><div class = 'bg-black bg-opacity-30 min-h-1' >
            { customer().state || '' }
          </div></div>
          <div><div class = 'font-bold text-center' >
            País
          </div><div class = 'bg-black bg-opacity-30 min-h-1' >
            { customer().country || '' }
          </div></div>
          <div><div class = 'font-bold text-center' >
            Descuento(%)
          </div><div class = 'bg-black bg-opacity-30 min-h-1' >
            { customer().discountPercentage || '' }
          </div></div>
          <div><div class = 'font-bold text-center' >
            Credito(dias)
          </div><div class = 'bg-black bg-opacity-30 min-h-1' >
            { customer().payment || '' }
          </div></div>
        </div>
      </div>
    </div>
  )
}