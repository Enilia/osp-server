import * as SocketIO from 'socket.io'
import { SocketService, Nsp, IO, Input, Args, Socket } from '@tsed/socketio'

@SocketService()
export class TestSocketService {

  @Nsp nsp: SocketIO.Namespace

  constructor(@IO private io: SocketIO.Server) {}

  @Input("eventName")
  myMethod(@Args(0) userName: string, @Socket socket: SocketIO.Socket, @Nsp nsp: SocketIO.Namespace) {
      console.log(userName);
  }


  helloAll() {
    this.nsp.emit('hi', 'everyone!')
  }

}
