import * as SocketIO from 'socket.io'
import { User } from '../models/user.model'
import { UIDService } from './uid.service'
import { Service } from '@tsed/common'
import { StorageService } from '../classes/storage.class';

@Service()
export class UserStorageService extends StorageService {

  constructor(
    protected uidService: UIDService,
  ) {
    super( uidService )
  }

  private createUser(): User {
    const user = new User()
    user.id = this.getUniqueId()
    return user
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
