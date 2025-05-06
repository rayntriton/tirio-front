import { preflightFetcher } from "./fetcher";
import { SETTINGS } from "@/feats/settings";

export async function preflight(){
  return preflightFetcher( SETTINGS.BACKEND_ENTRY,'OPTIONS' )
}