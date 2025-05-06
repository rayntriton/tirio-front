import { useGlobal } from "@/feats/globalState";
import { GlyphAvatar } from "@/feats/glyphs";
import { useTheme } from "@/feats/styles";
import { Customer } from "@/feats/types";
import { Show } from "solid-js";

export function SelectedCustomer( props:{ customer:Customer } ){
  const global = useGlobal()
  const theme = useTheme()
  return (
    <Show
        when={ global.isPortableDevice() }
        fallback = { <>
          <p class = { theme.paragraph( 'text-center w-full' ) } ><GlyphAvatar/> Cliente</p>
          <table class = 'w-full' >
            <tbody>
            <tr>
              <td>
                <p class = { theme.paragraph() } ><GlyphAvatar/>nombre:</p>
              </td>
              <td>{ global.customer().consummer }</td>
            </tr>
            </tbody>
          </table>
        </> } >
      <div>

      </div>
    </Show>
  )
  
}