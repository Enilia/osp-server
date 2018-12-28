import { Service } from '@tsed/common'

@Service()
export class UIDService {

  uid() {
    let a = 0
    let b = ''
    for(
      ; a++ < 6
      ; b += (0 ^ Math.random() * 36).toString(36)
    ) {}
    return b
  }

}
