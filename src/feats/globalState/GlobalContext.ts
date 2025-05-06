import { getCommandControlState } from "@/feats/commandLine"
import { SETTINGS } from "@/feats/settings"
import { createMemory, createSession } from "@/feats/stateSystem"
import { PublicItem, Customer, Shopman } from "@/feats/types"
import { round2 } from "@/utils/math"
import { IdleTimer } from "@solid-primitives/idle"
import { NavigateOptions, Navigator } from "@solidjs/router"
import { createContext } from "solid-js"

let GLOBAL_STATE = {} as GlobalContext

export const getGlobalState = () => GLOBAL_STATE

export const globalState = () => {
  const global = {
    ...createSession( [
      'total', 'setTotal', [ 0 ],
      'total2', 'setTotal2', [ 0 ],
      'publicItems', 'setPublicItems', [ [] as PublicItem[] ],
      'paymentMethod', 'setPaymentMethod', [ 'PUE' ],
      'paymentWay', 'setPaymentWay', [ '01' ],
      'destiny', 'setDestiny', [ '' ],
      'coin', 'setCoin', [ 'MXN' ],
      'cfdiUse', 'setCfdiUse', [ '' ],
      'customer', '_setCustomer', [ { ...SETTINGS.DEFAULT_CUSTOMER } ]
    ] as const ),
    ...createMemory( [
      'itemsFound', 'setItemsFound', [ [] as PublicItem[] ],
      'customersFound', 'setCustomersFound', [ [] as Customer[] ],
      'usersFound', 'setUsersFound', [ [] as Shopman[] ],
      'searchResultSet', 'setSearchResultSet', [ [] ],
      'requestNumber', 'setRequestNumber', [ 0 ],
      'isPortableDevice', 'setIsPortableDevice', [ SETTINGS.PORTABLE ],
      'discount', 'setDiscount', [ 0 ],
      'setCustomer', [ ( customer:Customer ) => {
        global.setCfdiUse( customer.cfdiUse )
        global._setCustomer( customer )
      } ],
      'updateTotals', [ () => {
        const items = global.publicItems()
        let total = 0
        let total2 = 0
        items.map( item => {
          if( ! item.disabled ){
            total2 += item.quantity * item.unitPriceComputed 
          }
          total += item.quantity * item.unitPriceComputed 
        } ) 
        global.setTotal( round2( total ) )
        global.setTotal2( round2( total2 ) )
      } ],
      'addItem', [ ( item:PublicItem ) => {
        global.setPublicItems( items => {
          item.quantity = getCommandControlState().commandLine().quantity! || item.quantity
          if( item.edited )
            item.unitPriceComputed = item.unitPrice
          else
            item.unitPriceComputed = round2( item.unitPrice - ( item.unitPrice - item.providerPrice ) * ( global.discount() / 100 ) )
          items.unshift( item )
          return items
        } )
        global.updateTotals()
      } ],
      'recomputeSelectedItems', [ () => {
        global.setPublicItems( items => {
          for( let i = 0; i < items.length; i ++ ){
            if( ! items[ i ].edited )
              items[ i ].unitPriceComputed = round2( items[ i ].unitPrice - ( items[ i ].unitPrice - items[ i ].providerPrice ) * ( global.discount() / 100 ) )
          }
          return items
        } )
      } ],
      'idleTimer', 'setIdleTimer', [ {} as IdleTimer ],
      ] as const ),
  }
  if( ! SETTINGS.PRODUCTION_ENV ){
    ( window as any ).global = global
  }
  GLOBAL_STATE = global
  return global
}

export type GlobalContext = ReturnType< typeof globalState >

export const GlobalContext = createContext< GlobalContext >();

