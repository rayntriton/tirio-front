import { BACKEND_ENTRY } from "@/feats/settings";
import { fetcher } from "./fetcher"

export async function post( body:any ){
  return fetcher( BACKEND_ENTRY, 'POST', body );
}