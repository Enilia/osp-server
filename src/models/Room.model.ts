import * as SocketIO from 'socket.io'

export class Room {

  constructor(
    public id: string = ''
  ) {}

  clients: SocketIO.Socket[] = []

}
