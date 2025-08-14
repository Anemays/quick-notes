import { ApiProperty } from '@nestjs/swagger';

export class NoteResponseDto {
  @ApiProperty({
    description: 'Note ID',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'Note title',
    example: 'My First Note',
  })
  title: string;

  @ApiProperty({
    description: 'Note content',
    example: 'This is the content of my note',
  })
  content: string;

  @ApiProperty({
    description: 'File URL if attached',
    example: 'http://localhost:9000/notes/file.jpg',
    required: false,
  })
  fileUrl?: string;

  @ApiProperty({
    description: 'Folder ID if note is in a folder',
    example: 1,
    required: false,
  })
  folderId?: number;

  @ApiProperty({
    description: 'User ID who owns the note',
    example: 1,
  })
  userId: number;

  @ApiProperty({
    description: 'Note creation timestamp',
    example: '2025-08-14T10:30:00Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Note last update timestamp',
    example: '2025-08-14T11:45:00Z',
  })
  updatedAt: Date;

  @ApiProperty({
    description: 'Folder information if note is in a folder',
    required: false,
  })
  folder?: {
    id: number;
    name: string;
    color?: string;
  };
}

export class FileUploadResponseDto {
  @ApiProperty({
    description: 'Upload success message',
    example: 'File uploaded successfully',
  })
  message: string;

  @ApiProperty({
    description: 'Created note with file',
    type: NoteResponseDto,
  })
  note: NoteResponseDto;
}
