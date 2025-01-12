export interface CommandResponse< CONTENT, ERROR > {
  success:boolean
  content:CONTENT
  error:ERROR
}