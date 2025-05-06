import { BasicDocument, Customer, PublicItem } from "@/feats/types";

export type CreditDocument = {
  
  agent:Customer
	client:Customer
	coin:string
	debt:number
	items:PublicItem[]
	requester?:Customer
	settlement?:number
	subTotal:number
	taxes:number
	total:number

} & BasicDocument