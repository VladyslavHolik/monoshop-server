import { Controller, Req, UseGuards } from '@nestjs/common';
import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { ChatService } from './chat.service';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { AuthRequest } from 'src/auth/jwt.strategy';
import { Message } from '@prisma/client';
import { AuthService } from 'src/auth/auth.service';

const users: Record<string, string> = {};

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  serveClient: false,
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  clientSize: number;

  constructor(
    private readonly chatService: ChatService,
    private readonly authService: AuthService,
  ) {}

  @WebSocketServer() server: Server;

  @SubscribeMessage('sendMessage')
  async sendMessage(
    @MessageBody() body: { text: string },
    @ConnectedSocket() socket: Socket,
  ) {
    const user = await this.authService.verifyAndReturnUser(
      socket.handshake.headers.authorization as string,
    );

    const forwardedId = Number(socket.handshake.query.forwarded);

    // Mark create message as seen
    if (this.clientSize === 2) {
      const message = await this.chatService.createMessage(
        body.text,
        user.id,
        forwardedId,
        true,
      );

      return this.server.to(String(message.roomId)).emit('onMessage', {
        ...message,
        room: message.roomId,
        clientSize: this.clientSize,
      });
    }

    const message = await this.chatService.createMessage(
      body.text,
      user.id,
      forwardedId,
    );

    this.server.to(String(message.roomId)).emit('onMessage', {
      ...message,
      room: message.roomId,
      clientSize: this.clientSize,
    });
  }

  @SubscribeMessage('onMessage')
  async handleConnection(socket: Socket) {
    const token = socket.handshake.headers.authorization as string;
    const user = await this.authService.verifyAndReturnUser(token);
    if (!user) {
      socket.disconnect();
      console.log('disconnected');
    }
    const forwardedId = socket.handshake.query.forwarded;
    const getCurrentRoom = await this.chatService.getCurrentRoom(
      Number(forwardedId),
      user.id,
    );
    const roomMessages = await this.chatService.getRoomMessages(getCurrentRoom);

    await this.chatService.markSeen(getCurrentRoom, user.id);

    this.server.on('connection', async (socket) => {
      socket.join(String(getCurrentRoom));

      const clientSize = this.server.sockets.adapter.rooms.get(
        String(getCurrentRoom),
      ).size;

      this.clientSize = clientSize;

      // socket.emit('onMessage', roomMessages);

      socket.on('sendMessage', async () => {});
    });
  }
  handleDisconnect(client: any) {
    this.clientSize--;
  }
}
