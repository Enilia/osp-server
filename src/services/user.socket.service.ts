import * as SocketIO from 'socket.io'
import { SocketService, Nsp, Input, Args, Socket, SocketUseAfter, Emit } from '@tsed/socketio'
import { UserStorageService } from './user.storage.service'
import { ErrorHandlerSocketMiddleware } from '../middlewares/ErrorHandlerSocketMiddleware'
import { RoomService } from './room.socket.service'
import { ConverterService } from '@tsed/common'
import { Room } from '../models/Room.model'
import { RoomStorageService } from './room.storage.service'
import { User } from '../models/user.model'

const EVENT_RENAME_USER = 'renameUser'
const EVENT_CREATE_ROOM = 'createRoom'
const EVENT_JOIN_ROOM = 'joinRoom'
const EVENT_LEAVE_ROOM = 'leaveRoom'

const EVENT_USER_RENAMED = 'USER_RENAMED'
const EVENT_ROOM_JOINED = 'ROOM_JOINED'
const EVENT_ROOM_LEFT = 'ROOM_LEFT'

@SocketService()
@SocketUseAfter(ErrorHandlerSocketMiddleware)
export class UserService {

  @Nsp
  private nsp: SocketIO.Namespace

  constructor(
    private userStorageService: UserStorageService,
    private roomStorageService: RoomStorageService,
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

    nickname = nickname.slice(0, 20)
    nickname = nickname.replace(/[^a-zA-Z0-9]/g, '-')

    console.log(`user ${socket.id} renamed from '${user.nickname}' to '${nickname}'`)

    user.nickname = nickname

    this.userStorageService.save( user )

    this.roomService.userRenamed( user )

    return user.nickname
  }

  @Input(EVENT_CREATE_ROOM)
  @Emit(EVENT_ROOM_JOINED)
  public async createRoom(
    @Socket socket: SocketIO.Socket,
  ) {
    const room = await this.roomService.create()

    try {

      await this._joinRoom( socket, room )
      return this.converterService.serialize( room )

    } catch( e ) {

      this.roomService.delete( room )
      throw e

    }
  }

  @Input(EVENT_JOIN_ROOM)
  @Emit(EVENT_ROOM_JOINED)
  public async joinRoom(
    @Args(0) roomid: string,
    @Socket socket: SocketIO.Socket,
  ) {
    const room = await this.roomStorageService.get( roomid )

    return this.converterService.serialize(await this._joinRoom( socket, room ))
  }

  @Input(EVENT_LEAVE_ROOM)
  @Emit(EVENT_ROOM_LEFT)
  public async leaveRoom(
    @Socket socket: SocketIO.Socket,
  ) {

    await this._leaveRoom( socket )

    return
  }

  private async _joinRoom( socket: SocketIO.Socket, room: Room ) {
    const user = await this.userStorageService.get( socket.id )

    await this._leaveRoom( socket, user )

    this.roomService.join( room, user )
    socket.join( room.id )
    user.room = room

    return room
  }

  private async _leaveRoom( socket: SocketIO.Socket, user?: User ) {
    user = user || await this.userStorageService.get( socket.id )

    if( user.room ) {
      socket.leave( user.room.id )
      this.roomService.leave( user.room, user )
      delete user.room
    }
  }

}
