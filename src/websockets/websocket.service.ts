import { Injectable } from '@nestjs/common';
import { Client } from './client.interface';

@Injectable()
export class WebsocketService {
  private clients: Record<string, Client> = {};

  onClientConnected(client: Client) {
    this.clients[client.id] = client;
  }

  onClientDisconnected(id: string) {
    delete this.clients[id];
  }

  getClients() {
    return Object.values(this.clients);
  }
}
