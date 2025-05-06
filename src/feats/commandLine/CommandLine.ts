import { InputEventDOMInput } from "@/feats/types"
import { isNumber } from "@/utils/math"
import { DOMElement } from "solid-js/jsx-runtime"

export class CommandLine {
  value = ''
  rawValue = ''
  command?:string
  kind?:string
  args?:string[]
  pargs?:string[]
  argssize?:number
  allowFetching = false
  quantity?:number
  printCopies?:number
  globalData?:{ periodicity: string, months: string, year: string }
  relatedDocSerial?:string
  relatedDocReference?:string
  documentReference?:string
  sessionId?:string
  shortId?:string
  patterns?:string
  recipients?:string
  message?:string
  fixNumber?:any
  itemNumber?:number
  isDynamicCatalogMode = false
  event:any

  constructor( input: any, currentValue:string ) {
    this.event = input
    const oldValue = currentValue.trim()//
    this.rawValue = input.explicitOriginalTarget.value
    let newValue = this.rawValue.trim()
    this.value = newValue
    console.log( 'CommandLine: oldValue', oldValue, 'newValue', newValue )
    if( oldValue != newValue ) this.allowFetching = true
    // let splited = this.value.split(" ")
    // this.command = splited[ 0 ]
    this.args = []
    this.pargs = []
    this.argssize = 0
    if (this.value == "") {
      this.allowFetching = false
      return
    }
    this.command = this.value.split( /\s+/ )[ 0 ]
    this.args = this.value.split( /\s+/ ).splice( 1 )
    this.argssize = this.args.length

    if ( isNumber( this.command )) {
      this.kind = "product"
      this.quantity = Number.parseFloat( this.command )
      if (this.argssize > 0) {
        if( oldValue != newValue ) this.allowFetching = true
        else this.allowFetching = false
        this.kind = "product"
        this.isDynamicCatalogMode = true
      }
      else {
        this.allowFetching = false
        this.kind = "undefined"
      }
    }
    else if ( this.command == "c" ) {
      if ( this.argssize > 0 ){
        if( oldValue != newValue ) this.allowFetching = true
        else this.allowFetching = false
        this.kind = "client"
        this.isDynamicCatalogMode = true
      }
      else this.kind = 'undefined'
    }
    else if ( this.command == "c" ) {
      if ( this.argssize > 0 ){
        if( oldValue != newValue ) this.allowFetching = true
        else this.allowFetching = false
        this.kind = "client"
        this.isDynamicCatalogMode = true
      }
      else this.kind = 'undefined'
    }
    else if ( this.command == "%u" ) {
      if ( this.argssize > 0 ){
        if( oldValue != newValue ) this.allowFetching = true
        else this.allowFetching = false
        this.kind = "searchusers"
        this.isDynamicCatalogMode = true
      }
      else this.kind = 'undefined'
    }
    else if ( this.command == "%adduser" ) {
      this.kind = 'adduser'
    }
    else if (this.command == "a") {
      this.kind = "agent"
      this.isDynamicCatalogMode = true
    }
    else if (this.command == "ha") {
      this.kind = "agentstatus"
    }
    else if (this.command == "hc") {
      this.kind = "clientstatus"
    }
    else if ( this.command == "%doc" ) {
      if ( this.argssize == 1 ){
        this.kind = "operatedocument"
      }
      else this.kind = 'undefined'
    }
    else if (this.command == "$facturarinseguramente") {
      if ( this.args[ 0 ] ) {
        if ( isNumber(this.args[0]) && Number.parseInt( this.args[ 0 ] ) >= 0) {
          this.printCopies = Number.parseInt( this.args[ 0 ] )
        }
      }
      this.kind = "emitinvoiceticketunsafely"
    }
    else if ( this.command == "$global" ) {
      if ( this.args.length != 4 ) this.kind = "undefinedcommand"
      else if ( isNumber(this.args[0]) && Number.parseInt( this.args[ 0 ] ) >= 0) {
        this.printCopies = Number.parseInt( this.args[ 0 ] )
        this.globalData = {
          periodicity: this.args[ 1 ],
          months: this.args[ 2 ],
          year: this.args[ 3 ],
        }
        this.kind = "emitglobalinvoice"
      }
      else this.kind = "undefinedcommand"
    }
    else if (this.command == "@d") {
      if( this.args.length == 0 || ! isNumber( this.args[ 0 ] ) )
        this.kind = "undefinedcommand"
      else this.kind = "discount"
    }
    else if (this.command == "@ad") {
      if( this.args.length == 0 || ! isNumber( this.args[ 0 ] ) )
        this.kind = "undefinedcommand"
      else this.kind = "absolutediscount"
    }
    else if (this.command == "@p") {
      this.kind = "appendproduct"
    }
    else {
      if (
        this.command.indexOf("@") == 0 ||
        this.command.indexOf("%") == 0 ||
        this.command.indexOf("+") == 0 ||
        this.command.indexOf("$") == 0
      ) {
        return
      }
      console.log("matches!")
      if( oldValue != newValue ) this.allowFetching = true
      else this.allowFetching = false
      this.quantity = 1
      this.kind = "retrieve"
      this.args = this.value.trim().split( /\s+/ )
      this.argssize = this.args.length
      this.isDynamicCatalogMode = true
    }
    /*
    else if (this.command == "$tglobal") {
      if (this.args.length != 4) this.kind = "undefinedcommand"
      else if (isNumber(this.args[0]) && this.args[0] * 1 >= 0) {
        this.printCopies = this.args[0]
        this.globalData = {
          periodicity: this.args[1],
          months: this.args[2],
          year: this.args[3],
        }
        this.kind = "emitglobalinvoiceticket"
      } else this.kind = "undefinedcommand"
    } else if (this.command == "$tfc" || this.command == "$efc") {
      if (this.args.length >= 1) {
        this.relatedDocSerial = this.args[0].split("-")[0]
        this.relatedDocReference = this.args[0].split("-")[1]
      }
      if (this.args[1]) {
        if (isNumber(this.args[1]) && this.args[1] * 1 >= 0) {
          this.printCopies = this.args[1]
          this.kind = "emitinvoiceticketbyorder"
          if (this.command == "$efc") this.printCopies = 0
        } else this.kind = "undefinedcommand"
      } else {
        this.printCopies = -1
        this.kind = "emitinvoiceticketbyorder"
      }
    } else if (this.command == "$credito") {
      if (this.args.length >= 1) {
        this.relatedDocSerial = this.args[0].split("-")[0].toUpperCase()
        this.relatedDocReference = this.args[0].split("-")[1].toUpperCase()
      }
      if (this.args[1]) {
        if (isNumber(this.args[1]) && this.args[1] * 1 >= 0) {
          this.printCopies = this.args[1]
          this.kind = "emitcredit"
        } else this.kind = "undefinedcommand"
      } else {
        this.printCopies = -1
        this.kind = "emitcredit"
      }
    } else if (this.command == "$oc") {
      if (this.args[0]) {
        if (isNumber(this.args[0]) && this.args[0] * 1 >= 0) {
          this.printCopies = this.args[0]
          this.kind = "emitorder"
        } else this.kind = "undefinedcommand"
      } else {
        this.printCopies = -1
        this.kind = "emitorder"
      }
    } else if (this.command == "$toc") {
      if (this.args[0]) {
        if (isNumber(this.args[0]) && this.args[0] * 1 >= 0) {
          this.printCopies = this.args[0]
          this.kind = "emitorderticket"
        } else this.kind = "undefinedcommand"
      } else {
        this.printCopies = -1
        this.kind = "emitorderticket"
      }
    } else if (this.command == "@ecot" || this.command == "@pcot") {
      if (this.args[0]) {
        if (isNumber(this.args[0]) && this.args[0] * 1 >= 0) {
          this.printCopies = this.args[0]
          this.kind = "emitsample"
          if (this.command == "@ecot") this.printCopies = 0
        } else this.kind = "undefinedcommand"
      } else {
        this.printCopies = -1
        if (this.command == "@ecot") this.printCopies = 0
        this.kind = "emitsample"
      }
    } else if (this.command == "@tpcot") {
      if (this.args[0]) {
        if (isNumber(this.args[0]) && this.args[0] * 1 >= 0) {
          this.printCopies = this.args[0]
          this.kind = "emitsampleticket"
        } else this.kind = "undefinedcommand"
      } else {
        this.printCopies = -1
        this.kind = "emitsampleticket"
      }
    } else if (this.command == "@print") {
      if (this.args[0]) {
        if (isNumber(this.args[1]) && this.args[1] * 1 >= 0) {
          this.printCopies = this.args[1]
          this.documentReference = this.args[0]
          this.kind = "print"
        } else this.kind = "undefinedcommand"
      } else {
        this.kind = "undefinedcommand"
      }
    } else if (this.command == "@tprint") {
      if (this.args[0]) {
        if (isNumber(this.args[1]) && this.args[1] * 1 >= 0) {
          this.printCopies = this.args[1]
          this.documentReference = this.args[0]
          this.kind = "tprint"
        } else this.kind = "undefinedcommand"
      } else {
        this.kind = "undefinedcommand"
      }
    } else if (this.command == "@l") {
      if (this.args[0]) {
        this.sessionId = this.args[0]
        this.kind = "getsessionlist"
      } else {
        this.kind = "undefinedcommand"
      }
    } else if (this.command == "@lc") {
      if (this.args[0]) {
        this.shortId = this.args[0]
        this.kind = "getcachesessionlist"
      } else {
        this.kind = "undefinedcommand"
      }
    } else if (this.command == "@lcs") {
      if (this.args[0]) {
        this.patterns = this.args.join(" ")
        this.kind = "searchcachesession"
      } else {
        this.kind = "undefinedcommand"
      }
    } else if (this.command == "@mail") {
      if (this.args[0]) {
        if (isNumber(this.args[0])) {
          this.documentReference = this.args[0]
          this.kind = "mail"
          this.recipients = ""
          for (var i = 1 i < this.args.length i++) {
            this.recipients +=
              this.args[i] + (i == this.args.length - 1 ? "" : " ")
          }
        } else this.kind = "undefinedcommand"
      } else {
        this.kind = "undefinedcommand"
      }
    } else if (this.command == "@h") {
      this.kind = "help"
    } else if (this.command == "@p") {
      $(input).ShowBubblePopup({ innerHtml: "agregar producto" })
      this.kind = "editproduct"
    } else if (this.command == "@c") {
      $(input).ShowBubblePopup({ innerHtml: "agregar cliente" })
      this.kind = "editclient"
    } else if (this.command == "@a") {
      $(input).ShowBubblePopup({ innerHtml: "agregar agente" })
      this.kind = "editagent"
    } else if (this.command == "+f") {
      $(input).ShowBubblePopup({
        innerHtml: "facturar documento <b>" + this.args[0] + "</b>",
      })
      this.kind = "facture"
    } else if (this.command == "_inventario") {
      $(input).ShowBubblePopup({
        innerHtml:
          "se inventaríara la lista con los costos<b>" + this.args[0] + "</b>",
      })
      this.kind = "facture"
    } else if (this.command == "@r" || this.command == "@rl") {
      if (this.command == "@r") {
        $(input).ShowBubblePopup({
          innerHtml: "traer documento <b>" + this.args[0] + "</b>",
        })
      } else {
        $(input).ShowBubblePopup({
          innerHtml: "mostrar estatus de documento <b>" + this.args[0] + "</b>",
        })
      }
      this.kind = "getinvoice"
    } else if (this.command == "%rc") {
      if (this.args.length > 0) {
        this.kind = "makerecord"
        this.message = this.args.join(" ")
      } else this.kind = "undefined"
    } else if (this.command == "%rr") {
      $(input).ShowBubblePopup({
        innerHtml:
          "<enter> mostrar recordatorios. <espacio> n mostrar ultimos n recordatorios",
      })
      this.kind = "returnrecords"
    } else if (this.command == "%rb") {
      $(input).ShowBubblePopup({ innerHtml: "marcar recordatorio como hecho" })
      this.kind = "deactivaterecord"
    } else if (this.command == "$a" || this.command == "$d") {
      if (this.command == "$a")
        $(input).ShowBubblePopup({
          innerHtml: "liquidar agente para <b>" + this.args[0] + "</b>",
        })
      else if (this.command == "$d") {
        if (this.args[1]) {
          if (isNumber(this.args[1]))
            $(input).ShowBubblePopup({
              innerHtml:
                "abonar a documento <b>" +
                this.args[0] +
                " $" +
                this.args[1] +
                "</b>",
            })
          else
            $(input).ShowBubblePopup({ innerHtml: "ERROR: cantidad invalida" })
        } else if (this.args[0]) {
          $(input).ShowBubblePopup({
            innerHtml: "liquidar documento <b>" + this.args[0] + "</b>",
          })
        } else
          $(input).ShowBubblePopup({ innerHtml: "liquidar/abonar documento" })
      }
      this.kind = "invoicepayment"
    }
    //TODO implement justprint
    else if (this.command == "@unimplemented") {
      this.kind = "justprint"
    } else if (this.command == "$ag") {
      this.kind = "incrementagentearning"
    } else if (this.command == "@d") {
      this.kind = "discount"
    } else if (this.command == "@cd") {
      if (this.args[0]) {
        if (isNumber(this.args[0])) {
          this.documentReference = this.args[0]
          this.kind = "canceldocument"
        } else this.kind = "undefinedcommand"
      } else {
        this.kind = "undefinedcommand"
      }
    } else if (this.command == "@s") {
      this.kind = "searchinvoices"
    } else if (this.command == "@actualizap") {
      this.kind = "updateproducts"
    } else if (this.command == "@pruebap") {
      this.kind = "testproducts"
    } else if (this.command == "@j") {
      $(input).ShowBubblePopup({ innerHtml: "consultar caja" })
      this.kind = "consultthebox"
    } else if (this.command == "%ip") {
      $(input).ShowBubblePopup({ innerHtml: "inventarear productos" })
      this.kind = "productinventoryadd"
    } else if (this.command == "%updateproducts") {
      $(input).ShowBubblePopup({ innerHtml: "update products" })
      this.kind = "updateproducts"
    } else if (this.command == "%deleteproducts") {
      $(input).ShowBubblePopup({ innerHtml: "delete products" })
      this.kind = "deleteproducts"
    } else if (this.command == "%adduser") {
      $(input).ShowBubblePopup({ innerHtml: "add user" })
      this.kind = "adduser"
    } else if (this.command == "%updateuser") {
      $(input).ShowBubblePopup({ innerHtml: "update user" })
      this.kind = "updateuser"
    } else if (this.command == "%uc") {
      $(input).ShowBubblePopup({ innerHtml: "update client" })
      this.kind = "updatecustomer"
    } else if (this.command == "@fp") {
      $(input).ShowBubblePopup({ innerHtml: "forma de pago" })
      this.kind = "paymentway"
    } else if (this.command == "@mp") {
      $(input).ShowBubblePopup({ innerHtml: "forma de pago" })
      this.kind = "paymentmethod"
    } else if (this.command == "@tc") {
      $(input).ShowBubblePopup({ innerHtml: "tipo de documento" })
      this.kind = "documenttype"
    } else if (this.command == "@dest") {
      $(input).ShowBubblePopup({ innerHtml: "destino/obra" })
      this.kind = "destiny"
    } else if (this.command == "@uc") {
      $(input).ShowBubblePopup({ innerHtml: "uso de cfdi" })
      this.kind = "cfdiuse"
    } else if (this.command == "@ad") {
      $(input).ShowBubblePopup({ innerHtml: "absolutediscount" })
      this.kind = "absolutediscount"
    } else if (this.command == "@pago") {
      this.kind = "invoicepayment"
    } else if (this.command == "%fixdb") {
      if (this.args[0]) {
        if (isNumber(this.args[0])) {
          this.fixNumber = this.args[0]
          this.kind = "fixdb"
        } else this.kind = "undefinedcommand"
      } else {
        this.kind = "undefinedcommand"
      }
    } else if (
      this.command.indexOf("@") == 0 &&
      isNumber(this.command.replace("@", ""))
    ) {
      this.kind = "edititem"
      this.itemNumber = this.command.replace("@", "") * 1
    } else {
      $(input).HideBubblePopup()
      if (
        this.command.indexOf("@") == 0 ||
        this.command.indexOf("%") == 0 ||
        this.command.indexOf("+") == 0 ||
        this.command.indexOf("$") == 0
      ) {
        console.log("matches")
        return
      }
      console.log("matches!")
      console.log(this)
      this.quantity = 1
      this.kind = "retrieve"
      this.args = this.value.match(/[^\s"']+|"([^"]*)"|'([^']*)'/g)
      this.argssize = this.args.length
      this.getFromDB = true
    }*/
  }
}
