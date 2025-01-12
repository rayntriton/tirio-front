import { DecoupledPromise } from "@/utils/core"

export class MiniRobot< STATE >{
  
  private itinerary = new Map< string, { isSet:boolean } >
  private subprocesses = new Map< string, { subprocess:MiniSubprocess< STATE >, isDone:boolean } >
  private state:STATE
  private isFullfilled = false
  private promise:Promise< STATE >
  private fine:( success: STATE ) => void
  private fail:( error: string ) => void
  
  constructor( state:STATE, itinerary:string[] ){
    const { promise, fine, fail } = new DecoupledPromise< STATE >()
    this.promise = promise
    this.fine = fine
    this.fail = fail
    this.state = state
    itinerary.forEach( taskName =>  this.itinerary.set( taskName, { isSet: false } ) )
  }

  addTask( subprocess:MiniSubprocess< STATE > ){
    if( this.isFullfilled ) return this.promise
    const taskName = subprocess.name
    if( this.itinerary.get( taskName )?.isSet ){
      this.fail( "Task already set:" + taskName )
      return
    }
    const isDone = false
    this.subprocesses.set( subprocess.name, { subprocess, isDone } )
    if( this.subprocesses.size == this.itinerary.size ){
      this.isFullfilled = true
      this.next( this.state )
    }
    return this.promise
  }

  private next( state:STATE ){
    let taskName:string|null = null
    for( let [ name, value ] of this.subprocesses )
      if( ! value.isDone )
        taskName = name
    console.log( "MiniRobot.next taskName", taskName )
    if( taskName == null ){
      this.fine( state )
    }
    else{
      const subprocess = this.subprocesses.get( taskName )!.subprocess
      subprocess.start( state )
        .then( state => {
          this.subprocesses.get( taskName )!.isDone = true
          this.next( state )
        } )
        .catch( error => { 
          this.fail( error )
        } )
    }
  }
}

export class MiniSubprocess< STATE >{
  name:string
  task:Task< STATE >
  constructor( name:string, task:Task< STATE > ){
    this.name = name
    this.task = task
  }
  start( state:STATE ){
    return this.task( state )
  }
}

export type Task< STTATE > = ( state:STTATE ) => Promise< STTATE >
