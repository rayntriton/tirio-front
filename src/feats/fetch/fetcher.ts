import { jsonToFormUrlEncoded } from "./utils/jsonToFormUrlEncoded";

export const fetcher = async function( url:string, method:Method, body?:any ){
  const rawResponse = fetch( url, {
    method: method,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: body ? jsonToFormUrlEncoded( body ) : undefined,
    //credentials: 'include'
  });
    return rawResponse;
}

export const preflightFetcher = async function( url:string, method:Method, body?:any ){
  const rawResponse = fetch( url, {
    method: method,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: body ? jsonToFormUrlEncoded( body ) : undefined,
    //credentials: 'include'
  });
    return rawResponse;
}

type Method = 'POST' | 'GET' | 'OPTIONS'