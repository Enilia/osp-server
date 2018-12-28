import { UIDService } from '../services/uid.service'

export abstract class StorageService {

  protected store = new Map()

  constructor(
    protected uidService: UIDService,
  ) {}

  protected getUniqueId(): string {
    let id: string
    do {
      id = this.uidService.uid()
    } while( this.store.has( id ) )
    return id
  }

}
