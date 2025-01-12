import { PRODUCTION_ENV } from "@/feats/settings"
import { Accessor, EventFunction, GET, SET, Setter, TransformToEventFunction } from "./types"
import { usePersistentStorage } from "@/feats/sessionStore"
import { traceHash } from "@/utils/string"
import { createFakeEvent, executeFakeEvent, getParentEventId } from "./utils"
import { TaskUnit } from "./TaskUnit"
import { deprecate } from "util"

export class Events< FUNCTION = Setter< any >|Accessor< any >|( ( ...args:any[] ) => any ) >{
  private status:'idle'|'processing' = 'idle'
  private queueUnits:TaskUnit< FUNCTION >[] = []
  private runningTaskName:string = ''
  private runningTask?:TaskUnit< FUNCTION >
  private registry = new Map< string, FUNCTION >()
  //private registerCounter = 0
  static EVENTS_COUNTER = 0
  static MAX_TASKS_PER_SECOND = 50
  static LOGS:any[] = []
  private unitsDone:TaskUnit< FUNCTION >[] = []
  private allUnits = new Map< number, TaskUnit< FUNCTION > >()

  queue( name:string, ...args:any[] ){
    console.log( "Events.queue name", name, "...args", args )
    const taskId = Events.EVENTS_COUNTER ++
    const fingerPrint = new Error().stack!.split( '\n' ).map( string => string.substring( string.lastIndexOf( '/' ) + 1 ) )
    const parentTaskUnitId = getParentEventId()
    const oldestTaskTime = this.queueUnits.length > 0
      ? ( Date.now() - this.queueUnits[ 0 ].creationTime ) / 1000
      : 1
    if(
        ( this.queue.length + 1 ) > Events.MAX_TASKS_PER_SECOND &&
        oldestTaskTime < 1 )
      throw new Error( `maxTasksPerSecond limit ${ ( this.queue.length + 1 ) / oldestTaskTime } reached ${ Events.MAX_TASKS_PER_SECOND }, try setMaxTasksPerSecond( biggerNumber )` )
    let task
    if( this.registry.has( name ) )
      task = this.registry.get( name )
    else throw new Error( "Task not registered yet" + name )
    const taskUnit = new TaskUnit( name, task!, taskId, parentTaskUnitId, ...args )
    taskUnit.fingerPrint = fingerPrint
    this.allUnits.set( taskId, taskUnit )
    const parentTaskUnit = this.allUnits.get( parentTaskUnitId )
    if( parentTaskUnit ){
      parentTaskUnit.children.push( taskUnit )
      if( ! parentTaskUnit.subEvents )
        parentTaskUnit.subEvents = new Events()
      if( parentTaskUnit.subEvents.status == 'idle' ){
        parentTaskUnit.subEvents.status = 'processing'
        Events.LOG( { type: 'QUEUE-PRERUN-SUB', name, task:(task as any as Function).toString(), args } )
        setTimeout( () => {
          parentTaskUnit.subEvents!.preRun( taskUnit )
        }, 0 )
      }
      else {
        Events.LOG( { type: 'QUEUE-SUB', name, task:(task as any as Function).toString(), args } )
        parentTaskUnit.subEvents!.queueUnits.push( taskUnit ) 
      }
      return taskUnit.decoupledPromise.promise
    }
    if( this.status == 'idle' ){
      this.status = 'processing'
      Events.LOG( { type: 'QUEUE-PRERUN', name, status: this.status,task:(task as any as Function).toString(), args } )
      setTimeout( () => {
        this.preRun( taskUnit )
      }, 0 )
    }
    else {
      Events.LOG( { type: 'QUEUE-MAIN', name, task:(task as any as Function).toString(), args } )
      this.queueUnits.push( taskUnit )
    }
    return taskUnit.decoupledPromise.promise
  }
  register( task:FUNCTION, name:string ){
    if( this.registry.has( name ) )
      return name
    this.registry.set( name, task )
    console.log( "Events.register",  "name", name, "task", task )
    Events.LOG( { type: 'REGISTER', name, task:(task as any as Function).toString() } )
    return name
  }
  private preRun = ( taskUnit:TaskUnit< FUNCTION > ) => {
    const self = this
    createFakeEvent(
      `eventFingerPrint__${ taskUnit.taskId }__`,
      `
        const self = args[ 0 ]
        const taskUnit = args[ 1 ]
        self.run( taskUnit )
      `
    )
    executeFakeEvent( `eventFingerPrint__${ taskUnit.taskId }__`, self, taskUnit )
  }
  private run = ( taskUnit:TaskUnit< FUNCTION > ) => {
    console.log( "Events.run name", taskUnit.name, "args", taskUnit.args )
    Events.LOG( { type: 'RUN', name:taskUnit.name, task:(taskUnit.task as any as Function).toString(), args:taskUnit.args } )
    this.runningTaskName = taskUnit.name
    this.runningTask = taskUnit
    taskUnit.status = 'runing'
    const taskResult = taskUnit.task( ...taskUnit.args )
    Promise.all( [ taskResult ] ).then( taskResponse => {
      Events.LOG( { type: 'FINISH-PARENT', name:taskUnit.name , taskResponse, task:(taskUnit.task as any as Function).toString() } )
      let promises:Promise< any >[] = []
      if( taskUnit.subEvents )
        promises =
          taskUnit.children
            .map( child  => child.decoupledPromise.promise )
      console.log( "Events.run:promises.lenght", promises.length, "name", this.runningTaskName )
      Promise.all( promises ).then( values => {
      Events.LOG( { type: 'FINISH-CHILDREN', name:taskUnit.name , values, task:(taskUnit.task as any as Function).toString() } )
      console.log( "Events.run:promises.values", values, "name", this.runningTaskName )
        let response = taskResponse[ 0 ] //? taskResponse[ 0 ][ 0 ] : undefined
        taskUnit.status = 'finished'
        console.log( "Events.run:response", response, "name", this.runningTaskName )
        Events.LOG( { type: 'RUN:RESPONSE', name:taskUnit.name, response, task:( taskUnit.task as any as Function ).toString(), args:taskUnit.args } )

        taskUnit.decoupledPromise.fine( response )
        taskUnit.response = response
        this.runningTaskName = ''
        this.runningTask = undefined
        this.unitsDone.push( taskUnit )
        if( this.queueUnits.length > 0 ){
          let nextTaskUnit = this.queueUnits.shift()!
          this.status = 'processing'
          Events.LOG( { type: 'RUN-PRERUN', name: nextTaskUnit.name, task:( nextTaskUnit.task as any as Function ).toString(), args: nextTaskUnit.args } )
          setTimeout( () => {
            this.preRun( nextTaskUnit! )
          }, 0 )
        }
        else {
          Events.LOG( { type: 'RUN-IDLE, NO MORE TASKS' } )
          this.status = 'idle'
        } } )
        .catch( error => {
          console.log( "Error", error )
          taskUnit.decoupledPromise.fail( error )
      } )
    } )
  }
  get( taskName:string ):any{
    return ( this.registry.get( taskName ) as Function)()
  }
  static LOG( object:object ){
    Events.LOGS.push( object )
  }

