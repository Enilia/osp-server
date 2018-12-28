import * as SocketIO from 'socket.io'
import { SocketService, Nsp, Input, Args, Socket } from '@tsed/socketio'
import { UserStorageService } from './user.storage.service';

const EVENT_RENAME_USER = 'renameUser'
const EVENT_USER_RENAMED = 'USER_RENAMED'

@SocketService()
export class UserService {

  @Nsp
  private nsp: SocketIO.Namespace

  constructor(
    private userStorageService: UserStorageService,
  ) {}

  @Input(EVENT_RENAME_USER)
  public async renameUser(
    @Args(0) nickname: string,
    @Socket socket: SocketIO.Socket,
  ) {
    const user = await this.userStorageService.get( socket )
    if( !user ) return

    nickname = nickname.slice(0, 20)
    nickname = nickname.replace(/[^a-zA-Z0-9]/g, '-')

    user.nickname = nickname

    this.userStorageService.save( socket, user )

    socket.emit( EVENT_USER_RENAMED, user.nickname )
  }

}
