import { SocketMiddlewareError, SocketErr, SocketEventName, Socket } from '@tsed/socketio'

const EVENT_ERROR = 'EVENT_ERROR'

@SocketMiddlewareError()
export class ErrorHandlerSocketMiddleware {
  async use(@SocketEventName eventName: string, @SocketErr err: any, @Socket socket: SocketIO.Socket) {
    console.error(err)
    socket.emit(EVENT_ERROR, { message: err.message })
  }
}
