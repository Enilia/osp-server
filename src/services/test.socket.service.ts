import * as SocketIO from 'socket.io'
import { SocketService, Nsp, IO, Input, Args, Socket, SocketSession } from '@tsed/socketio'

@SocketService('/test')
export class BaseTestSocketService {

  $onConnection(@Socket socket: SocketIO.Socket, @SocketSession session: SocketSession) {
  }

}

@SocketService('/test')
export class TestSocketService {

  @Nsp nsp: SocketIO.Namespace

  constructor(@IO private io: SocketIO.Server) {}

  @Input('testEvent')
  myMethod(@Args(0) userName: string, @Socket socket: SocketIO.Socket, @Nsp nsp: SocketIO.Namespace) {
      console.log(userName)
  }


  helloAll() {
    this.nsp.emit('hi', 'everyone!')
  }

}
