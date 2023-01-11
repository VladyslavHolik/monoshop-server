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
import { UserService } from 'src/user/user.service';

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
    private readonly userService: UserService,
  ) {
    this.clientSize = 0;
  }

  @WebSocketServer() server: Server;

  @SubscribeMessage('sendMessage')
  async sendMessage(
    @MessageBody() body: { text: string },
    @ConnectedSocket() socket: Socket,
  ) {
    const user = await this.authService.verifyAndReturnUser(
      socket.handshake.auth.token as string,
    );

    const forwardedId = socket.data.forwardedId;
    const currentRoom = socket.data.room;

    const hasSeen = this.clientSize === 2 ? true : false;

    const message = await this.chatService.createMessage(
      body.text,
      user.id,
      forwardedId,
      hasSeen,
    );

    this.server.in(String(currentRoom)).emit('onMessage', {
      ...message,
      room: currentRoom,
      clientSize: this.clientSize,
    });

    console.log(socket.rooms);

    if (hasSeen) {
      await this.chatService.markSeenAll(currentRoom);

      const roomMessages = await this.chatService.getRoomMessages(currentRoom);

      socket.emit('getRoomMessages', roomMessages);
    }
  }

  async handleConnection(socket: Socket) {
    this.server.once('connection', async (socket) => {
      const token = socket.handshake.auth.token;

      if (!token) {
        socket.disconnect();
        return;
      }

      const user = await this.authService.verifyAndReturnUser(token);

      if (!user || Object.keys(user).length === 0) {
        socket.disconnect();
        return;
      }

      const userChats = await this.chatService.getUserChats(user.id);

      socket.emit('getChats', userChats);

      socket.on('joinRoom', async (forwardedId) => {
        socket.data.forwardedId = Number(forwardedId);
        socket.data.userId = user.id;

        if (forwardedId == user.id) {
          socket.disconnect();
          return;
        }

        if (!forwardedId) {
          socket.disconnect();
          return;
        }

        const getUser = await this.userService.getUserById(Number(forwardedId));

        if (!getUser) {
          socket.disconnect();
        }

        socket.emit('getUser', getUser);

        const getCurrentRoom = await this.chatService.getCurrentRoom(
          socket.data.forwardedId,
          user.id,
        );

        socket.data.room = getCurrentRoom;

        socket.rooms.forEach(async (room) => {
          if (room) {
            await socket.leave(room);
          }
        });

        await socket.join(String(getCurrentRoom));

        if (!getCurrentRoom) {
          socket.disconnect();
        }

        // Set message to seen when second user connected to socket
        await this.chatService.markSeen(getCurrentRoom, user.id);

        const roomMessages = await this.chatService.getRoomMessages(
          getCurrentRoom,
        );

        this.clientSize = (
          await this.server.of('/').in(String(getCurrentRoom)).allSockets()
        ).size;

        socket.emit('getRoomMessages', roomMessages);
      });
    });
  }

  handleDisconnect(client: any) {
    console.log('disconesso');
    this.clientSize--;
  }
}
