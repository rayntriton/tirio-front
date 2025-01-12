
type tsdfsf6 = any extends unknown ? true : false   //true
type tsdfsf5 = unknown extends any ? true : false   // true
type tsdfsf1 = never extends unknown ? true : false // true
type tsdfsf0 = unknown extends never ? true : false // false
type tsdfsf2 = never extends any ? true : false     // true
type tsdfsf3 = any extends never ? true : false      //boolean
type tsdfsf4 = number extends any ? true : false     //true
type tsdfsf7 = unknown extends undefined ? true : false //false
type tsdfsf8 = unknown extends null ? true : false //false
type tsdfsf9 = never extends undefined ? true : false //true
type tsdfs10 = undefined extends never ? true : false //false
type tsdfs11 = undefined extends unknown ? true : false //true
type tsdfs12 = undefined extends null ? true : false //false

type tsdfs13 = never extends never ? true : false //true
type tsdfs14 = never extends string ? true : false //true
type tsdfs15 = string extends never ? true : false //false
