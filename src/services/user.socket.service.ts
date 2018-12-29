import * as SocketIO from 'socket.io'
import { SocketService, Nsp, Input, Args, Socket, SocketUseAfter, Emit } from '@tsed/socketio'
import { UserStorageService } from './user.storage.service'
import { ErrorHandlerSocketMiddleware } from '../middlewares/ErrorHandlerSocketMiddleware'
import { RoomService } from './room.socket.service'
import { ConverterService } from '@tsed/common'

const EVENT_RENAME_USER = 'renameUser'
const EVENT_CREATE_ROOM = 'createRoom'

const EVENT_USER_RENAMED = 'USER_RENAMED'
const EVENT_ROOM_JOINED = 'ROOM_JOINED'

@SocketService()
@SocketUseAfter(ErrorHandlerSocketMiddleware)
export class UserService {

  @Nsp
  private nsp: SocketIO.Namespace

  constructor(
    private userStorageService: UserStorageService,
    private roomService: RoomService,
    private converterService: ConverterService,
  ) {}

  @Input(EVENT_RENAME_USER)
  @Emit(EVENT_USER_RENAMED)
  public async renameUser(
    @Args(0) nickname: string,
    @Socket socket: SocketIO.Socket,
  ) {
    const user = await this.userStorageService.get( socket.id )
    if( !user ) throw new Error(`user not found: '${socket.id}'`)

    nickname = nickname.slice(0, 20)
    nickname = nickname.replace(/[^a-zA-Z0-9]/g, '-')

    console.log(`user ${socket.id} renamed from '${user.nickname}' to '${nickname}'`)

    user.nickname = nickname

    this.userStorageService.save( user )

    return user.nickname
  }

  @Input(EVENT_CREATE_ROOM)
  @Emit(EVENT_ROOM_JOINED)
  public async createRoom(
    @Socket socket: SocketIO.Socket
  ) {
    const user = await this.userStorageService.get( socket.id )
    if( !user ) throw new Error(`user not found: '${socket.id}'`)

    if( user.room ) {
      socket.leave( user.room.id )
      this.roomService.leave( user.room, user )
      delete user.room
    }

    const room = await this.roomService.create()

    this.roomService.join( room, user )
    socket.join( room.id )
    user.room = room

    return this.converterService.serialize( room )
  }

}
