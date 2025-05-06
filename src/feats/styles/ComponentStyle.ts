export class ComponentStyle{
  #color = ""
  #spacing = ""
  #shape = ""
  constructor( color:string, spacing = '', shape = '' ){
    this.#color = color
    this.#spacing = spacing
    this.#shape = shape
  }
  getStyle( aditionals = '' ){
    return `${ this.#color } ${ this.#spacing } ${ this.#shape } ${ aditionals }`
  }
  newColor( color:string ){
    return new ComponentStyle( color, this.#spacing, this.#shape ) 
  }
  newSpacing( spacing:string ){
    return new ComponentStyle( this.#color, spacing, this.#shape ) 
  }
  newShape( shape:string ){
    return new ComponentStyle( this.#color, this.#spacing, shape ) 
  }
}

export const createtStyle = ( body:() => ComponentStyle ) => body()
