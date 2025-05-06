import { DOCUMENT_LOG_TYPE } from "./DocumentLogType";

export interface DocumentLog {

	logType:DOCUMENT_LOG_TYPE
	content:any
	logger:string
	date:string
	
}