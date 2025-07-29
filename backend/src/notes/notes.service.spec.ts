import { Test, TestingModule } from '@nestjs/testing';
import { NotesService } from './notes.service';
import { PrismaService } from '../prisma.service';

describe('NotesService', () => {
  let service: NotesService;
  let prisma: PrismaService;

  const mockNote = {
    id: 1,
    title: 'Test Note',
    content: 'Test Content',
    fileUrl: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotesService,
        {
          provide: PrismaService,
          useValue: {
            note: {
              findMany: jest.fn().mockResolvedValue([mockNote]),
              create: jest.fn().mockResolvedValue(mockNote),
              update: jest.fn().mockResolvedValue(mockNote),
              delete: jest.fn().mockResolvedValue(mockNote),
            },
          },
        },
      ],
    }).compile();

    service = module.get<NotesService>(NotesService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  describe('findAll', () => {
    it('should return array of notes', async () => {
      const notes = await service.findAll();
      expect(notes).toEqual([mockNote]);
      const findManySpy = jest.spyOn(prisma.note, 'findMany');
      expect(findManySpy).toHaveBeenCalledWith({
        orderBy: { createdAt: 'desc' },
      });
    });
  });

  describe('create', () => {
    it('should create a note', async () => {
      const dto = {
        title: 'Test Note',
        content: 'Test Content',
      };

      const note = await service.create(dto);
      expect(note).toEqual(mockNote);
      const createSpy = jest.spyOn(prisma.note, 'create');
      expect(createSpy).toHaveBeenCalledWith({
        data: dto,
      });
    });
  });

  describe('update', () => {
    it('should update a note', async () => {
      const dto = {
        title: 'Updated Note',
      };

      const note = await service.update(1, dto);
      expect(note).toEqual(mockNote);
      const updateSpy = jest.spyOn(prisma.note, 'update');
      expect(updateSpy).toHaveBeenCalledWith({
        where: { id: 1 },
        data: dto,
      });
    });
  });

  describe('remove', () => {
    it('should remove a note', async () => {
      await service.remove(1);
      const deleteSpy = jest.spyOn(prisma.note, 'delete');
      expect(deleteSpy).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });
  });

  describe('searchByTitle', () => {
    it('should search notes by title', async () => {
      const searchQuery = 'Test';
      const searchResults = [mockNote];

      jest.spyOn(prisma.note, 'findMany').mockResolvedValue(searchResults);

      const notes = await service.searchByTitle(searchQuery);
      expect(notes).toEqual(searchResults);

      const findManySpy = jest.spyOn(prisma.note, 'findMany');
      expect(findManySpy).toHaveBeenCalledWith({
        where: {
          title: {
            contains: searchQuery,
            mode: 'insensitive',
          },
        },
        orderBy: { createdAt: 'desc' },
      });
    });

    it('should handle empty search query', async () => {
      const searchQuery = '';
      const searchResults = [mockNote];

      jest.spyOn(prisma.note, 'findMany').mockResolvedValue(searchResults);

      const notes = await service.searchByTitle(searchQuery);
      expect(notes).toEqual(searchResults);

      const findManySpy = jest.spyOn(prisma.note, 'findMany');
      expect(findManySpy).toHaveBeenCalledWith({
        where: {
          title: {
            contains: searchQuery,
            mode: 'insensitive',
          },
        },
        orderBy: { createdAt: 'desc' },
      });
    });

    it('should return empty array when no matches found', async () => {
      const searchQuery = 'NonExistent';

      jest.spyOn(prisma.note, 'findMany').mockResolvedValue([]);

      const notes = await service.searchByTitle(searchQuery);
      expect(notes).toEqual([]);

      const findManySpy = jest.spyOn(prisma.note, 'findMany');
      expect(findManySpy).toHaveBeenCalledWith({
        where: {
          title: {
            contains: searchQuery,
            mode: 'insensitive',
          },
        },
        orderBy: { createdAt: 'desc' },
      });
    });
  });
});
