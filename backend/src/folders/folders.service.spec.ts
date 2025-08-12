import { Test, TestingModule } from '@nestjs/testing';
import { FoldersService } from './folders.service';
import { PrismaService } from '../prisma.service';

/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

describe('FoldersService', () => {
  let service: FoldersService;
  let prisma: jest.Mocked<PrismaService>;

  const mockFolder = {
    id: 1,
    name: 'Test Folder',
    color: '#007ACC',
    userId: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockNote = {
    id: 1,
    title: 'Test Note',
    content: 'Test Content',
    fileUrl: null,
    folderId: 1,
    userId: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FoldersService,
        {
          provide: PrismaService,
          useValue: {
            folder: {
              create: jest.fn(),
              findMany: jest.fn(),
              findFirst: jest.fn(),
              findUnique: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
            note: {
              findFirst: jest.fn(),
              update: jest.fn(),
              updateMany: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<FoldersService>(FoldersService);
    prisma = module.get<PrismaService>(
      PrismaService,
    ) as jest.Mocked<PrismaService>;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a folder', async () => {
      const dto = {
        name: 'Test Folder',
        color: '#007ACC',
      };

      jest.spyOn(prisma.folder, 'create').mockResolvedValue(mockFolder);

      const folder = await service.create(dto, 1);
      expect(folder).toEqual(mockFolder);

      const createSpy = jest.spyOn(prisma.folder, 'create');
      expect(createSpy).toHaveBeenCalledWith({
        data: { ...dto, userId: 1 },
        include: {
          notes: true,
          _count: {
            select: { notes: true },
          },
        },
      });
    });
  });

  describe('findAll', () => {
    it('should return all folders for a user', async () => {
      jest.spyOn(prisma.folder, 'findMany').mockResolvedValue([mockFolder]);

      const folders = await service.findAll(1);
      expect(folders).toEqual([mockFolder]);

      const findManySpy = jest.spyOn(prisma.folder, 'findMany');
      expect(findManySpy).toHaveBeenCalledWith({
        where: { userId: 1 },
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
    });
  });

  describe('findOne', () => {
    it('should return a specific folder', async () => {
      jest.spyOn(prisma.folder, 'findFirst').mockResolvedValue(mockFolder);

      const folder = await service.findOne(1, 1);
      expect(folder).toEqual(mockFolder);

      const findFirstSpy = jest.spyOn(prisma.folder, 'findFirst');
      expect(findFirstSpy).toHaveBeenCalledWith({
        where: { id: 1, userId: 1 },
        include: {
          notes: {
            orderBy: { updatedAt: 'desc' },
          },
          _count: {
            select: { notes: true },
          },
        },
      });
    });
  });

  describe('update', () => {
    it('should update a folder', async () => {
      const dto = {
        name: 'Updated Folder',
        color: '#FF0000',
      };

      const updatedFolder = { ...mockFolder, ...dto };
      jest.spyOn(prisma.folder, 'findFirst').mockResolvedValue(mockFolder);
      jest.spyOn(prisma.folder, 'update').mockResolvedValue(updatedFolder);

      const folder = await service.update(1, dto, 1);
      expect(folder).toEqual(updatedFolder);

      const findFirstSpy = jest.spyOn(prisma.folder, 'findFirst');
      expect(findFirstSpy).toHaveBeenCalledWith({
        where: { id: 1, userId: 1 },
      });

      const updateSpy = jest.spyOn(prisma.folder, 'update');
      expect(updateSpy).toHaveBeenCalledWith({
        where: { id: 1 },
        data: dto,
        include: {
          notes: true,
          _count: {
            select: {
              notes: true,
            },
          },
        },
      });
    });
  });

  describe('remove', () => {
    it('should delete a folder', async () => {
      jest.spyOn(prisma.folder, 'findFirst').mockResolvedValue(mockFolder);
      jest.spyOn(prisma.folder, 'delete').mockResolvedValue(mockFolder);

      const folder = await service.remove(1, 1);
      expect(folder).toEqual(mockFolder);

      const findFirstSpy = jest.spyOn(prisma.folder, 'findFirst');
      expect(findFirstSpy).toHaveBeenCalledWith({
        where: { id: 1, userId: 1 },
      });

      const deleteSpy = jest.spyOn(prisma.folder, 'delete');
      expect(deleteSpy).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });
  });

  describe('moveNoteToFolder', () => {
    it('should move a note to a folder', async () => {
      const updatedNote = { ...mockNote, folderId: 2 };
      jest.spyOn(prisma.note, 'findFirst').mockResolvedValue(mockNote);
      jest.spyOn(prisma.folder, 'findFirst').mockResolvedValue(mockFolder);
      jest.spyOn(prisma.note, 'update').mockResolvedValue(updatedNote);

      const note = await service.moveNoteToFolder(1, 2, 1);
      expect(note).toEqual(updatedNote);

      const findFirstSpy = jest.spyOn(prisma.note, 'findFirst');
      expect(findFirstSpy).toHaveBeenCalledWith({
        where: { id: 1, userId: 1 },
      });

      const updateSpy = jest.spyOn(prisma.note, 'update');
      expect(updateSpy).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { folderId: 2 },
        include: {
          folder: true,
        },
      });
    });

    it('should remove note from folder when folderId is null', async () => {
      const updatedNote = { ...mockNote, folderId: null };
      jest.spyOn(prisma.note, 'findFirst').mockResolvedValue(mockNote);
      jest.spyOn(prisma.note, 'update').mockResolvedValue(updatedNote);

      const note = await service.moveNoteToFolder(1, null, 1);
      expect(note).toEqual(updatedNote);

      const findFirstSpy = jest.spyOn(prisma.note, 'findFirst');
      expect(findFirstSpy).toHaveBeenCalledWith({
        where: { id: 1, userId: 1 },
      });

      const updateSpy = jest.spyOn(prisma.note, 'update');
      expect(updateSpy).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { folderId: null },
        include: {
          folder: true,
        },
      });
    });
  });
});
