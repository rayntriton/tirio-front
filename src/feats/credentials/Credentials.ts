export class Credentials{

  #user?:string
  #password?:string
  #token?:string
  #sessionId?:number

  constructor( user?:string, password?:string ){
    this.#user = user;
    this.#password = password;
  }

  get user(){
    return this.#user!
  }

  set user( user:string ){
    this.#user = user
  }

  get password(){
    return this.#password!
  }

  set password( password:string ){
    this.#password = password
  }

  get token(){
    return this.#token!
  }

  set token( token:string ){
    this.#token = token
  }

  get sessionId(){
    return this.#sessionId!
  }

  set sessionId( sessionId:number ){
    this.#sessionId = sessionId
  }
}

let credentials = new Credentials();

export function setCredentials(
  user:string,
  password:string,
  token:string,
  sessionId:number ){
    credentials.user = user
    credentials.password = password
    credentials.token = token
    credentials.sessionId = sessionId
}

export function getUser(){
  return credentials.user
}

export function setUser( user:string ){
  credentials.user = user
  return credentials
}

export function getPassword(){
  return credentials.password
}

export function setEncodedPassword( encodedPassword:string ){
  credentials.password = encodedPassword
  return credentials
}

export function getToken(){
  return credentials.token
}

export function setToken( token:string ){
  credentials.token = token
  return credentials
}

export function getSessionId(){
  return credentials.sessionId
}

export function setSessionId( sessionId:number ){
  credentials.sessionId = sessionId
  return credentials
}
