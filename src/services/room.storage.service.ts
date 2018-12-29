import { UIDService } from './uid.service'
import { Service } from '@tsed/common'
import { StorageService } from '../classes/storage.class'
import { Room } from '../models/Room.model'

@Service()
export class RoomStorageService extends StorageService<Room> {

  constructor(
    protected uidService: UIDService,
  ) {
    super( uidService )
  }

  private createRoom(): Room {
    return new Room( this.getUniqueId() )
  }

  public async create(): Promise<Room> {
    const room = this.createRoom()
    this.save( room )
    return room
  }

  public async get( id: string ): Promise<Room> {
    return this.store.get( id )
  }

  public async save( room: Room ): Promise<Room> {
    this.store.set( room.id, room )
    return room
  }

  public async delete( id: string ): Promise<boolean> {
    return this.store.delete( id )
  }

}
