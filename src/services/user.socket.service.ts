import * as SocketIO from 'socket.io'
import { SocketService, Nsp, IO, Input, Args, Socket, SocketSession, Emit } from '@tsed/socketio'
import { User } from '../models/user.model'
import { UIDService } from './uid.service'

const SESSION_USER = 'user'
const USER_RENAMED = 'userRenamed'

@SocketService()
export class UserService {

  @Nsp
  private nsp: SocketIO.Namespace

  store = new Map()

  constructor(
    private uidService: UIDService,
  ) {}

  $onConnection(@Socket socket: SocketIO.Socket, @SocketSession session: SocketSession) {
    const user = new User()
    user.id = user.nickname = this.uidService.uid()
    session.set( SESSION_USER, user )
    this.nsp.clients( (...args: any[]) => {
      console.log(args)
    } )
    socket.emit(USER_RENAMED, user.nickname)
  }

  $onDisconnect(@Socket socket: SocketIO.Socket) {
    this.nsp.clients( (...args: any[]) => {
      console.log(args)
    } )
  }

  @Input('renameUser')
  @Emit(USER_RENAMED)
  async renameUser(@Args(0) nickname: string, @SocketSession session: SocketSession) {
    const user: User = session.get( SESSION_USER )
    if( nickname.length > 20 ) return user.nickname

    nickname = nickname.replace(/[^a-zA-Z0-9]/, '-')

    user.nickname = nickname
    session.set( SESSION_USER, user )

    return nickname
  }

}
