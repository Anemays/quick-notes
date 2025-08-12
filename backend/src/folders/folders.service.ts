import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateFolderDto } from './dto/create-folder.dto';
import { UpdateFolderDto } from './dto/update-folder.dto';

/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */

@Injectable()
export class FoldersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createFolderDto: CreateFolderDto, userId: number) {
    return await this.prisma.folder.create({
      data: {
        ...createFolderDto,
        userId,
      },
      include: {
        notes: true,
        _count: {
          select: {
            notes: true,
          },
        },
      },
    });
  }

  async findAll(userId: number) {
    return await this.prisma.folder.findMany({
      where: { userId },
      include: {
        notes: {
          orderBy: { updatedAt: 'desc' },
        },
        _count: {
          select: { notes: true },
        },
      },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: number, userId: number) {
    const folder = await this.prisma.folder.findFirst({
      where: { id, userId },
      include: {
        notes: {
          orderBy: { updatedAt: 'desc' },
        },
        _count: {
          select: { notes: true },
        },
      },
    });

    if (!folder) {
      throw new NotFoundException('Folder not found');
    }

    return folder;
  }

  async update(id: number, updateFolderDto: UpdateFolderDto, userId: number) {
    const folder = await this.prisma.folder.findFirst({
      where: { id, userId },
    });

    if (!folder) {
      throw new NotFoundException('Folder not found');
    }

    return await this.prisma.folder.update({
      where: { id },
      data: updateFolderDto,
      include: {
        notes: true,
        _count: {
          select: { notes: true },
        },
      },
    });
  }

  async remove(id: number, userId: number) {
    const folder = await this.prisma.folder.findFirst({
      where: { id, userId },
    });

    if (!folder) {
      throw new NotFoundException('Folder not found');
    }

    // Move all notes in this folder to no folder (null)
    await this.prisma.note.updateMany({
      where: { folderId: id },
      data: { folderId: null },
    });

    return await this.prisma.folder.delete({
      where: { id },
    });
  }

  async moveNoteToFolder(
    noteId: number,
    folderId: number | null,
    userId: number,
  ) {
    // Check if note belongs to user
    const note = await this.prisma.note.findFirst({
      where: { id: noteId, userId },
    });

    if (!note) {
      throw new NotFoundException('Note not found');
    }

    // If folderId is provided, check if folder belongs to user
    if (folderId !== null) {
      const folder = await this.prisma.folder.findFirst({
        where: { id: folderId, userId },
      });

      if (!folder) {
        throw new NotFoundException('Folder not found');
      }
    }

    return this.prisma.note.update({
      where: { id: noteId },
      data: { folderId },
      include: {
        folder: true,
      },
    });
  }
}
