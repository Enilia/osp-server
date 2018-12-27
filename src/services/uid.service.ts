import { Service } from '@tsed/common'

@Service()
export class UIDService {

  uid() {
    let a = 0
    let b = ''
    for(
      ; a++ < 6
      ; b += (8 ^ Math.random() * 16).toString(16)
    ) {}
    return b
  }

}
