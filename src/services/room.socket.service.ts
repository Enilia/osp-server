import * as SocketIO from 'socket.io'
import { SocketService, Nsp, Input } from '@tsed/socketio'
import { RoomStorageService } from './room.storage.service'
import { Room } from '../models/Room.model'
import { User } from '../models/user.model'
import { ConverterService, Service } from '@tsed/common'

const EVENT_ROOM_USER_JOINED = 'ROOM_USER_JOINED'
const EVENT_ROOM_USER_LEFT = 'ROOM_USER_LEFT'

@SocketService()
export class RoomService {

  @Nsp
  private nsp: SocketIO.Namespace

  constructor(
    private roomStorageService: RoomStorageService,
    private converterService: ConverterService,
  ) {}

  @Input('dummy')
  dummy() {}

  public async create(): Promise<Room> {
    const room = await this.roomStorageService.create()
    console.log(`room created: ${room.id}`)
    return room
  }

  public join( room: Room, user: User ): void {
    room.join( user )
    this.nsp.to( room.id ).emit( EVENT_ROOM_USER_JOINED, this.converterService.serialize( user ) )
    console.log(`user '${user.socketid}' joined room '${room.id}'`)
  }

  public leave( room: Room, user: User ): void {
    room.leave( user )
    this.nsp.to( room.id ).emit( EVENT_ROOM_USER_LEFT, this.converterService.serialize( user ) )
    console.log(`user '${user.socketid}' left room '${room.id}'`)
    if( !room.hasClients ) {
      this.delete( room )
    }
  }

  public delete( room: Room ): void {
    this.roomStorageService.delete( room.id )
    console.log(`room ${room.id} deleted`)
  }

}
