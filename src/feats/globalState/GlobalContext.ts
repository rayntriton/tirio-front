import { CommandLine } from "@/feats/commandLine"
import { createSessionSignals, createMemorySignals } from "@/feats/stateSystem"
import { PublicItem, Customer } from "@/feats/types"
import { createContext } from "solid-js"

export const globalState = () => {
  const global = {
    ...createSessionSignals( [
      'total', 'setTotal',
      'total2', 'setTotal2',
      'publicItems', 'setPublicItems',
      'paymentMethod', 'setPaymentMethod',
      'paymentWay', 'setPaymentWay',
      'fiscalRegime', 'setFiscalRegime',
      'destiny', 'setDestiny',
      'coin', 'setCoin',
      'cfdiUse', 'setCfdiUse',
      'customer', 'setCustomer',
      ], 0, 0, [] as PublicItem[], 'PUE', '01', "",'Mostrador', 'MXN', 'G01', {
        consummer: "PUBLICO GENERAL",
        rfc:"XAXX010101000",
        cp:"58020",
        country:"MEXICO",
        email:"raynmune@gmail.com"
      } as Customer ),
     ...createMemorySignals( [
        'itemsFound', 'setItemsFound',
        'customersFound', 'setCustomersFound',
        'searchResultSet', 'setSearchResultSet',
        'requestNumber', 'setRequestNumber',
        'commandLine', 'setCommandLine'
      ],[] as PublicItem[], [] as Customer[], [], 0, {} as CommandLine )
  }
  return global
}

export type GlobalContext = ReturnType< typeof globalState >

export const GlobalContext = createContext< GlobalContext >();