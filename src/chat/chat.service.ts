import { BadRequestException, Injectable } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { Message } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ChatService {
  constructor(private readonly prisma: PrismaService) {}

  async createMessage(
    message: string,
    userId: number,
    forwardedId: number,
    hasSeen: boolean,
  ) {
    const room = await this.getRoom(forwardedId, userId);

    return await this.prisma.message.create({
      data: {
        text: message,
        userId: userId,
        roomId: room.id,
        delivered: true,
        markedSeen: hasSeen,
      },
    });
  }

  async getRoom(forwardedId: number, userId: number) {
    const forwarded = await this.prisma.user.findFirst({
      where: {
        id: forwardedId,
      },
    });

    if (forwarded.id && userId) {
      const room = await this.prisma.room.findFirst({
        where: {
          users: {
            every: {
              id: {
                in: [forwarded.id, userId],
              },
            },
          },
        },
      });

      if (!room) {
        const room = await this.prisma.room.create({
          data: {
            users: {
              connect: [{ id: userId }, { id: forwardedId }],
            },
          },
        });

        return room;
      }

      return room;
    }
  }

  async getMessages() {
    return await this.prisma.message.findMany();
  }

  async getCurrentRoom(forwardedId: number, userId: number) {
    if (forwardedId) {
      const room = await this.getRoom(forwardedId, userId);

      return room.id;
    }
  }

  async markSeen(roomId: number, userId: number) {
    return await this.prisma.message.updateMany({
      data: {
        markedSeen: true,
      },
      where: {
        roomId: roomId,
        userId: {
          not: userId,
        },
      },
    });
  }

  async markSeenAll(roomId: number) {
    return await this.prisma.message.updateMany({
      data: {
        markedSeen: true,
      },
      where: {
        roomId: {
          equals: roomId,
        },
      },
    });
  }

  async getRoomMessages(roomId: number) {
    const messages = await this.prisma.message.findMany({
      where: {
        roomId,
      },
      orderBy: {
        id: 'asc',
      },
    });

    return messages;
  }

  async getUserChats(userId: number) {
    const rooms = await this.prisma.room.findMany({
      where: {
        users: {
          some: {
            id: userId,
          },
        },
        NOT: [
          {
            message: {
              every: {
                roomId: {
                  lt: 1,
                },
              },
            },
          },
        ],
      },
      select: {
        users: {
          select: {
            fullName: true,
            id: true,
            image: true,
          },
          where: {
            id: {
              not: userId,
            },
          },
        },
        message: {
          take: 1,
          select: {
            markedSeen: true,
            id: true,
          },
          orderBy: {
            id: 'desc',
          },
        },
      },
    });

    return rooms.map((room) => {
      return {
        ...room,
        users: {
          ...room.users[0],
        },
      };
    });
  }
}