  findParent( id:number ){
    if( this.runningTask?.taskId == id ) return this.runningTask
    const parent = this.queueUnits.find( taskUnit => taskUnit.taskId == id )
    return parent
  }

}

const events = new Events()

export function queueEvent( event:string, ...args:any[] ){
  return events.queue( event, ...args )
}

export function getValue( valueName:string ){
  return events.get( valueName )
}

function create<
    Keys extends string[],
    Values extends any[],
  >(
    persistent:'sessionStorage'|'localStorage'|'memoryStorage',
    keys: [...Keys],
    ...values: Values
  ):EventFunction< Keys, Values > {
    const eventsId:string[] = []
    const functionsType:( 'fun'|'get'|'set' )[] = []
    for( let i = 0, j = 0; i < values.length; i++ ){
      let eventName = `${ j }-${ traceHash() }`
      if( values[ i ] instanceof Function ){
        eventsId.push( events.register( values[ i ], eventName ) )
        functionsType[ j ] = 'fun'
        j ++
        continue
      }
      const [ getter, setter ] = usePersistentStorage< any >( values[ i ], i, persistent )
      eventsId.push( events.register( getter as GET< any >, eventName) )
      functionsType[ j ] = 'get'
      j ++
      eventName = `${ j }-${ traceHash() }`
      eventsId.push( events.register( setter as SET< any >, eventName ) )
      functionsType[ j ] = 'set'
      j ++
    }
    return keys.reduce((acc, key, index) => {
      if( functionsType[ index ] == 'fun' || functionsType[ index ] == 'set' )
        acc[ key ] = ( ( ...args:any[] ) => {
          const result = queueEvent( eventsId[ index ], ...args )
          result.then( response => 
              console.log( `Events-----------------------------${ response }------------------------------` )
            )
          return  result
        } )
      else
        acc[ key ] = ( () => getValue( eventsId[ index ] ) )
      return acc;
    }, {} as any )
}

