import { Customer } from "@/feats/types"
import { mobileAndTabletCheck } from "@/utils/core"

export const BACKEND_URL = 'https://192.168.0.25:8443/gfm-nio/'
export const BACKEND_ENTRY = 'https://192.168.0.25:8443/gfm-nio/dbport'

export const DEFAULT_CUSTOMER:Customer = {
  consummer:"PUBLICO GENERAL",
  rfc:"XAXX010101000",
  cp:"58020",
  country:"MEXICO",
  email:"raynmune@gmail.com"
} as Customer

export const PORTABLE = mobileAndTabletCheck()

export const PRODUCTION_ENV = false