import { Controller, Get, PathParams } from '@tsed/common';

@Controller('/test')
export class TestController {

  @Get('/:id')
  public async get(
    @PathParams('id') id: String
  ) {
    return id
  }

}
