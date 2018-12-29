import * as SocketIO from 'socket.io'
import { SocketService, Socket } from '@tsed/socketio'
import { UserStorageService } from './user.storage.service'
import { ConverterService } from '@tsed/common'
import { RoomService } from './room.socket.service';

const EVENT_USER_UPDATED = 'USER_UPDATED'

@SocketService()
export class UserConnectionService {

  constructor(
    private userStorageService: UserStorageService,
    private converterService: ConverterService,
    private roomService: RoomService,

  ) {}

  public async $onConnection(
    @Socket socket: SocketIO.Socket,
  ): Promise<void> {
    const user = await this.userStorageService.create( socket.id )
    socket.emit( EVENT_USER_UPDATED, this.converterService.serialize(user) )
    console.log(`user connected: ${socket.id}`, `active users: ${this.userStorageService.size}`)
  }

  public async $onDisconnect(
    @Socket socket: SocketIO.Socket,
  ): Promise<void> {
    try {
      const user = await this.userStorageService.get( socket.id )
      if(user.room) this.roomService.leave(user.room, user)
    } catch(e) {}
    this.userStorageService.delete( socket.id )
    console.log(`user disconnected: ${socket.id}`, `active users: ${this.userStorageService.size}`)
  }

}
