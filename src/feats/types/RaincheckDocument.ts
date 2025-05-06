import { BasicDocument, Customer, PublicItem } from "@/feats/types";

export type RaincheckDocument = {
  
  agent:Customer
	client:Customer
	coin:string
	items:PublicItem[]
	requester?:Customer
	subTotal:number
	taxes:number
	total:number

} & BasicDocument