type IsExactFunctionBack<T, U> = 
  T extends (...args: infer A1) => infer R1
    ? U extends (...args: infer A2) => infer R2
      ? [A1] extends [A2] // Comparación exacta de parámetros
        ? [A2] extends [A1] // Asegura bidireccionalidad en parámetros
          ? R1 extends R2 // Comparación exacta de retornos
            ? R2 extends R1 // Asegura bidireccionalidad en retornos
              ? true
              : false
            : false
          : false
        : false
      : false
    : false;
type IsExactFunction<T, U> = 
  T extends (...args: infer A1) => infer R1
    ? U extends (...args: infer A2) => infer R2
      ? [A1] extends [A2] // Comparación exacta de parámetros
        ? [A2] extends [A1] // Asegura bidireccionalidad en parámetros
          ? ReturnType<T> extends ReturnType<U> // Comparación exacta de retornos
            ? ReturnType<U> extends ReturnType<T> // Asegura bidireccionalidad en retornos
              ? true
              : 'not R2 = R1'
            : 'not R1 = R2'
          : 'not a2 = a1'
        : 'not a1 = a2'
      : 'not f2'
    : 'not f1';

// Tipo auxiliar para verificar si es función
type IsFunction< T > = T extends Function ? true : false

export type FUN<V> = ( ( ...args:any[] ) => void )
export type GET<V> = ( () => V )
export type SET<V> = ( ( ...args:any[] ) => Promise< V > )

export type Accessor<T> = () => T;
export type Setter<in out T> = {
  <U extends T>(
    ...args: undefined extends T ? [] : [value: Exclude<U, Function> | ((prev: T) => U)]
  ): undefined extends T ? undefined : Promise< U >;
  <U extends T>(value: (prev: T) => U): Promise< U >;
  <U extends T>(value: Exclude<U, Function>): Promise< U >;
  <U extends T>(value: Exclude<U, Function> | ((prev: T) => U)): Promise< U >;
};

// Tipo para crear el objeto resultante
export type EventFunction_V1<
    Keys extends string[],
    Args extends any[],
    Acc extends Record<string, any> = {},
    LastType = null,
    LastArg = null,
  > =
    Keys extends []
      ? Acc
      : Keys extends [ infer First extends string, ...infer Rest extends string[] ]
        ? Args extends [ infer FirstArg, ... infer RestArgs ]
          ? EventFunction<
              Rest extends string[] ? Rest : [],
              IsExactFunction<LastType, Accessor< LastArg > > extends true ? Args : RestArgs,
              Acc & { [K in First]: IsExactFunction<LastType, Accessor< LastArg > > extends true
                ? Setter< LastArg >
                : FirstArg extends ( ...args:any[] ) => any
                  ? ( ...args:Parameters< FirstArg > ) => Promise<ReturnType< FirstArg > > 
                  : Accessor< FirstArg > },
              IsExactFunction<LastType, Accessor< LastArg > > extends true
                ? Setter< FirstArg >
                : FirstArg extends ( ...args:any[] ) => any
                  ? ( ...args:Parameters< FirstArg > ) => Promise<ReturnType< FirstArg > >
                  : Accessor< FirstArg >,
              FirstArg
            >
          : EventFunction<
              Rest extends string[] ? Rest : never,
              [],
              Acc & { [K in First]: IsExactFunction<LastType, Accessor< LastArg > > extends true
                ? Setter< LastArg >
                : never }
            >
        : Acc
//
export type EventFunction<
    Keys extends string[],
    Args extends any[],
    Acc extends Record<string, any> = {},
    LastType = null,
    LastArg = null,
  > =
    Keys extends []
      ? Acc
      : Keys extends [ infer First extends string, ...infer Rest extends string[] ]
        ? Args extends [ infer FirstArg, ... infer RestArgs ]
          ? EventFunction<
              Rest extends string[] ? Rest : [],
              IsExactFunction<LastType, Accessor< LastArg > > extends true ? Args : RestArgs,
              Acc & { [K in First]: IsExactFunction<LastType, Accessor< LastArg > > extends true
                ? Setter< LastArg >
                : IsFunction<FirstArg> extends true
                  ? FirstArg 
                  : Accessor< FirstArg > },
              IsExactFunction<LastType, Accessor< LastArg > > extends true
                ? Setter< FirstArg >
                : IsFunction<FirstArg> extends true
                  ? ( ...args:Parameters< FirstArg & ( ( args:any[] ) => any ) > ) => Promise<ReturnType< FirstArg & ( ( args:any[] ) => any ) > >
                  : Accessor< FirstArg >,
              FirstArg
            >
          : EventFunction<
              Rest extends string[] ? Rest : never,
              [],
              Acc & { [K in First]: IsExactFunction<LastType, Accessor< LastArg > > extends true
                ? Setter< LastArg >
                : never }
            >
        : Acc

export type TransformToEventFunction<
  Args extends [ ...any ],
  Keys extends string[] = ExtractOfType< Args, string >,
  Values extends any[]  = ExtractConstArrays< Args > ,
  > = 
  EventFunction< Keys, Values >
