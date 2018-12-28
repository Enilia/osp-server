import * as SocketIO from 'socket.io'
import { SocketService, Socket } from '@tsed/socketio'
import { UserStorageService } from './user.storage.service'

const EVENT_USER_UPDATED = 'USER_UPDATED'

@SocketService()
export class UserConnectionService {

  constructor(
    private userStorageService: UserStorageService,
  ) {}

  public async $onConnection(
    @Socket socket: SocketIO.Socket,
  ): Promise<void> {
    const user = await this.userStorageService.create( socket )
    socket.emit( EVENT_USER_UPDATED, user )
  }

  public async $onDisconnect(
    @Socket socket: SocketIO.Socket,
  ): Promise<void> {
    this.userStorageService.delete( socket )
  }

}
