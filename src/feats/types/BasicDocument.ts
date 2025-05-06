import { DocumentLog, RelatedDocument, Shopman } from "@/feats/types";

export interface BasicDocument{

  reference:string
  serial:string
  shopman:Shopman
  creationTime:string
  updatedTime:string
  logs:DocumentLog[]
  documentType:DocumentType
  relatedDocuments:RelatedDocument[]

}