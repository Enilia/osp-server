import * as SocketIO from 'socket.io'
import { SocketService, Nsp, IO, Input, Args, Socket, SocketSession, Emit } from '@tsed/socketio'
import { User } from '../models/user.model'
import { UIDService } from './uid.service'

const SESSION_USER = 'user'
const EVENT_RENAME_USER = 'renameUser'
const EVENT_USER_RENAMED = 'USER_RENAMED'
const EVENT_USER_UPDATED = 'USER_UPDATED'

@SocketService()
export class UserService {

  @Nsp
  private nsp: SocketIO.Namespace

  store = new Map()

  constructor(
    private uidService: UIDService,
  ) {}

  private createUser() {
    const user = new User()
    user.id = user.nickname = this.uidService.uid()
    return user
  }

  $onConnection(@Socket socket: SocketIO.Socket, @SocketSession session: SocketSession) {
    const user = this.createUser()
    session.set( SESSION_USER, user )
    socket.emit(EVENT_USER_UPDATED, user)
  }

  $onDisconnect(@Socket socket: SocketIO.Socket) {}

  @Input(EVENT_RENAME_USER)
  @Emit(EVENT_USER_RENAMED)
  async renameUser(@Args(0) nickname: string, @SocketSession session: SocketSession) {
    const user: User = session.get( SESSION_USER )
    if( nickname.length > 20 ) return user.nickname

    nickname = nickname.replace(/[^a-zA-Z0-9]/g, '-')

    user.nickname = nickname
    session.set( SESSION_USER, user )

    return nickname
  }

}
