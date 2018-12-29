import { Room } from './Room.model'
import { Property, IgnoreProperty } from '@tsed/common'

export class User {

  @Property()
  socketid: string = ''

  @Property()
  id: string = ''

  @Property()
  nickname: string = ''

  @IgnoreProperty()
  room?: Room

}
