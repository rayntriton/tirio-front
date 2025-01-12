//export type SetterMutable< MUTABLE > = ( fun:( value:MUTABLE ) => MUTABLE ) => MUTABLE

export type SetterMutable< MUTABLE > =
  ( fun:( ( value:MUTABLE ) => MUTABLE ) | MUTABLE ) => MUTABLE //| ( ( value:MUTABLE ) => MUTABLE )