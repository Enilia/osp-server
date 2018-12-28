import * as SocketIO from 'socket.io'
import { User } from '../models/user.model'
import { UIDService } from './uid.service'
import { Service } from '@tsed/common'

@Service()
export class UserStorageService {

  private store = new Map()

  constructor(
    private uidService: UIDService,
  ) {}

  private createUser(): User {
    const user = new User()
    user.id = this.getUniqueId()
    return user
  }

  private getUniqueId(): string {
    let id: string
    do {
      id = this.uidService.uid()
    } while( this.store.has( id ) )
    return id
  }

  public async create( socket: SocketIO.Socket ): Promise<User> {
    const user = this.createUser()
    this.save( socket, user )
    return user
  }

  public async get( socket: SocketIO.Socket ): Promise<User> {
    return this.store.get( socket.id )
  }

  public async save( socket: SocketIO.Socket, user: User ): Promise<User> {
    this.store.set( socket.id, user )
    return user
  }

  public async delete( socket: SocketIO.Socket ): Promise<boolean> {
    return this.store.delete( socket.id )
  }

}
