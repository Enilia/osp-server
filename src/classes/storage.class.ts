import { UIDService } from '../services/uid.service'

export abstract class StorageService<V> {

  protected store = new Map<string, V>()

  get size() { return this.store.size }

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
