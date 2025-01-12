import { useAuth } from "@/feats/authentication"
import { PRODUCTION_ENV } from "@/feats/settings"
import { createMemory, createSession } from "@/feats/stateSystem"
import { useTheme } from "@/feats/styles"
import { User } from "@/feats/types"
import { useNavigate } from "@solidjs/router"
import { Show } from "solid-js"

export function MainMenu(){
  const auth = useAuth()
  const theme = useTheme()
  const navigate = useNavigate()
  const local = createMemory( [
    "goHome", [ () => {
      navigate( "/" )
    } ]
  ] as const )

  return (
    <>
      <div class = "static flex" >
        <button onclick={ ()=>auth.logout( ) }
          class = { theme.button( '' ) } >Logout
        </button>
      </div>
      <div>
        <button  onclick={ ()=>navigate('/styling' ) }
          class = { theme.button() } >Styling
        </button>
      </div>
    </>
  )
}