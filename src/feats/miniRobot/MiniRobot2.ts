export class MiniRobot2< STATE >{
  
  itinerary:string[]
  subprocess = new Map< string, MiniSubprocess< STATE > >()
  index = 0
  state:STATE
  isFullfilled = false
  constructor( state:STATE, itinerary:string[] ){
    this.state = state
    this.itinerary = itinerary
  }

  addTask( subprocess:MiniSubprocess< STATE > ){
    if( this.isFullfilled ) return false
    this.subprocess.set( subprocess.name, subprocess )
    if( this.subprocess.size == this.itinerary.length ){
      this.isFullfilled = true
      this.next( this.state )
    }
    return true
  }

  private next( state:STATE ){
    const taskId = this.index ++
    if( taskId == this.itinerary.length ){
      return Promise.resolve( 'ok' )
    }
    const taskName = this.itinerary[ taskId ]
    const subprocess = this.subprocess.get( taskName )
    subprocess?.start( state )
      .then( state => { 
        this.next( state )
      } )
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