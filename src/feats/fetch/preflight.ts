import { fetcher, preflightFetcher } from "./fetcher";
import { BACKEND_ENTRY } from "@/feats/settings";

export async function preflight(){
  return preflightFetcher( BACKEND_ENTRY,'OPTIONS' )
}