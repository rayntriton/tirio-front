import { AuthContext } from "@/feats/authentication"
import { CommandControlContext } from "@/feats/commandLine/CommandControl"
import { GlobalContext } from "@/feats/globalState"
import { queueEvent } from "@/feats/stateSystem"
import { isNumber, parseFloat } from "@/utils/math"

export function handleCommandLine( global:GlobalContext, auth:AuthContext, local:CommandControlContext ){
  console.log("handleCommandLine")
  var commandline = global.commandLine()
  if (commandline.kind == "edititem") {
    if ( commandline.argssize! % 2 != 0 ) {
      alert("los argumentos no son pares")
      return
    }
    const args = commandline.args!
    for( let i = 0; i < commandline.argssize!; i += 2 ) {
      if( ! isNumber( args[ i ] ) ) {
        local.error( "los indices deben ser numéricos: -> " + args[ i ] )
        return
      }
      if ( parseFloat( args[ i ] )  < 0 || parseFloat( args[ i ] ) > 11 ) {
        alert("los indices numéricos deben ser entre 0-11: -> " + args[ i ] )
        return
      }
    }
    var rowIndex = commandline.itemNumber
    for (var i = 0; i < commandline.argssize; i += 2) {
      var row = $(".tableingrow").get(rowIndex)
      if (args[i] == "0") {
        if (args[i + 1] == ".") $($(row).find(".control1")).click()
        else return
      } else if (args[i] == "11") {
        if (args[i + 1] == ".") $($(row).find(".control2")).click()
        else return
      } else {
        $($(row).find("div>div").get(args[i])).html(
          args[i + 1].toUpperCase()
        )
      }
      //$(row).get(args[i]).html(args[i+1].toUpperCase())
    }
    onLogChange()
    commander.reset()
  }
  else if (commandline.kind == "print" || commandline.kind == "tprint") {
    var block1 = $.blockUI({
      content: '<h1><img src="img/wait.gif" /> esperar...</h1>',
    })
    $.ajax({
      url: CONTEXT_PATH + "/dbport",
      type: "POST",
      data: {
        command: commandline.kind,
        reference: commandline.documentReference,
        printCopies: commandline.printCopies,
        token: TOKEN,
        clientReference: CLIENT_REFERENCE,
      },
      success: function (data) {
        $.blockUI({
          node: block1,
          content: "<h1>" + data.successResponse + "</h1>",
          changeContent: true,
          unblockOnAnyKey: true,
        })
        commander.reset()
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(jqXHR)
        $.blockUI({
          node: block1,
          content: jqXHR.responseText,
          changeContent: true,
          unblockOnAnyKey: true,
        })
      },
    })
  } else if (commandline.kind == "mail") {
    var block1 = $.blockUI({
      content: '<h1><img src="img/wait.gif" /> esperar...</h1>',
    })
    $.ajax({
      url: CONTEXT_PATH + "/dbport",
      type: "POST",
      data: {
        command: commandline.kind,
        reference: commandline.documentReference,
        recipients: commandline.recipients,
        token: TOKEN,
        clientReference: CLIENT_REFERENCE,
      },
      success: function (data) {
        $.blockUI({
          node: block1,
          content: "<h1>" + data.successResponse + "</h1>",
          changeContent: true,
          unblockOnAnyKey: true,
        })
        commander.reset()
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(jqXHR)
        $.blockUI({
          node: block1,
          content: jqXHR.responseText,
          changeContent: true,
          unblockOnAnyKey: true,
        })
      },
    })
  } else if (commandline.kind == "absolutediscount") {
    $.ajax({
      url: CONTEXT_PATH + "/dbport",
      type: "POST",
      data: {
        command: commandline.kind,
        absoluteDiscount: commandline.args[0], //$("#absolutediscount").val(),
        token: TOKEN,
        list: $.toJSON(productsLog),
        clientReference: CLIENT_REFERENCE,
      },
      success: function (data) {
        $("#consummerDiscount").val(data.result)
        $("#consummerDiscount").trigger("onchange")
        commander.reset()
        console.log(data.result)
      },
      error: function (jqXHR, textStatus, errorThrown) {
        $.blockUI({
          content:
            textStatus + " - " + errorThrown + " - " + jqXHR.responseText,
          unblockOnAnyKey: true,
        })
      },
    })
  } else if (
    commandline.kind == "editclient"
  ) {
    addCustomerIn(commander)
  } 
  else if ( commandline.kind == "editagent" ) {
    addAgentIn(commander)
   }
  else if (commandline.kind == "invoicepayment") {
    invoicePaymentForm(commander)
  } else if (
    commandline.kind == "editproduct" ||
    commandline.kind == "editagent"
  ) {
    editProduct(commander)
  } else if (
    //commandline.kind == "emitinvoice" ||
    commandline.kind == "emitinvoiceticketunsafely" ||
    //commandline.kind == "emitglobalinvoice" ||
    commandline.kind == "emitglobalinvoiceticket"
  ) {
    if (agent == null || client == null) {
      alert("error: Cliente y/o Agente Indefinido(s).")
      commander.reset()
      return
    }
    var fieldsOk = true
    var fieldsError = ""
    for (var i = 0; i < productsLog.length; i++) {
      if (!productsLog[i].prodservCode.match(/^\d{8}$/)) {
        fieldsOk = false
        fieldsError =
          fieldsError +
          "\n" +
          "wrong prodservCode '" +
          productsLog[i].prodservCode +
          "'"
      }
    }
    if (!fieldsOk) {
      alert("error: " + fieldsError)
      $("#commands").val("")
      return
    }
    if (commandline.args.length >= 0 && productsLog.length > 0) {
      var block1 = $.blockUI({
        content: '<h1><img src="img/wait.gif" /> esperar...</h1>',
      })
      var kind = commandline.kind
      var printCopies = commandline.printCopies
      var globalData = commandline.globalData ? commandline.globalData : null
      var relatedDocSerial = commandline.relatedDocSerial
      var relatedDocReference = commandline.relatedDocReference
      console.log("GLOBAL DATA", globalData)
      commander.reset()
      $.ajax({
        type: "POST",
        url: CONTEXT_PATH + "/dbport",
        data: {
          client: encodeURIComponent($.toJSON(client)),
          list: encodeURIComponent($.toJSON(productsLog)),
          shopman: encodeURIComponent($.toJSON(shopman)),
          metadata: encodeURIComponent($.toJSON(metadata)),
          requester: encodeURIComponent($.toJSON(requester)),
          seller: encodeURIComponent($.toJSON(seller)),
          agent: encodeURIComponent($.toJSON(agent)),
          destiny: encodeURIComponent(
            '{"address" : "' + $("#destiny").val() + '"}'
          ),
          token: TOKEN,
          command: kind,
          clientReference: CLIENT_REFERENCE,
          paymentMethod: $("#paymentMethod").val(),
          paymentWay: $("#paymentWay").val(),
          documentType: $("#documentType").val(),
          cfdiUse: $("#cfdiUse").val(),
          fiscalRegime: client.fiscalRegime,
          coin: $("#coin").val(),
          printCopies: printCopies,
          globalData: globalData
            ? encodeURIComponent($.toJSON(globalData))
            : undefined,
          relatedDocSerial :relatedDocSerial,
          relatedDocReference : relatedDocReference
        },
        success: function (data) {
          console.log( "SUCCESS" )
          console.log( data )
        if( data.success ){
            resetClient()
            var content = data.content
            $.blockUI({
              node: block1,
              content: "<h1>" + content.successResponse + ". (" + content.issues.join( " " ) + ")</h1>",
              changeContent: true,
              unblockOnAnyKey: true,
            })
            invoiceInfoLog(content.invoice)
        }
        else{
          $.blockUI({
                node: block1,
                content: "<h1>" + data.content + "</h1>",
                changeContent: true,
                unblockOnAnyKey: true,
              })
        }
        },
        error: function (jqXHR, textStatus, errorThrown) {
          $.blockUI({
            node: block1,
            content:
              textStatus + " - " + errorThrown + " - " + jqXHR.responseText,
            changeContent: true,
            unblockOnAnyKey: true,
          })
        },
        dataType: "json",
      })
    } else {
      alert("ningun item en lista")
      commander.reset()
    }
  }
  else if ( commandline.kind == "emitinvoiceticketbyorder" ||
      commandline.kind == "emitcredit" ) {
    /*if (agent == null || client == null) {
      alert("error: Cliente y/o Agente Indefinido(s).")
      commander.reset()
      return
    }
    var fieldsOk = true
    var fieldsError = ""
    for (var i = 0; i < productsLog.length; i++) {
      if (!productsLog[i].prodservCode.match(/^\d{8}$/)) {
        fieldsOk = false
        fieldsError =
          fieldsError +
          "\n" +
          "wrong prodservCode '" +
          productsLog[i].prodservCode +
          "'"
      }
    }
    if (!fieldsOk) {
      alert("error: " + fieldsError)
      $("#commands").val("")
      return
    }*/

    var block1 = $.blockUI({
      content: '<h1><img src="img/wait.gif" /> esperar...</h1>',
    })
    var kind = commandline.kind
    var printCopies = commandline.printCopies
    var globalData = commandline.globalData ? commandline.globalData : null
    var relatedDocSerial = commandline.relatedDocSerial
    var relatedDocReference = commandline.relatedDocReference
    console.log("GLOBAL DATA", globalData)
    
    $.ajax({
      type: "POST",
      url: CONTEXT_PATH + "/dbport",
      data: {
        client: encodeURIComponent($.toJSON(client)),
        shopman: encodeURIComponent($.toJSON(shopman)),
        metadata: encodeURIComponent($.toJSON(metadata)),
        requester: encodeURIComponent($.toJSON(requester)),
        seller: encodeURIComponent($.toJSON(seller)),
        agent: encodeURIComponent($.toJSON(agent)),
        destiny: encodeURIComponent(
          '{"address" : "' + $("#destiny").val() + '"}'
        ),
        token: TOKEN,
        command: kind,
        clientReference: CLIENT_REFERENCE,
        paymentMethod: $("#paymentMethod").val(),
        paymentWay: $("#paymentWay").val(),
        documentType: $("#documentType").val(),
        cfdiUse: $("#cfdiUse").val(),
        fiscalRegime: client.fiscalRegime,
        coin: $("#coin").val(),
        printCopies: printCopies,
        relatedDocSerial :relatedDocSerial,
        relatedDocReference : relatedDocReference
      },
      success: function (data) {
        console.log( "SUCCESS" )
        console.log( data )
      if( data.success ){
           resetClient()
           commander.reset()
           var content = data.content
           $.blockUI({
             node: block1,
             content: "<h1>" + content.successResponse + ". (" + content.issues.join( " " ) + ")</h1>",
             changeContent: true,
             unblockOnAnyKey: true,
           })
           invoiceInfoLog(content.invoice)
        }
        else{
          $.blockUI({
               node: block1,
               content: "<h1>" + data.content + "</h1>",
               changeContent: true,
               unblockOnAnyKey: true,
             })
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        $.blockUI({
          node: block1,
          content:
            textStatus + " - " + errorThrown + " - " + jqXHR.responseText,
          changeContent: true,
          unblockOnAnyKey: true,
        })
      },
      dataType: "json",
    })

  }
  else if (
    commandline.kind == "emitorder" ||
    commandline.kind == "emitorderticket" ||
    commandline.kind == "emitsample" ||
    commandline.kind == "emitsampleticket"
  ) {
    var documentType = "ORDER"
    if (
      commandline.kind == "emitsample" ||
      commandline.kind == "emitsampleticket"
    )
      documentType = "SAMPLE"
    if (agent == null || client == null) {
      alert("error: Cliente y/o Agente Indefinido(s).")
      commander.reset()
      return
    }
    var fieldsOk = true
    var fieldsError = ""
    for (var i = 0; i < productsLog.length; i++) {
      if (!productsLog[i].prodservCode.match(/^\d{8}$/)) {
        fieldsOk = false
        fieldsError =
          fieldsError +
          "\n" +
          "wrong prodservCode '" +
          productsLog[i].prodservCode +
          "'"
      }
    }
    if (!fieldsOk) {
      alert("error: " + fieldsError)
      $("#commands").val("")
      return
    }
    if (commandline.args.length >= 0 && productsLog.length > 0) {
      var kind = commandline.kind
      var printCopies = commandline.printCopies
      commander.reset()
      var block1 = $.blockUI({
        content: '<h1><img src="img/wait.gif" /> esperar...</h1>',
      })
      $.ajax({
        type: "POST",
        url: CONTEXT_PATH + "/dbport",
        data: {
          client: encodeURIComponent($.toJSON(client)),
          list: encodeURIComponent($.toJSON(productsLog)),
          shopman: encodeURIComponent($.toJSON(shopman)),
          metadata: encodeURIComponent($.toJSON(metadata)),
          requester: encodeURIComponent($.toJSON(requester)),
          seller: encodeURIComponent($.toJSON(seller)),
          agent: encodeURIComponent($.toJSON(agent)),
          destiny: encodeURIComponent(
            '{"address" : "' + $("#destiny").val() + '"}'
          ),
          token: TOKEN,
          command: kind,
          clientReference: CLIENT_REFERENCE,
          /*paymentMethod: $('#paymentMethod').val(),
              paymentWay: $('#paymentWay').val(),*/
          documentType: documentType,
          //cfdiUse:$('#cfdiUse').val(),
          coin: $("#coin").val(),
          printCopies: printCopies,
        },
        success: function (data) {
          console.log( "SUCCESS" )
          console.log( data )
          
        if( data.success ){
            resetClient()
            
            var content = data.content
            var issues = content.issues ? content.issues.join(" ") : null
            if( lockOnOperation ){
              $.unblockUI( block1 )
              lock( content.successResponse + ( issues ? "( "+ issues + " )" : "" ) )
            }
            else
              $.blockUI({
                node: block1,
                content: "<h1>" + content.successResponse + ( issues ? "( "+ issues + " )" : "" ) + "</h1>",
                changeContent: true,
                unblockOnAnyKey: true,
              })
            invoiceInfoLog(content.invoice)
        }
        else{
          $.blockUI({
                node: block1,
                content: "<h1>" + data.content + "</h1>",
                changeContent: true,
                unblockOnAnyKey: true,
              })
        }
        },
        error: function (jqXHR, textStatus, errorThrown) {
          $.blockUI({
            node: block1,
            content:
              textStatus + " - " + errorThrown + " - " + jqXHR.responseText,
            changeContent: true,
            unblockOnAnyKey: true,
          })
        },
        dataType: "json",
      })
    } else {
      alert("ningun item en lista")
      commander.reset()
    }
  } else if (commandline.kind == "consultthebox") {
    commander.reset()
    $.ajax({
      url: "consultthebox",
      data: {
        command: "consultthebox",
        token: TOKEN,
        clientReference: CLIENT_REFERENCE,
      },
      type: "POST",
      success: function (data) {
        $.blockUI({
          content: "$" + data.cash + "en caja en toda el día",
          unblockOnAnyKey: true,
        })
      },
      error: function (jqXHR, textStatus, errorThrown) {
        $.blockUI({
          content:
            textStatus + " - " + errorThrown + " - " + jqXHR.responseText,
          unblockOnAnyKey: true,
        })
      },
    })
  } else if (commandline.kind == "canceldocument") {
    if (commandline.args.length >= 1) {
      if (!confirm("cancelar documento " + commandline.args[0] + " ? "))
        return
      var block2 = $.blockUI({
        content: '<h1><img src="img/wait.gif" /> cancelando...</h1>',
      })
      $.ajax({
        url: CONTEXT_PATH + "/dbport",
        data: {
          command: commandline.kind,
          reference: commandline.documentReference,
          token: TOKEN,
          clientReference: CLIENT_REFERENCE,
        },
        success: function (data) {
          commander.reset()
          $.blockUI({
            node: block2,
            content: "<h1>" + data.message + "</h1>",
            changeContent: true,
            unblockOnAnyKey: true,
          })
        },
        error: function (jqXHR, textStatus, errorThrown) {
          commander.reset()
          $.blockUI({
            node: block2,
            content:
              textStatus + " - " + errorThrown + " - " + jqXHR.responseText,
            changeContent: true,
            unblockOnAnyKey: true,
          })
        },
        dataType: "json",
        type: "POST",
      })
    }
  } else if (commandline.kind == "discount") {
    $("#consummerDiscount").val(parseFloat(commandline.args[0]))
    commander.reset()
    applyDiscount()
  } else if (commandline.kind == "getinvoice") {
    if (commandline.args.length >= 1) {
      var block3 = $.blockUI({
        content: '<h1><img src="img/wait.gif" /></h1>',
      })
      $.ajax({
        url: "getinvoice",
        type: "POST",
        data: {
          command: commandline.command,
          reference: commandline.args.join(" "),
          token: TOKEN,
          clientReference: CLIENT_REFERENCE,
        },
        success: function (data) {
          $.unblockUI(block3)
          if (commandline.command == "@r") {
            var itms = data.items
            for (var i = itms.length - 1; i >= 0; i--) {
              dolog(
                parseFloat(itms[i].quantity),
                itms[i].unit,
                itms[i].description,
                itms[i].code,
                itms[i].mark,
                parseFloat(itms[i].unitPrice),
                itms[i].prodservCode,
                itms[i].unitCode
              )
              itms[i].quantity = parseFloat(itms[i].quantity)
              itms[i].unitPrice = parseFloat(itms[i].unitPrice)
              productsLog.unshift(itms[i])
              productsLog[0].disabled = itms[i].disabled
              if (itms[i].id == -1) {
                $("#log").sexytable({
                  editedRow: true,
                  index: 0,
                })
              }
              if (itms[i].disabled) {
                $("#log").sexytable({
                  disabledRow: true,
                  index: 0,
                })
              }
            }
            onLogChange()
            commander.reset()
          }
          if (commandline.command == "@rl") {
            invoiceInfoLog(data.invoice)
            commander.reset()
          }
        },
        error: function (jqXHR, textStatus, errorThrown) {
          commander.reset()
          $.blockUI({
            node: block3,
            content: jqXHR.responseText,
            changeContent: true,
            unblockOnAnyKey: true,
          })
        },
        dataType: "json",
      })
    }
  } else if (commandline.kind == "getsessionlist") {
    if (commandline.args.length >= 1) {
      var block3 = $.blockUI({
        content: '<h1><img src="img/wait.gif" /></h1>',
      })
      $.ajax({
        url: CONTEXT_PATH + "/dbport",
        type: "POST",
        data: {
          command: commandline.kind,
          sessionId: commandline.sessionId,
          token: TOKEN,
          clientReference: CLIENT_REFERENCE,
        },
        success: function (data) {
          $.unblockUI(block3)
          var itms = data.list
          for (var i = itms.length - 1; i >= 0; i--) {
            dolog(
              parseFloat(itms[i].quantity),
              itms[i].unit,
              itms[i].description,
              itms[i].code,
              itms[i].mark,
              parseFloat(itms[i].unitPrice),
              itms[i].prodservCode,
              itms[i].unitCode
            )
            itms[i].quantity = parseFloat(itms[i].quantity)
            itms[i].unitPrice = parseFloat(itms[i].unitPrice)
            productsLog.unshift(itms[i])
            productsLog[0].disabled = itms[i].disabled
            if (itms[i].id == -1) {
              $("#log").sexytable({
                editedRow: true,
                index: 0,
              })
            }
            if (itms[i].disabled) {
              $("#log").sexytable({
                disabledRow: true,
                index: 0,
              })
            }
          }
          onLogChange()
          commander.reset()
        },
        error: function (jqXHR, textStatus, errorThrown) {
          commander.reset()
          $.blockUI({
            node: block3,
            content: jqXHR.responseText,
            changeContent: true,
            unblockOnAnyKey: true,
          })
        },
        dataType: "json",
      })
    }
  } else if (commandline.kind == "getcachesessionlist") {
    if (commandline.args.length >= 1) {
      var block3 = $.blockUI({
        content: '<h1><img src="img/wait.gif" /></h1>',
      })
      $.ajax({
        url: CONTEXT_PATH + "/dbport",
        type: "POST",
        data: {
          command: commandline.kind,
          shortId: commandline.shortId.toUpperCase(),
          token: TOKEN,
          clientReference: CLIENT_REFERENCE,
        },
        success: function (data) {
          $.unblockUI(block3)
          var itms = data.response.items
          for (var i = itms.length - 1; i >= 0; i--) {
            dolog(
              parseFloat(itms[i].quantity),
              itms[i].unit,
              itms[i].description,
              itms[i].code,
              itms[i].mark,
              parseFloat(itms[i].unitPrice),
              itms[i].prodservCode,
              itms[i].unitCode
            )
            itms[i].quantity = parseFloat(itms[i].quantity)
            itms[i].unitPrice = parseFloat(itms[i].unitPrice)
            productsLog.unshift(itms[i])
            productsLog[0].disabled = itms[i].disabled
            if (itms[i].id == -1) {
              $("#log").sexytable({
                editedRow: true,
                index: 0,
              })
            }
            if (itms[i].disabled) {
              $("#log").sexytable({
                disabledRow: true,
                index: 0,
              })
            }
          }
          onLogChange()
          commander.reset()
        },
        error: function (jqXHR, textStatus, errorThrown) {
          commander.reset()
          $.blockUI({
            node: block3,
            content: jqXHR.responseText,
            changeContent: true,
            unblockOnAnyKey: true,
          })
        },
        dataType: "json",
      })
    }
  } else if (commandline.kind == "searchinvoices") {
    //console.log('going search: '+commandline.args.join(" "))
    if (commandline.args.length >= 1) {
      commandline.args[commandline.args.length - 1] = commandline.args[
        commandline.args.length - 1
      ].replace(/\./g, "")
      $("#resultset").prepend(
        "<img src=img/wait.gif width=70px height=70px/>"
      )
      $.ajax({
        url: "searchinvoices",
        type: "POST",
        data: {
          paths: encodeURIComponent(commandline.args.join(" ")),
          token: TOKEN,
          clientReference: CLIENT_REFERENCE,
        },
        success: function (data) {
          $("#resultset").empty()
          for (var i = 0; i < data.invoices.length; i++) {
            var gtotal = 0
            for (var j = 0; j < data.invoices[i].items.length; j++) {
              var item = data.invoices[i].items[j]
              var quantity = item.quantity
              var unitPrice = item.unitPrice
              data.invoices[i].items[j].total =
                Math.round(quantity * unitPrice * 100) / 100
              gtotal += quantity * unitPrice
              for (var field in item) {
                for (var k = 0; k < commandline.args.length; k++) {
                  if (typeOf(item[field]) == "string") {
                    item[field] = item[field].replace(
                      commandline.args[k].toUpperCase().replace(/\"/g, ""),
                      "<i style='background-color:#fbff8d'><b>" +
                        commandline.args[k].toUpperCase().replace(/\"/g, "") +
                        "</b></i>"
                    )
                    //if(item[field].indexOf(commandline.args[k].toUpperCase())!=-1)contains=true
                  }
                }
              }
            }
            var consummer = data.invoices[i].client.consummer
            var consummerType = data.invoices[i].client.consummerType
            var address = data.invoices[i].client.address
            var city = data.invoices[i].client.city
            var state = data.invoices[i].client.state
            var country = data.invoices[i].client.country
            var email = data.invoices[i].client.email
            var cp = data.invoices[i].client.cp
            var rfc = data.invoices[i].client.rfc
            var payment = data.invoices[i].client.payment
            var reference = data.invoices[i].reference
            var date = null
            //**TODO fix the db removing metadata */
            if (data.invoices[i].metaData)
              date = new Date(new Number(data.invoices[i].metaData.date))
                .format("dd.mmm.yyyy")
                .toUpperCase()
            else
              date = new Date(new Number(data.invoices[i].logs[0].date))
                .format("dd.mmm.yyyy")
                .toUpperCase()
            var shopmanName = null
            var shopmanLogin = null
            var agentName = null
            var agentAddress = null
            var agentRfc = null
            var agentType = null
            if (data.invoices[i].shopman != null) {
              shopmanName = data.invoices[i].shopman.name
              shopmanLogin = data.invoices[i].shopman.login
            }
            if (data.invoices[i].agent != null) {
              agentName = data.invoices[i].agent.consummer
              agentAddress = data.invoices[i].agent.address
              agentRfc = data.invoices[i].agent.rfc
              agentType = data.invoices[i].agent.consummerType
            }
            var invoices = data.invoices
            var consummerContent =
              "<b>fecha:</b>" +
              date +
              " | <b>ref:</b>" +
              reference +
              (invoices[i].totalValue
                ? " | <b>totalValue:</b>" + invoices[i].totalValue
                : "") +
              (invoices[i].agentPayment
                ? " | <b>totalValue:</b>" + invoices[i].agentPayment
                : "") +
              " | <b>total:</b>" +
              Math.round(gtotal * 100) / 100 +
              "<br>" +
              "<b>cliente:</b>" +
              consummer +
              " | <b>tipo:</b>" +
              consummerType +
              " | <b>credito:</b>" +
              payment +
              " | <b>dir:</b>" +
              address +
              " | <b>ciudad:</b>" +
              city +
              " | <b>estado:</b>" +
              state +
              " | <b>cp:</b>" +
              cp +
              " | <b>rfc:</b>" +
              rfc +
              "<br>" +
              "<b>agente nombre:</b>" +
              (agentName ? agentName : "") +
              " | <b>agente dir:</b>" +
              (agentAddress ? agentAddress : "") +
              " | <b>agente rfc:</b>" +
              (agentRfc ? agentRfc : "") +
              " | <b>agente tipo:</b>" +
              (agentType ? agentType : "") +
              "<br>" +
              "<b>despachó nombre:</b>" +
              (shopmanName ? shopmanName : "") +
              " | <b>despachó login:</b>" +
              (shopmanLogin ? shopmanLogin : "")
            for (var k = 0; k < commandline.args.length; k++) {
              if (!isNumber(consummer[field])) {
                consummerContent = consummerContent.replace(
                  commandline.args[k].toUpperCase().replace(/\"/g, ""),
                  "<i style='background-color:#fbff8d'><b>" +
                    commandline.args[k].toUpperCase().replace(/\"/g, "") +
                    "</b></i>"
                )
              }
            }
            var consummerObj = { content: consummerContent }
            $("#resultset")
              .inComFerremundoCpsGenericDiv({
                dclass: "box fleft",
                width: "100%",
                content: "",
              })
              .comFerremundoCpsTB(data.invoices[i].items)
              .addClass(i % 2 != 0 ? "odd" : "even")
              .preComFerremundoCpsGenericDiv(consummerObj)
          }
          $("#resultset").append("-- FIN DE BUSQUEDA --")
        },
        dataType: "json",
        error: function () {
          $("#resultset").empty()
        },
      })
    }
  } else if (commandline.kind == "searchcachesession") {
    //console.log('going search: '+commandline.args.join(" "))
    if (commandline.args.length >= 1) {
      commandline.args[commandline.args.length - 1] = commandline.args[
        commandline.args.length - 1
      ].replace(/\./g, "")
      $("#resultset").prepend(
        "<img src=img/wait.gif width=70px height=70px/>"
      )
      $.ajax({
        url: CONTEXT_PATH + "/dbport",
        type: "POST",
        data: {
          command: commandline.kind,
          patterns: commandline.patterns,
          token: TOKEN,
          clientReference: CLIENT_REFERENCE,
        },
        success: function (data) {
          $("#resultset").empty()
          console.log(data)
          for (var i = 0; i < data.cachedSessions.length; i++) {
            if (data.cachedSessions[i].items.length > 0) {
              var gtotal = 0
              for (var j = 0; j < data.cachedSessions[i].items.length; j++) {
                var item = data.cachedSessions[i].items[j]
                var quantity = item.quantity
                var unitPrice = item.unitPrice
                data.cachedSessions[i].items[j].total =
                  Math.round(quantity * unitPrice * 100) / 100
                gtotal += quantity * unitPrice
                for (var field in item) {
                  for (var k = 0; k < commandline.args.length; k++) {
                    if (typeOf(item[field]) == "string") {
                      item[field] = item[field].replace(
                        commandline.args[k].toUpperCase().replace(/\"/g, ""),
                        "<i style='background-color:#fbff8d'><b>" +
                          commandline.args[k]
                            .toUpperCase()
                            .replace(/\"/g, "") +
                          "</b></i>"
                      )
                      //if(item[field].indexOf(commandline.args[k].toUpperCase())!=-1)contains=true
                    }
                  }
                }
              }

              var cachedSessions = data.cachedSessions
              var consummerContent =
                "<b>id:</b>" + cachedSessions[i].id + "<br>"
              /*for (var k = 0; k < commandline.args.length; k++) {
                    if (!isNumber(consummer[field])) {
                      consummerContent = consummerContent
                              .replace(
                                  commandline.args[k]
                                      .toUpperCase()
                                      .replace(
                                          /\"/g,
                                          ""),
                                  "<i style='background-color:#fbff8d'><b>"
                                      + commandline.args[k]
                                          .toUpperCase()
                                          .replace(
                                              /\"/g,
                                              "")
                                      + "</b></i>")
          
                    }
                  }*/
              var consummerObj = { content: consummerContent }
              $("#resultset")
                .inComFerremundoCpsGenericDiv({
                  dclass: "box fleft",
                  width: "100%",
                  content: "",
                })
                .comFerremundoCpsTB(cachedSessions[i].items)
                .addClass(i % 2 != 0 ? "odd" : "even")
                .preComFerremundoCpsGenericDiv(consummerObj)
            }
          }

          $("#resultset").append("-- FIN DE BUSQUEDA --")
        },
        dataType: "json",
        error: function () {
          $("#resultset").empty()
        },
      })
    }
  } else if (commandline.kind == "makerecord") {
    $.ajax({
      url: CONTEXT_PATH + "/dbport",
      type: "POST",
      data: {
        command: commandline.kind,
        message: commander.commandline.message,
        token: TOKEN,
        clientReference: CLIENT_REFERENCE,
      },
      success: function (data) {
        var r = data.record
        var pdd = new Date(r.creationTime)
        var mm = pdd.getMonth() + 1
        var dd = pdd.getDate()
        var yyyy = pdd.getFullYear()
        var date = yyyy + "." + mm + "." + dd
        var src =
          "<div id=record-" +
          r.id +
          ">" +
          r.id +
          " | " +
          date +
          " | " +
          r.text +
          "</div>"
        nodeLog(src, "#records", "box fleft")
        commander.reset()
      },
      error: function (jqXHR, textStatus, errorThrown) {
        alert(
          "el sistema dice: " +
            textStatus +
            " - " +
            errorThrown +
            " - " +
            jqXHR.responseText
        )
      },
    })
  } else if (commandline.kind == "fixdb") {
    var kind = commandline.kind,
      fixNumber = commandline.args[0]
    commander.reset()
    $.ajax({
      url: CONTEXT_PATH + "/dbport",
      type: "POST",
      data: {
        command: kind,
        fixNumber: fixNumber, //$("#absolutediscount").val(),
        token: TOKEN,
        clientReference: CLIENT_REFERENCE,
      },
      success: function (data) {
        alert(data.result)
        console.log(data.result)
      },
      error: function (jqXHR, textStatus, errorThrown) {
        alert(
          "el sistema dice: " +
            textStatus +
            " - " +
            errorThrown +
            " - " +
            jqXHR.responseText
        )
      },
    })
  } else if (commandline.kind == "updateproducts") {
    var block3 = $.blockUI({
      content: '<h1><img src="img/wait.gif" /></h1>',
    })
    $.ajax({
      url: CONTEXT_PATH + "/dbport",
      type: "POST",
      data: {
        command: commandline.kind,
        token: TOKEN,
        clientReference: CLIENT_REFERENCE,
      },
      success: function (data) {
        commander.reset()
        $("#resultset").empty().append(data.response)
        /*return
            var r = data.response
            for(var i = 0; (i < r.length && i < 100); i++){
              $("#resultset").empty().sexytable({
                row:[
                    {content: "<div class='unit-'>"+r[i].unit+"</div>", width:8},
                    {content: "<div class='description-'>"+r[i].description+"</div>", width:33},
                    {content: "<div class='code-'>"+r[i].code+"</div>", width:8},
                    {content: "<div class='mark-'>"+r[i].mark+"</div>", width:8},
                    {content: "<div class='unitPrice-'>"+r[i].unitPrice+"</div>", width:8},
                    {content: "<div class='prodservCode-'>"+r[i].prodservCode+"</div>", width:8},
                    {content: "<div class='unitCode-'>"+r[i].unitCode+"</div>", width:8}
                    ],
                animate:0,
                class_:"tableingrow"
              })
            }
            if(r.length>100){
              $("#resultset").append("(... and "+(r.length-100)+" more.)")
            }*/
        $.unblockUI(block3)
        return
      },
      error: function (jqXHR, textStatus, errorThrown) {
        commander.reset()
        $.unblockUI(block3)
        console.error(
          "el sistema dice: " +
            textStatus +
            " - " +
            errorThrown +
            " - " +
            jqXHR.responseText
        )
        $("#resultset")
          .empty()
          .append(
            "el sistema dice: " +
              textStatus +
              " - " +
              errorThrown +
              " - " +
              jqXHR.responseText
          )
      },
    })
  } else if (commandline.kind == "deleteproducts") {
    var block3 = $.blockUI({
      content: '<h1><img src="img/wait.gif" /></h1>',
    })
    $.ajax({
      url: CONTEXT_PATH + "/dbport",
      type: "POST",
      data: {
        command: commandline.kind,
        token: TOKEN,
        clientReference: CLIENT_REFERENCE,
      },
      success: function (data) {
        commander.reset()
        $("#resultset").empty().append(data.response)

        $.unblockUI(block3)
        return
      },
      error: function (jqXHR, textStatus, errorThrown) {
        commander.reset()
        $.unblockUI(block3)
        console.error(
          "el sistema dice: " +
            textStatus +
            " - " +
            errorThrown +
            " - " +
            jqXHR.responseText
        )
        $("#resultset")
          .empty()
          .append(
            "el sistema dice: " +
              textStatus +
              " - " +
              errorThrown +
              " - " +
              jqXHR.responseText
          )
      },
    })
  } else if (commandline.kind == "updateuser") {
    var passinid = "passid" + $.capsule.randomString(1, 15, "aA0")
    passin({
      id: passinid,
      success: function (data) {
        AUTHORIZED = true
        //alert("success " +data.authenticated+". #"+passinid+" to be removed")
        $("#" + passinid).remove()
        document.isIdle = false
        updateShopmanIn(commander)
      },
      message: "password " + SHOPMAN.name + "-" + SHOPMAN.login,
    })
  } else if (commandline.kind == "updatecustomer") {
    updateCustomerIn(commander)
    /*var passinid = 'passid'+ $.capsule.randomString(1, 15,'aA0')
        passin({
          id : passinid,
          success : function(data) {
            AUTHORIZED = true
            //alert("success " +data.authenticated+". #"+passinid+" to be removed")
            $('#' + passinid).remove()
            document.isIdle = false
            updateCustomerIn(commander)
            commandline = null
          },
          message : "password "
              + SHOPMAN.name
              + "-"
              + SHOPMAN.login
        });*/
  } else if (commandline.kind == "adduser") {
    var passinid = "passid" + $.capsule.randomString(1, 15, "aA0")
    passin({
      id: passinid,
      success: function (data) {
        AUTHORIZED = true
        //alert("success " +data.authenticated+". #"+passinid+" to be removed")
        $("#" + passinid).remove()
        document.isIdle = false
        registerShopmanIn(commander)
      },
      message: "password " + SHOPMAN.name + "-" + SHOPMAN.login,
    })
  }
}