import * as SocketIO from 'socket.io'
import { SocketService, Nsp, Input, Args, Socket, SocketUseAfter, Emit } from '@tsed/socketio'
import { UserStorageService } from './user.storage.service'
import { ErrorHandlerSocketMiddleware } from '../middlewares/ErrorHandlerSocketMiddleware'

const EVENT_RENAME_USER = 'renameUser'
const EVENT_USER_RENAMED = 'USER_RENAMED'

@SocketService()
@SocketUseAfter(ErrorHandlerSocketMiddleware)
export class UserService {

  @Nsp
  private nsp: SocketIO.Namespace

  constructor(
    private userStorageService: UserStorageService,
  ) {}

  @Input(EVENT_RENAME_USER)
  @Emit(EVENT_USER_RENAMED)
  public async renameUser(
    @Args(0) nickname: string,
    @Socket socket: SocketIO.Socket,
  ) {
    const user = await this.userStorageService.get( socket )
    if( !user ) throw new Error('user not found')

    nickname = nickname.slice(0, 20)
    nickname = nickname.replace(/[^a-zA-Z0-9]/g, '-')

    user.nickname = nickname

    this.userStorageService.save( socket, user )

    return user.nickname
  }

}
