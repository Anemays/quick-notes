/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */

/* eslint-disable @typescript-eslint/no-unused-vars */
import { Test, TestingModule } from '@nestjs/testing';
import { NotesController } from './notes.controller';
import { NotesService } from './notes.service';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';

describe('NotesController', () => {
  let controller: NotesController;
  let service: NotesService;
  let s3Client: S3Client;

  const mockNote = {
    id: 1,
    title: 'Test Note',
    content: 'Test Content',
    fileUrl: null,
  } as const;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NotesController],
      providers: [
        {
          provide: NotesService,
          useValue: {
            findAll: jest.fn().mockResolvedValue([mockNote]),
            create: jest.fn().mockResolvedValue(mockNote),
            update: jest.fn().mockResolvedValue(mockNote),
            remove: jest.fn().mockResolvedValue(undefined),
            searchByTitle: jest.fn().mockResolvedValue([mockNote]),
          },
        },
        {
          provide: 'S3',
          useValue: {
            send: jest.fn().mockResolvedValue({}),
          },
        },
      ],
    }).compile();

    controller = module.get<NotesController>(NotesController);
    service = module.get<NotesService>(NotesService);
    s3Client = module.get<S3Client>('S3');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return an array of notes', async () => {
      const mockReq = { user: { userId: 1 } } as any;
      const result = await controller.findAll(mockReq);
      expect(result).toEqual([mockNote]);
      expect(service.findAll).toHaveBeenCalledWith(1);
    });
  });

  describe('searchByTitle', () => {
    it('should return filtered notes by title', async () => {
      const searchQuery = 'test';
      const mockReq = { user: { userId: 1 } } as any;
      const result = await controller.searchByTitle(mockReq, searchQuery);
      expect(result).toEqual([mockNote]);
      expect(service.searchByTitle).toHaveBeenCalledWith(searchQuery, 1);
    });

    it('should return all notes when search query is empty', async () => {
      const mockReq = { user: { userId: 1 } } as any;
      const result = await controller.searchByTitle(mockReq, '');
      expect(result).toEqual([mockNote]);
      // Note: searchByTitle is already mocked to return [mockNote]
    });
  });
  describe('create', () => {
    it('should create a note', async () => {
      const dto: CreateNoteDto = {
        title: 'Test Note',
        content: 'Test Content',
      };
      const mockReq = { user: { userId: 1 } } as any;
      const result = await controller.create(dto, mockReq);
      expect(result).toEqual(mockNote);
      expect(service.create).toHaveBeenCalledWith(dto, 1);
    });
  });

  describe('update', () => {
    it('should update a note', async () => {
      const dto: UpdateNoteDto = {
        title: 'Updated Note',
        content: 'Updated Content',
      };
      const mockReq = { user: { userId: 1 } } as any;
      const result = await controller.update(1, dto, mockReq);
      expect(result).toEqual(mockNote);
      expect(service.update).toHaveBeenCalledWith(1, dto, 1);
    });
  });

  describe('remove', () => {
    it('should remove a note', async () => {
      const mockReq = { user: { userId: 1 } } as any;
      await controller.remove(1, mockReq);
      expect(service.remove).toHaveBeenCalledWith(1, 1);
    });
  });

  describe('uploadNoteWithFile', () => {
    it('should upload a note with file', async () => {
      const file = {
        originalname: 'test.txt',
        mimetype: 'text/plain',
        buffer: Buffer.from('test'),
      } as Express.Multer.File;
      const dto: CreateNoteDto = {
        title: 'Test Note',
        content: 'Test Content',
      };
      const mockReq = { user: { userId: 1 } } as any;
      await controller.uploadNoteWithFile(file, dto, mockReq);
    });
  });
});
