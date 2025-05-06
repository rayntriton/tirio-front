import {
  BasicDocument,
  CreditDocument,
  InvoiceDocument,
  OrderDocument,
  RaincheckDocument,
  SampleDocument } from "@/feats/types";

export type SuperDocument =
  & BasicDocument
  & SampleDocument
  & OrderDocument
  & CreditDocument
  & InvoiceDocument
  & RaincheckDocument