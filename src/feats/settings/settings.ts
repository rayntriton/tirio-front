import { Customer, PublicItem } from "@/feats/types"
import { mobileAndTabletCheck } from "@/utils/core"

const x = {

}
export const SETTINGS = {
  BACKEND_URL: 'https://192.168.0.25:8443/gfm-nio/',
  BACKEND_ENTRY: 'https://192.168.0.25:8443/gfm-nio/dbport',

  DEFAULT_CUSTOMER: {
    consummer:"PUBLICO GENERAL",
    rfc:"XAXX010101000",
    cp:"58020",
    locality:'MORELIA',
    city:'MORELIA',
    state:'MICHOACAN',
    country:"MEXICO",
    fiscalRegime: "616",
    cfdiUse: "S01",
    email:"raynmune@gmail.com",
    discountPercentage: 0,
    payment: 0,
  } as Customer,
  DEFAULT_PRODUCT: {
    id: -1,
    quantity: 1,
    code: "-GEN",
    mark: "GENERICA",
    unitPrice: 1,
    unitPriceComputed: 1,
    unit: "PZA",
    description: "",
    disabled: false,
    edited: true,
    raincheck: false,
    prodservCode: "01010101",
    unitCode: "H87",
    providerPrice: 0,
    incrementPercent: 0
  } as PublicItem,
  PORTABLE: mobileAndTabletCheck(),

  PRODUCTION_ENV: false,

  MAX_DYNAMIC_CATALOG_SIZE: 15,
  ALLOWED_PERMISSIONS :[
    // GENERAL
    'ADMIN',
    'BASIC',
    'AGENT',
    
    // USTOMER
    'READ_CUSTOMER',
    'CREATE_CUSTOMER',
    'BOCK_CUSTOMER',
    'DISABLE_CUSTOMER',
    'UPDATE_CUSTOMER',
    
    // AGENT
    'REGISTER_AGENT',
    'READ_AGENT',
    'AGENT_LOG_SEARCH',
    'AGENT_INCREMENT_EARNINGS',
    
    // PRODUCT
    'READ_PRODUCT',
    'CREATE_PRODUCT',
    'UPDATE_PRODUCT',
    'DELETE_PRODUCT',
    
    'GLOBAL_SEARCH',
    
    // SHOPMAN / USER
    'UPDATE_SHOPMAN',
    'UPDATE_USER',
    'CREATE_SHOPMAN',
    'CREATE_USER',
    
    // INVOICE
    'EMIT_INVOICE',
    'READ_INVOICE',
    'CANCEL_INVOICE',
    
    // SAMPLE
    'EMIT_SAMPLE',
    'READ_SAMPLE',
    'EDIT_SAMPLE',
    'CANCEL_SAMPLE',
    
    // ORDER
    'EMIT_ORDER',
    'READ_ORDER',
    'EDIT_ORDER',
    'CANCEL_ORDER',
    
    // CREDIT
    'EMIT_CREDIT',
    'READ_CREDIT',
    'EDIT_CREDIT',
    'CANCEL_CREDIT',
    
    // RAINCHECK
    'EMIT_RAINCHECK',
    'READ_RAINCHECK',
    'EDIT_RAINCHECK',
    'CANCEL_RAINCHECK',
    
    'INVOICE_ORDER_PAY_ON_CREDIT',
    'INVOICE_FACTURE_PAY_ON_CREDIT',
    'INVOICE_ORDER_PAY_ON_PAST_DUE',
    'INVOICE_FACTURE_PAY_ON_PAST_DUE',
    'INVOICE_CANCEL',
    'CANCEL_DOCUMENT',
    'READ_THE_BOX',
    
    'RESET_PRODUCT_INVENTORY',
    'REQUEST_SHOPMAN',
    
    'READ_PROVIDERS',
    'CREATE_PROVIDERS',
    
    'CALCULATE_RELATIVE_DISCOUNT',
    'ABSOLUTE_DISCOUNT',
    
    'PRINT_DOCUMENT',
    'MAIL_DOCUMENT',
    
    'MAKE_RECORD',
    'DEACTIVATE_RECORD',
    'READ_RECORDS',
    
    'GET_SESSION_LIST',
    'SET_SESSION_LIST',
    'GET_CACHE_SESSION_LIST',
    'SEARCH_CACHE_SESSION',
    
    'READ_USERS'
  ]
}