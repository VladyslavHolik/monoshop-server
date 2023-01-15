import { BadRequestException, Injectable } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { Message } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ChatService {
  constructor(private readonly prisma: PrismaService) {}

  async createMessage(message: string, userId: number, forwardedId: number) {
    const room = await this.getRoom(forwardedId, userId);

    return await this.prisma.message.create({
      data: {
        text: message,
        userId: userId,
        roomId: room.id,
        delivered: true,
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

  async getRoomItem(roomId: number) {
    return await this.prisma.item.findFirst({
      where: {
        roomId,
      },
    });
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

  async setItemToRoom(roomId: number, forwardedId: number, itemId: number) {
    const room = await this.prisma.room.findFirst({
      where: {
        id: roomId,
        users: {
          some: {
            id: forwardedId,
          },
        },
      },
    });

    const item = await this.prisma.item.findFirst({
      where: {
        id: itemId,
      },
    });

    if (room && item) {
      return await this.prisma.room.update({
        where: {
          id: roomId,
        },
        data: {
          item: {
            connect: { id: itemId },
          },
        },
        select: {
          item: true,
          id: true,
        },
      });
    }
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
        id: true,
        users: {
          select: {
            fullName: true,
            id: true,
            image: true,
            lastActivity: true,
          },
          where: {
            id: {
              not: userId,
            },
          },
        },
        item: true,
        message: {
          take: 1,
          select: {
            markedSeen: true,
            id: true,
            date: true,
            userId: true,
          },
          where: {
            userId: {
              not: userId,
            },
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
        message: {
          ...room.message[0],
        },
        users: {
          ...room.users[0],
        },
      };
    });
  }
}
