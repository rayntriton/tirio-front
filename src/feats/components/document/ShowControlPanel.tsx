import { DOCUMENT_LOG_TYPE, SuperDocument } from "@/feats/types";

export function ShowControlPanel( props:{ document:SuperDocument } ){
  const logTypes = props.document.logs.map( log => log.logType )
  const showIssueSample = logTypes.some( logType => logType == DOCUMENT_LOG_TYPE.ISSUE_SAMPLE )
  const showIssueOrder = logTypes.some( logType => logType == DOCUMENT_LOG_TYPE.ISSUE_ORDER )
  const showIssueInvoice = logTypes.some( logType => logType == DOCUMENT_LOG_TYPE.ISSUE_SAMPLE )
  return (

  )
}