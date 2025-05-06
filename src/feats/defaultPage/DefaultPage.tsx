import { CommandControl, CommandControlProvider, SearchCustomers, useCommandControl } from "@/feats/commandLine";
import { SidePanel } from "./SidePanel";
import { useGlobal } from "@/feats/globalState";
import { Match, Show, Switch } from "solid-js";
import { SearchProducts, SelectedProducts } from "@/feats/components/product";
import { SearchUsers } from "@/feats/components/user";
import { useNavigate } from "@solidjs/router";
import { createIdleTimer } from "@solid-primitives/idle";

export function DefaultPage(){
  
  const global = useGlobal()
  const local = useCommandControl()

  return (
      <div  class = "w-full flex items-center justify-center content-center" >
        <Switch>
          <Match when = { global.isPortableDevice() } >
            <div class = 'w-full' >
              <CommandControl />
              <Show when = { local.isProductsCatalogVisible() } >
                <SearchProducts/>
              </Show>
              <Show when = { local.isCustomersCatalogVisible() } >
                <SearchCustomers/>
              </Show>
              <SelectedProducts/>
              <SidePanel/>
            </div>
          </Match>
          <Match when = { ! global.isPortableDevice() } >
            <div class = 'w-full flex flex-row' >
              <div class = 'w-7/12' >
                <CommandControl />
                <Show when = { local.isProductsCatalogVisible() } >
                  <SearchProducts/>
                </Show>
                <Show when = { local.isCustomersCatalogVisible() } >
                  <SearchCustomers/>
                </Show>
                <Show when = { local.isUsersCatalogVisible() } >
                  <SearchUsers/>
                </Show>
                <SelectedProducts/>
              </div>
              <div class = 'flex-1 w-5/12' >
                <SidePanel/>
              </div>
            </div>
          </Match>
        </Switch>
      </div>
  )
}
