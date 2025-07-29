import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateNoteDto } from './dto/create-note.dto';

@Injectable()
export class NotesService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.note.findMany({ orderBy: { createdAt: 'desc' } });
  }

  searchByTitle(searchTerm: string) {
    return this.prisma.note.findMany({
      where: {
        title: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  create(data: CreateNoteDto) {
    return this.prisma.note.create({ data });
  }

  update(id: number, data: Partial<CreateNoteDto>) {
    return this.prisma.note.update({ where: { id }, data });
  }

  remove(id: number) {
    return this.prisma.note.delete({ where: { id } });
  }
}
