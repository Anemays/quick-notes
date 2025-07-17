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
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { NotesService } from './notes.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('notes')
@Controller('notes')
export class NotesController {
  constructor(
    private readonly notes: NotesService,
    @Inject('S3') private readonly s3: S3Client,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get all notes' })
  findAll() {
    return this.notes.findAll();
  }

  @Post()
  @ApiOperation({ summary: 'Create a new note' })
  create(@Body() createNoteDto: CreateNoteDto) {
    return this.notes.create(createNoteDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a note' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateNoteDto: UpdateNoteDto,
  ) {
    return this.notes.update(id, updateNoteDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.notes.remove(id);
  }

  // ✅ Upload note + file
  @Post('upload')
  @ApiOperation({ summary: 'Upload a note with a file' })
  @UseInterceptors(FileInterceptor('file'))
  async uploadNoteWithFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: CreateNoteDto,
  ) {
    const filename = uuidv4() + extname(file.originalname);
    const key = `notes/${filename}`;

    await this.s3.send(
      new PutObjectCommand({
        Bucket: 'notes',
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
      }),
    );

    const fileUrl = `${process.env.MINIO_PUBLIC_URL || 'http://localhost:9000'}/notes/${filename}`;

    return this.notes.create({
      ...body,
      fileUrl,
    });
  }
}
