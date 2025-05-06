import { eyesWhite, eyesWhiteClosed } from "@/feats/assets"
import { useAuth } from "@/feats/authentication"
import { backend } from "@/feats/fetch"
import { useGlobal } from "@/feats/globalState"
import { GlyphEye, GlyphEyeClosed } from "@/feats/glyphs"
import { createMemory, createSession } from "@/feats/stateSystem"
import { useTheme } from "@/feats/styles"
import { User } from "@/feats/types"
import { useLocation, useNavigate } from "@solidjs/router"
import { Show } from "solid-js"

export function MainMenu(){
  const global = useGlobal()
  const auth = useAuth()
  const theme = useTheme()
  const navigate = useNavigate()
  const location = useLocation()
  console.log( 'MainMenu: location.pathName:', location.pathname )
  const state = { from: location.pathname }
  const local = createMemory( [
    "goHome", [ () => {
      navigate( "/", { replace: true, state } )
    } ],
    "goStyling", [ () => {
      navigate('/styling', { replace: true, state } )
    } ],
    "addUser", [ () => {
      navigate('/users/new', { replace: true, state } )
    } ]
  ] as const )

  return (
    <>
      <Show
        when = { global.isPortableDevice() }
        fallback = {
          <div class = { '' } >
            <button
                onclick = { () => global.setIsPortableDevice( prev => ! prev ) }
                class = {
                  theme.button( 'flex flex-row' ) } >
              <div class = { 'flex flex-row items-center' } >
                <GlyphEyeClosed/><pre class = { theme.paragraph() } > Portable view</pre>
              </div>  
            </button>
          </div>
        } >
          <div class = { '' } >
            <button
                onclick = { () => global.setIsPortableDevice( prev => ! prev ) }
                class = {
                  theme.button( 'flex flex-row' ) } >
              <div class = { 'flex flex-row items-center' } >
                <GlyphEye/><pre class = { theme.paragraph() } > Portable view</pre>
              </div>  
            </button>
          </div>
      </Show>
      <div class = "static flex" >
        <button
            onclick = { () => local.addUser() }
            class = { theme.button( '' ) } >
          Agregar usuario
        </button>
        <button
            onclick = { () => auth.logout() }
            class = { theme.button( '' ) } >
          Logout
        </button>
        <button
            onclick = { () => navigate( '/lock', { replace: true, state } ) }
            class = { theme.button( '' ) } >
          Lock
        </button>
      </div>
      <div>
        <button
            onclick = { () => local.goStyling() }
            class = { theme.button() } >
          Styling
        </button>
        <button
            onclick = { () => {
                backend( {
                  command: "PRINT_ONLINE_CLIENT"
                } )
            } }
            class = { theme.button( '' ) } >
          Print OnlineClient
        </button>
        <button
            onclick={ () => navigate( '/docs/FA/13', { replace: true, state } ) }
            class = { theme.button( '' ) } >
          Doc FA/15
        </button>
      </div>
    </>
  )
}