'@deprecated'
export function createMemorySignals<
    Keys extends string[],
    Values extends any[] >(
  keys:[ ...Keys ],
  ...values:Values )
      :EventFunction< Keys, Values > {
    return create( 'memoryStorage', keys, ...values )
}

export function createSessionSignals<
    Keys extends string[],
    Values extends any[] >(
  keys:[ ...Keys ],
  ...values:Values ):EventFunction< Keys, Values > {
    return create( 'sessionStorage', keys, ...values )
}

export function createLocalSignals<
    Keys extends string[],
    Values extends any[] >(
  keys:[ ...Keys ],
  ...values:Values ):EventFunction< Keys, Values > {
    return create( 'localStorage', keys, ...values )
}

export function createSignals<
    Keys extends string[],
    Values extends any[] >(
  type:'memoryStorage'|'sessionStorage'|'localStorage',
  ...args:any[] ):EventFunction< Keys, Values > {
  const keys:string[] = []
  const values:any[] = []
  args.forEach( arg => {
    if( Array.isArray( arg ) )
      values.push( arg[ 0 ] )
    else keys.push( arg )
  } )
  if( type == 'memoryStorage' )
    return createMemorySignals( keys, ...values ) as any
  else if( type == 'sessionStorage' )
    return createSessionSignals( keys, ...values ) as any
  else if( type == 'localStorage' )
    return createLocalSignals( keys, ...values ) as any
  else throw new Error( 'Unknown storage type:' + type )
}

export function createMemory<
    Args extends [ ...any ]  >
  ( args:Args ):TransformToEventFunction< Args >{
    return createSignals( 'memoryStorage', ...args ) as TransformToEventFunction< Args >
}

export function createSession<
    Args extends [ ...any ]  >
  ( args:Args ):TransformToEventFunction< Args >{
    return createSignals( 'sessionStorage', ...args ) as TransformToEventFunction< Args >
}

export function createLocal<
    Args extends [ ...any ]  >
  ( args:Args ):TransformToEventFunction< Args >{
    return createSignals( 'localStorage', ...args ) as TransformToEventFunction< Args >
}

export function useMemory< V >( value:V ){
  const memory = createMemory( [ 'get', 'set', [ value ] ] as const )
  return [ memory.get, memory.set  ] as [ Accessor< V >, Setter< V >]
}

export function useSession< V >( value:V ){
  const memory = createSession( [ 'get', 'set', [ value ] ] as const )
  return [ memory.get, memory.set  ] as [ Accessor< V >, Setter< V >]
}

export function useLocal< V >( value:V ){
  const memory = createLocal( [ 'get', 'set', [ value ] ] as const )
  return [ memory.get, memory.set  ] as [ Accessor< V >, Setter< V >]
}

export function setMaxTasksPerSecond( value:number ){
  Events.MAX_TASKS_PER_SECOND = value
}

if( ! PRODUCTION_ENV )
  ( window as any as { queueSystem:Events } ).queueSystem = events
