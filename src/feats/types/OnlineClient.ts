import { Shopman } from "./Shopman"

export interface OnlineClient {

	clientReference:number
	ipAddress:string
	requestNumber:number
	shopman:Shopman
	logged:boolean
	locked:boolean
	token:string
	sessionId:string
	locale:string
	shortId:string

}
