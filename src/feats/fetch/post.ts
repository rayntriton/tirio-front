import { SETTINGS } from "@/feats/settings";
import { fetcher } from "./fetcher"
import { getAuthState } from "@/feats/authentication";
import { getGlobalState } from "@/feats/globalState";

export async function post( body:any ){
  const clientReference = getAuthState().clientReference()
  const token = getAuthState().token()
  return getGlobalState().setRequestNumber( requestNumber => requestNumber + 1 )
    .then( requestNumber => {
      return fetcher( SETTINGS.BACKEND_ENTRY, 'POST', {
        ...body,
        clientReference,
        token,
        requestNumber
      } )
    } )
}