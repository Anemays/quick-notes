import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateNoteDto } from './dto/create-note.dto';

@Injectable()
export class NotesService {
  constructor(private prisma: PrismaService) {}

  findAll(userId: number) {
    return this.prisma.note.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  searchByTitle(searchTerm: string, userId: number) {
    return this.prisma.note.findMany({
      where: {
        userId,
        title: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  create(data: CreateNoteDto, userId: number) {
    return this.prisma.note.create({
      data: {
        ...data,
        userId,
      },
    });
  }

  update(id: number, data: Partial<CreateNoteDto>, userId: number) {
    return this.prisma.note.update({
      where: {
        id,
        userId,
      },
      data,
    });
  }

  remove(id: number, userId: number) {
    return this.prisma.note.delete({
      where: {
        id,
        userId,
      },
    });
  }
}
