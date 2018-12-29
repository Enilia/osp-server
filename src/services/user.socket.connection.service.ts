import * as SocketIO from 'socket.io'
import { SocketService, Socket } from '@tsed/socketio'
import { UserStorageService } from './user.storage.service'
import { ConverterService } from '@tsed/common'

const EVENT_USER_UPDATED = 'USER_UPDATED'

@SocketService()
export class UserConnectionService {

  constructor(
    private userStorageService: UserStorageService,
    private converterService: ConverterService,
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
    this.userStorageService.delete( socket.id )
    console.log(`user disconnected: ${socket.id}`, `active users: ${this.userStorageService.size}`)
  }

}
