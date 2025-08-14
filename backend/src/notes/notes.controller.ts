import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Delete,
  Param,
  ParseIntPipe,
  UploadedFile,
  UseInterceptors,
  Inject,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { NotesService } from './notes.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { NoteResponseDto } from './dto/response.dto';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiConsumes,
  ApiBody,
  ApiHeader,
} from '@nestjs/swagger';
import { SessionGuard } from '../auth/guards/session.guard';

interface AuthenticatedRequest extends Request {
  user: {
    id: number;
    email: string;
    name: string;
  };
}

@ApiTags('notes')
@Controller('notes')
@UseGuards(SessionGuard)
export class NotesController {
  constructor(
    private readonly notes: NotesService,
    @Inject('S3') private readonly s3: S3Client,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get all notes for authenticated user' })
  @ApiHeader({
    name: 'x-session-id',
    description: 'Session ID for authentication',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'List of notes retrieved successfully',
    type: [NoteResponseDto],
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - invalid or missing session',
  })
  findAll(@Request() req: AuthenticatedRequest) {
    return this.notes.findAll(req.user.id);
  }

  @Get('search')
  @ApiOperation({ summary: 'Search notes by title' })
  @ApiQuery({
    name: 'q',
    description: 'Search term to filter notes by title',
    required: false,
    example: 'work',
  })
  @ApiHeader({
    name: 'x-session-id',
    description: 'Session ID for authentication',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Search results retrieved successfully',
    type: [NoteResponseDto],
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - invalid or missing session',
  })
  searchByTitle(
    @Request() req: AuthenticatedRequest,
    @Query('q') searchTerm?: string,
  ) {
    if (!searchTerm || searchTerm.trim() === '') {
      return this.notes.findAll(req.user.id);
    }
    return this.notes.searchByTitle(searchTerm.trim(), req.user.id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new note' })
  @ApiBody({ type: CreateNoteDto })
  @ApiHeader({
    name: 'x-session-id',
    description: 'Session ID for authentication',
    required: true,
  })
  @ApiResponse({
    status: 201,
    description: 'Note created successfully',
    type: NoteResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - invalid or missing session',
  })
  create(
    @Body() createNoteDto: CreateNoteDto,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.notes.create(createNoteDto, req.user.id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an existing note' })
  @ApiParam({
    name: 'id',
    description: 'Note ID to update',
    example: 1,
  })
  @ApiBody({ type: UpdateNoteDto })
  @ApiHeader({
    name: 'x-session-id',
    description: 'Session ID for authentication',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Note updated successfully',
    type: NoteResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - invalid or missing session',
  })
  @ApiResponse({
    status: 404,
    description: 'Note not found or does not belong to user',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateNoteDto: UpdateNoteDto,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.notes.update(id, updateNoteDto, req.user.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a note' })
  @ApiParam({
    name: 'id',
    description: 'Note ID to delete',
    example: 1,
  })
  @ApiHeader({
    name: 'x-session-id',
    description: 'Session ID for authentication',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Note deleted successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - invalid or missing session',
  })
  @ApiResponse({
    status: 404,
    description: 'Note not found or does not belong to user',
  })
  remove(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.notes.remove(id, req.user.id);
  }

  // ✅ Upload note + file
  @Post('upload')
  @ApiOperation({ summary: 'Upload a note with an attached file' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Note data with file',
    schema: {
      type: 'object',
      properties: {
        title: {
          type: 'string',
          description: 'Note title',
          example: 'My Photo Note',
        },
        content: {
          type: 'string',
          description: 'Note content',
          example: 'This note contains an image',
        },
        folderId: {
          type: 'number',
          description: 'Optional folder ID',
          example: 1,
        },
        file: {
          type: 'string',
          format: 'binary',
          description: 'File to upload',
        },
      },
      required: ['title', 'content', 'file'],
    },
  })
  @ApiHeader({
    name: 'x-session-id',
    description: 'Session ID for authentication',
    required: true,
  })
  @ApiResponse({
    status: 201,
    description: 'Note with file uploaded successfully',
    type: NoteResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data or file',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - invalid or missing session',
  })
  @ApiResponse({
    status: 500,
    description: 'File upload failed',
  })
  @UseInterceptors(FileInterceptor('file'))
  async uploadNoteWithFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: CreateNoteDto,
    @Request() req: AuthenticatedRequest,
  ) {
    const filename = uuidv4() + extname(file.originalname);
    const key = filename; // Remove 'notes/' prefix since we're already in the notes bucket

    await this.s3.send(
      new PutObjectCommand({
        Bucket: 'notes',
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
      }),
    );

    const publicUrl = process.env.MINIO_PUBLIC_URL || 'http://localhost:9000';
    const fileUrl = `${publicUrl}/notes/${filename}`;

    return this.notes.create(
      {
        ...body,
        fileUrl,
      },
      req.user.id,
    );
  }
}
