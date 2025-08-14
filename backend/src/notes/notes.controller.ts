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
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
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
  @ApiOperation({ summary: 'Get all notes' })
  findAll(@Request() req: AuthenticatedRequest) {
    return this.notes.findAll(req.user.id);
  }

  @Get('search')
  @ApiOperation({ summary: 'Search notes by title' })
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
  create(
    @Body() createNoteDto: CreateNoteDto,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.notes.create(createNoteDto, req.user.id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a note' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateNoteDto: UpdateNoteDto,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.notes.update(id, updateNoteDto, req.user.id);
  }

  @Delete(':id')
  remove(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.notes.remove(id, req.user.id);
  }

  // ✅ Upload note + file
  @Post('upload')
  @ApiOperation({ summary: 'Upload a note with a file' })
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
