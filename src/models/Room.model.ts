import { User } from './user.model'
import { Property } from '@tsed/common'

export class Room {

  private users = new Set<User>()

  get hasClients() { return this.users.size > 0 }

  @Property()
  get clients() { return Array.from(this.users) }

  @Property()
  public id: string

  constructor(
    id: string
  ) {
    this.id = id
  }

  join( user: User ) {
    this.users.add( user )
  }

  leave( user: User ) {
    this.users.delete( user )
  }

}
