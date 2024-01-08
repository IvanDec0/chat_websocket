import {
    ConnectedSocket,
    MessageBody,
    OnGatewayConnection,
    OnGatewayDisconnect,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
  } from '@nestjs/websockets';
  import { Server, Socket } from 'socket.io';
  
  @WebSocketGateway({
    cors: {
      origin: '*',
    },
  })
  export class WebsocketGateway
    implements OnGatewayConnection, OnGatewayDisconnect
  {
    @WebSocketServer()
    server: Server;
  
    handleConnection(client: Socket) {
      console.log('New client connected', client.id);
    }
  
    handleDisconnect(client: Socket) {
      console.log('Client disconnected', client.id);
    }
  
    /* @SubscribeMessage('message')
    handleMessage(@ConnectedSocket() client: Socket, @MessageBody() data: any) {
      console.log(client.id + ': ' + data);
      this.server.emit('message', data);
    } */ // This is for the chat, the client sends and receives its own messages.

    @SubscribeMessage('message')
    handleMessage(@ConnectedSocket() client: Socket, @MessageBody() data: any) {
      console.log(client.id + ': ' + data);
      client.broadcast.emit('message', data);
    }
  }