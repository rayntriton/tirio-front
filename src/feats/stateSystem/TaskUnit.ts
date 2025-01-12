import { Events } from "./Events"
import { DecoupledPromise } from "@/utils/core"

export class TaskUnit< FUNCTION >{
  name:string
  task:Function
  args:any[]
  status:'queued'|'runing'|'finished'|'created'
  decoupledPromise = new DecoupledPromise< any >()
  creationTime = Date.now()
  response?:any
  taskId:number
  parentId?:number
  childrenIds:number[] = []
  children:TaskUnit< FUNCTION >[] = []
  fingerPrint?:string[]
  subEvents?:Events
  taskString:string
  constructor( name:string, task:FUNCTION, eventId:number, parentId:number, ...args:any[] ){
    this.name = name
    this.task = task as Function
    this.args = args
    this.status = 'created'
    this.taskId = eventId
    this.parentId = parentId
    this.taskString = (task as any as Function).toString()
  }
}