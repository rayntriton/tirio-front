export class ComponentStyle{
  color = ""
  spacing = ""
  shape = ""
  constructor( color:string, spacing = '', shape = '' ){
    this.color = color
    this.spacing = spacing
    this.shape = shape
  }
  getStyle( aditionals = '' ){
    return `${ this.color } ${ this.spacing } ${ this.shape } ${ aditionals }`
  }
}

export const createtStyle = ( body:() => ComponentStyle ) => body()
