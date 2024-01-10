import { Module } from '@nestjs/common';
import { GatewayModule } from './websockets/websocket.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [GatewayModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    })],
  controllers: [],
  providers: [],
})
export class AppModule {}
