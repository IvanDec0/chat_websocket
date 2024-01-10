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
import { WebsocketService } from './websocket.service';

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

  constructor(private readonly webSocketService: WebsocketService) {}

  handleConnection(socket: Socket) {
    const { name, token } = socket.handshake.auth;
    if (!name && !token) {
      socket.disconnect();
      return;
    }

    // Add client to the list
    this.webSocketService.onClientConnected({
      id: socket.id,
      name,
      token,
    });

    // List of connected clients
    this.server.emit('on-clients-changed', this.webSocketService.getClients());
  }

  handleDisconnect(socket: any) {
    this.webSocketService.onClientDisconnected(socket.id);
    this.server.emit('on-clients-changed', this.webSocketService.getClients());
  }

  @SubscribeMessage('send-message')
  handleMessage(
    @MessageBody() message: string,
    @ConnectedSocket() client: Socket,
  ) {
    const { name, token } = client.handshake.auth;

    if (!message) {
      return;
    }

    this.server.emit('on-message', {
      userId: client.id,
      message,
      name,
    });
  }
}
