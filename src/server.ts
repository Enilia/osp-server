import { ServerLoader, ServerSettings } from '@tsed/common'
import path from 'path'
import { json } from 'body-parser'
import '@tsed/socketio'

@ServerSettings({
  rootDir: path.resolve(__dirname),
  acceptMimes: ['application/json'],
})
export class Server extends ServerLoader {

  public $onMountingMiddlewares() {

    const compress = require('compression')

    this
      .use( json() )
      .use( compress({}) )

  }

  public $onReady() {
    console.log( 'Server started...' )
  }

  public $onServerInitError( err: any ) {
      console.error( err )
  }

}

new Server().start()
