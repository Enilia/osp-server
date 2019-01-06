import { User } from './user.model'
import { Property } from '@tsed/common'

export class Room {

  private users = new Set<User>()

  get hasClients() { return this.users.size > 0 }

  @Property()
  get clients() { return Array.from(this.users) }

  @Property()
  get owner() { return this.users.values().next().value }

  @Property()
  public id: string

  constructor(
    id: string
  ) {
    this.id = id
  }

  join( user: User ): void {
    this.users.add( user )
  }

  leave( user: User ): void {
    this.users.delete( user )
  }

}
