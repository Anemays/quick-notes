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
    it('should return array of notes', async () => {
      const result = await controller.findAll();
      expect(result).toEqual([mockNote]);
      const findAllSpy = jest.spyOn(service, 'findAll');
      expect(findAllSpy).toHaveBeenCalled();
    });
  });

  describe('searchByTitle', () => {
    it('should search notes by title', async () => {
      const searchQuery = 'Test';

      const result = await controller.searchByTitle(searchQuery);

      expect(result).toEqual([mockNote]);
    });

    it('should handle empty search query', async () => {
      const result = await controller.searchByTitle('');

      expect(result).toEqual([mockNote]);
    });
  });
  describe('create', () => {
    it('should create a note', async () => {
      const dto: CreateNoteDto = {
        title: 'Test Note',
        content: 'Test Content',
      };

      const result = await controller.create(dto);
      expect(result).toEqual(mockNote);
      const createSpy = jest.spyOn(service, 'create');
      expect(createSpy).toHaveBeenCalledWith(dto);
    });
  });

  describe('update', () => {
    it('should update a note', async () => {
      const dto: UpdateNoteDto = {
        title: 'Updated Note',
      };

      const result = await controller.update(1, dto);
      expect(result).toEqual(mockNote);
      const updateSpy = jest.spyOn(service, 'update');
      expect(updateSpy).toHaveBeenCalledWith(1, dto);
    });
  });

  describe('remove', () => {
    it('should remove a note', async () => {
      await controller.remove(1);
      const removeSpy = jest.spyOn(service, 'remove');
      expect(removeSpy).toHaveBeenCalledWith(1);
    });
  });

  describe('uploadNoteWithFile', () => {
    it('should upload file and create note', async () => {
      const file: Express.Multer.File = {
        originalname: 'test.txt',
        mimetype: 'text/plain',
        buffer: Buffer.from('test'),
        size: 4,
        fieldname: 'file',
        encoding: '7bit',
        destination: '',
        filename: '',
        path: '',
      } as Express.Multer.File;

      const dto: CreateNoteDto = {
        title: 'Test Note',
        content: 'Test Content',
      };

      await controller.uploadNoteWithFile(file, dto);

      const s3SendSpy = jest.spyOn(s3Client, 'send');
      expect(s3SendSpy).toHaveBeenCalledWith(expect.any(PutObjectCommand));

      const createSpy = jest.spyOn(service, 'create');
      expect(createSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          title: dto.title,
          content: dto.content,
        }),
      );
    });
  });
});
