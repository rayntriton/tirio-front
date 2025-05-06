import { useAuth } from "@/feats/authentication"
import { createMemory, createSession } from "@/feats/stateSystem"
import { useTheme } from "@/feats/styles"
import { User } from "@/feats/types"
import { useNavigate } from "@solidjs/router"
import { Show } from "solid-js"
import { gridWhite, homeWhite } from '@feats/assets'
import { GlyphAvatar, GlyphHome, GlyphMenu } from "@/feats/glyphs"
import { createIdleTimer } from "@solid-primitives/idle"
import { useGlobal } from "@/feats/globalState"

export function Header(){
  const global = useGlobal()
  const auth = useAuth()
  const theme = useTheme()
  const navigate = useNavigate()
  const local = createMemory( [
    "goHome", [ () => {
      navigate( "/", { replace: true } )
    } ],
    "goMenu", [ () => {
      navigate( "/menu", { replace: true } )
    } ]
  ] as const )

  const idleTimer = createIdleTimer({
    onIdle: () => navigate( '/lock' ),
    idleTimeout: 5 * 60 * 1000
  } )
  global.setIdleTimer( idleTimer )

  return (
    <div class = "static flex" >
      <Show
          when = { auth.isAuthenticated() }
          fallback = { <p class = { theme.paragraph( 'bg-opacity-0 flex-1 text-center') } >Login</p> } >
          <div class = { 'flex flex-row items-center' } >
          <GlyphAvatar/><pre class = { theme.paragraph() } >{ (auth.user() as any as User).login }</pre>
          </div>
        <button
            onclick={ () => local.goHome( ) }
            class = {
              theme.button( ' flex-1 flex content-center justify-center' ) } >
          <GlyphHome/>
        </button>
        <button
            onclick={ () => local.goMenu() }
            class = {
              theme.button( 'flex-1 flex content-center justify-center' ) } >
          <GlyphMenu/>
        </button>
      </Show>
    </div>
  )
}