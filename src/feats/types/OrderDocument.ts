import { BasicDocument, Customer, PublicItem } from "@/feats/types";

export type OrderDocument = {
  
  agent:Customer
	client:Customer
	coin:string
	items:PublicItem[]
	requester?:Customer
	subTotal:number
	taxes:number
	total:number

} & BasicDocument