//
export type ExtractOfType<
    T extends any[],
    Type
   > = 
  T extends [ infer First, ...infer Rest ]
    ? First extends Type
      ? [ First, ... ExtractOfType< Rest, Type > ] // Si es Type, lo incluimos
      : ExtractOfType<Rest, Type > // Si no es Type, lo ignoramos
    : []; // Caso base: no hay más elementos
export type ExtractConstArrays<
    T extends any[]
   > = CreateMutable<
  T extends [ infer First, ...infer Rest ]
    ? First extends readonly [ infer A ]
      ? [ UncoverType<[A]>, ... ExtractConstArrays< Rest > ] // Si es Type, lo incluimos
      : ExtractConstArrays<Rest>
    : []  // Caso base: no hay más elementos
>
const valid2 = createObject( [ "a","b",[1], "c", [()=>{}], "d", [()=>{}] ] as const )
type GetPrimitive< P > = P extends boolean|number|string
  ? P extends string ? string
    : P extends number ? number
    : P extends boolean ? boolean
    : P
  : P

type UncoverType<U> = U extends readonly [ infer A ]
  ? IsUnion< A > extends true
    ? A
    :GetPrimitive< A >
  : never
//

type PrimitiveType<T> =
  T extends string ? string :
  T extends number ? number :
  T extends boolean ? boolean :
  T;
//
type GeneralizePrimitives<T> =
  [T] extends [string | number | boolean]
    ? [string | number | boolean] extends [T]
      ? T extends string
        ? string
        : T extends number
          ? number
          : T extends boolean
            ? boolean
            : T
      : T
    : T;
//

type PrimitiveNumber<T> =
  T extends number
    ? number extends T
      ? number
      : T
    : never
type PrimitiveBoolean<T> =
  T extends boolean
    ? boolean extends T
      ? boolean
      : T
    : never
//
type PrimitiveMix<T> =
  T extends boolean | number | string
    ? IsUnion< T > extends true
      ? T
      : string
    : never
//

type ConstArrayToPrimitiveArray< T extends any[] > =
  T extends readonly [ infer First, ...infer Rest ]
    ? [ ExtractPrimitiveFromConst< First >, ... ConstArrayToPrimitiveArray< Rest > ]
    : []
//
type PrimitiveString<T> =
T extends string
  ? IsUnion< T > extends true
    ? T
    : string
  : never
//
type ExtractPrimitiveFromConst< Const > =
  PrimitiveString< Const > extends never
    ? never
    : PrimitiveString< Const >


function constToPrimitive<T extends any[] >( t:T ):ConstArrayToPrimitiveArray<T>{ return {} as any }
const constToPrimitive1 = constToPrimitive( [ "a" as "a"|"b" ] as const )
const constToPrimitive2 = constToPrimitive( [ "a", "b" as "a"|"b" ] as const )
function getPrimitiveString<T>( a:T ):PrimitiveString<T>{ return "" as any }
function getPrimitiveNumber<T>( a:T ):PrimitiveNumber<T>{ return "" as any }
function getPrimitiveMix<T>( a:T ):PrimitiveMix<T>{ return "" as any }
const primi = getPrimitiveString( "a" as  "a"| "d" )
const primi2 = getPrimitiveString( "a"  )
const primi3 = getPrimitiveString( 1 )
const primi4 = getPrimitiveNumber( 1 )
const primi05 = getPrimitiveNumber( 1 as 1 | 2 )
const primi06 = getPrimitiveMix( 1 )
const primi07 = getPrimitiveMix( 1 as 1 | '2'  )


type generalizePrimitives5 = "s" extends "t"|'s' ? true : false      //true
type generalizePrimitives0 = "t"| "s" extends "s" ? true : false      //true
type generalizePrimitives6 = [ "t" ] extends [ string ] ? true : false      //true
type generalizePrimitives3 = string extends "t"|'s' ? true : false        //false
type generalizePrimitives4 = string extends "t" ? true : false        //false
type generalizePrimitives7 = "t"| 1 extends boolean|number|string ? true : false      //true

type IsUnion<T> = [T] extends [UnionToIntersection<T>] ? false : true
type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends ((k: infer I) => void) ? I : never

type CreateMutable<Type> = {
  -readonly [Property in keyof Type]: Type[Property];
};
type mutable = CreateMutable< readonly [ "a" ] >
export type AllowReadonly<T extends any[]> = T | readonly T[number][]
export type Writable<T> = { -readonly [P in keyof T]: T[P] };


function createObject<
    Args extends [ ...any ]  >
  ( args:Args ):TransformToEventFunction< Args >{
    //:EventFunction< ExtractOtfType< Args, string >, Flatten< ExtractOtfType< Args, any[] > > >{
  return {} as TransformToEventFunction< Args >
}

export type Registry< Value extends any> =
  Value extends Function
    ? string
    : [ string, string ]

function registry< Value >( value:Value ):Registry< Value >{
  if( value instanceof Function ) return "" as Registry< Value >
  else return [ "", "" ] as Registry< Value >
}

const ref = registry( () => {} )