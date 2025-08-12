import { Test, TestingModule } from '@nestjs/testing';
import { FoldersController } from './folders.controller';
import { FoldersService } from './folders.service';
import { AuthenticatedRequest } from '../types/auth.interface';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

/* eslint-disable @typescript-eslint/no-unsafe-assignment */

describe('FoldersController', () => {
  let controller: FoldersController;
  let service: FoldersService;

  const mockRequest: AuthenticatedRequest = {
    user: { id: 1 },
  } as AuthenticatedRequest;

  const mockFolder = {
    id: 1,
    name: 'Test Folder',
    color: '#007ACC',
    userId: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
    notes: [],
    _count: {
      notes: 0,
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FoldersController],
      providers: [
        {
          provide: FoldersService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
            moveNoteToFolder: jest.fn(),
          },
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<FoldersController>(FoldersController);
    service = module.get<FoldersService>(FoldersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a folder', async () => {
      const dto = { name: 'Test Folder', color: '#007ACC' };
      jest.spyOn(service, 'create').mockResolvedValue(mockFolder);

      const result = await controller.create(dto, mockRequest);
      expect(result).toEqual(mockFolder);
      expect(service.create).toHaveBeenCalledWith(dto, 1);
    });
  });

  describe('findAll', () => {
    it('should return all folders', async () => {
      jest.spyOn(service, 'findAll').mockResolvedValue([mockFolder]);

      const result = await controller.findAll(mockRequest);
      expect(result).toEqual([mockFolder]);
      expect(service.findAll).toHaveBeenCalledWith(1);
    });
  });

  describe('findOne', () => {
    it('should return a folder', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(mockFolder);

      const result = await controller.findOne('1', mockRequest);
      expect(result).toEqual(mockFolder);
      expect(service.findOne).toHaveBeenCalledWith(1, 1);
    });
  });

  describe('update', () => {
    it('should update a folder', async () => {
      const dto = { name: 'Updated Folder' };
      const updatedFolder = { ...mockFolder, ...dto };
      jest.spyOn(service, 'update').mockResolvedValue(updatedFolder);

      const result = await controller.update('1', dto, mockRequest);
      expect(result).toEqual(updatedFolder);
      expect(service.update).toHaveBeenCalledWith(1, dto, 1);
    });
  });

  describe('remove', () => {
    it('should remove a folder', async () => {
      jest.spyOn(service, 'remove').mockResolvedValue(mockFolder);

      const result = await controller.remove('1', mockRequest);
      expect(result).toEqual(mockFolder);
      expect(service.remove).toHaveBeenCalledWith(1, 1);
    });
  });

  describe('moveNoteToFolder', () => {
    it('should move a note to a folder', async () => {
      const mockNote = {
        id: 1,
        title: 'Test Note',
        content: 'Test Content',
        fileUrl: null,
        folderId: 1,
        userId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        folder: {
          id: 1,
          name: 'Test Folder',
          color: '#007ACC',
          userId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      };

      jest.spyOn(service, 'moveNoteToFolder').mockResolvedValue(mockNote);

      const result = await controller.moveNoteToFolder('1', 1, mockRequest);
      expect(result).toEqual(mockNote);
      expect(service.moveNoteToFolder).toHaveBeenCalledWith(1, 1, 1);
    });
  });
});
