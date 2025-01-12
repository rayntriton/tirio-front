import { useAuth } from "@/feats/authentication"
import { PRODUCTION_ENV } from "@/feats/settings"
import { createMemory, createSession } from "@/feats/stateSystem"
import { useTheme } from "@/feats/styles"
import { User } from "@/feats/types"
import { useNavigate } from "@solidjs/router"
import { Show } from "solid-js"
import { gridWhite, homeWhite } from '@feats/assets'

export function Header(){
  const auth = useAuth()
  const theme = useTheme()
  const navigate = useNavigate()
  const local = createMemory( [
    "goHome", [ () => {
      navigate( "/" )
    } ]
  ] as const )

  return (
    <div class = "static flex" >
      <Show
          when={ auth.isAuthenticated() }
          fallback = { <p class = { theme.paragraph( 'bg-opacity-0 flex-1 text-center') } >Login</p> } >
        <p class = { theme.paragraph() } >{ "👤 " + (auth.user() as any as User).login }</p>
        <button
            onclick={ ()=>local.goHome( ) }
            class = {
              theme.button( ' flex-1 flex content-center justify-center' ) } >
          <img class = 'flex-col' src = { homeWhite.default } ></img>
        </button>
        <button
            onclick={ ()=>navigate('/menu' ) }
            class = {
              theme.button( 'flex-1 flex content-center justify-center' ) } >
          <img class = 'flex-col' src = { gridWhite.default } ></img>
        </button>
      </Show>
    </div>
  )
}