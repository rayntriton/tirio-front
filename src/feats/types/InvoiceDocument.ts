import { BasicDocument, Customer, PublicItem } from "@/feats/types";

export type InvoiceDocument = {
  
  agent:Customer
	client:Customer
	coin:string
	electronicVersion:string
	items:PublicItem[]
	requester?:Customer
	subTotal:number
	taxes:number
	total:number

} & BasicDocument