import { Room } from './Room.model'
import { Property, IgnoreProperty } from '@tsed/common'

export class User {

  @Property()
  id: string = ''

  @Property()
  nickname: string = ''

  @IgnoreProperty()
  room: Room = null

}
