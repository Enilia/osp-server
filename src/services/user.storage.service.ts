import { User } from '../models/user.model'
import { UIDService } from './uid.service'
import { Service } from '@tsed/common'
import { StorageService } from '../classes/storage.class'

@Service()
export class UserStorageService extends StorageService<User> {

  constructor(
    protected uidService: UIDService,
  ) {
    super( uidService )
  }

  private createUser( socketid: string ): User {
    const user = new User()
    user.id = this.getUniqueId()
    user.socketid = socketid
    return user
  }

  public async create( socketid: string ): Promise<User> {
    const user = this.createUser( socketid )
    this.save( user )
    return user
  }

  public async get( socketid: string ): Promise<User> {
    return this.store.get( socketid )
  }

  public async save( user: User ): Promise<User> {
    this.store.set( user.socketid, user )
    return user
  }

  public async delete( socketid: string ): Promise<boolean> {
    return this.store.delete( socketid )
  }

}
