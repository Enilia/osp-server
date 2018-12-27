import { Controller, Get, PathParams } from '@tsed/common'
import { TestSocketService } from '../services/test.socket.service'

@Controller('/test')
export class TestController {

  constructor(
    private testSocketService: TestSocketService
  ) {}

  @Get('/:id')
  public async get(
    @PathParams('id') id: String
  ) {
    this.testSocketService.helloAll()
    return id
  }

}
