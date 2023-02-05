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
  constructor(
    private readonly chatService: ChatService,
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @WebSocketServer() server: Server;

  @SubscribeMessage('sendMessage')
  async sendMessage(
    @MessageBody() body: { text: string },
    @ConnectedSocket() socket: Socket,
  ) {
    const forwardedId = socket.data.forwardedId;
    const currentRoom = socket.data.room;
    const userId = socket.data.userId;

    const message = await this.chatService.createMessage(
      body.text,
      userId,
      forwardedId,
    );

    this.server.in(String(currentRoom)).emit('onMessage', {
      ...message,
      room: currentRoom,
    });
  }

  async handleConnection(socket: Socket) {
      const token = socket.handshake.auth.token;

      if (!token) {
        socket.disconnect();
        return;
      }

      const user = await this.authService.verifyAndReturnUser(token);

      if (!user) {
        socket.disconnect();
        return;
      }

      socket.data.userId = user.id;

      const userChats = await this.chatService.getUserChats(user.id);

      socket.emit('getChats', userChats);

      socket.on('joinRoom', async (data: { user: string; item?: string }) => {
        const forwardedId = Number(data.user);
        const forwardedItemId = Number(data.item);

        console.log('joined room', data.user, data.item);

        const isForwardedNaN = Number.isNaN(forwardedId);
        const isItemNan = Number.isNaN(forwardedItemId);

        if (forwardedId == user.id) {
          console.log('disconnect ID IS THE SAME');
          socket.disconnect();
          return;
        }

        if (!forwardedId || isForwardedNaN) {
          console.log(forwardedId);
          socket.disconnect();
          return;
        }

        socket.data.forwardedId = forwardedId;

        // Get forwarded info info
        const getUser = await this.userService.getProfile(forwardedId);
        // Get a time info

        if (!getUser) {
          socket.disconnect();
          return;
        }

        const getCurrentRoom = await this.chatService.getCurrentRoom(
          socket.data.forwardedId,
          user.id,
        );

        if (getCurrentRoom) {
          if (!getUser) {
            socket.disconnect();
            return;
          }
        }

        socket.data.room = getCurrentRoom;

        // Disconnect from all previous rooms
        socket.rooms.forEach(async (room) => {
          if (room) {
            await socket.leave(room);
          }
        });

        await socket.join(String(getCurrentRoom));

        // Set item to room
        if (data.item) {
          if (isItemNan) {
            socket.disconnect();
            return;
          }
          const room = await this.chatService.setItemToRoom(
            getCurrentRoom,
            forwardedId,
            forwardedItemId,
          );
          // If there is no room updated disconnect
          if (!room) {
            socket.disconnect();
            return;
          }
          socket.emit('getItem', room.item);
        } else {
          // Just send and item
          const roomItem = await this.chatService.getRoomItem(getCurrentRoom);
          socket.emit('getItem', roomItem);
        }

        // Set message to seen when second user connected to socket
        await this.chatService.markSeen(getCurrentRoom, user.id);

        const roomMessages = await this.chatService.getRoomMessages(
          getCurrentRoom,
        );

        // Get the previous chat messages
        this.server
          .in(String(getCurrentRoom))
          .emit('getRoomMessages', roomMessages);

        // Get info about forwarded user in a room
        socket.emit('getUser', getUser);
      });
  }

  handleDisconnect(client: any) {
    console.log('disconesso');
  }
}
