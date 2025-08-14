import { ApiProperty } from '@nestjs/swagger';

export class FolderResponseDto {
  @ApiProperty({
    description: 'Folder ID',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'Folder name',
    example: 'Work',
  })
  name: string;

  @ApiProperty({
    description: 'Folder color (hex code)',
    example: '#FF5733',
    required: false,
  })
  color?: string;

  @ApiProperty({
    description: 'User ID who owns the folder',
    example: 1,
  })
  userId: number;

  @ApiProperty({
    description: 'Folder creation timestamp',
    example: '2025-08-14T10:30:00Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Folder last update timestamp',
    example: '2025-08-14T11:45:00Z',
  })
  updatedAt: Date;
}

export class MoveFolderDto {
  @ApiProperty({
    description: 'Target folder ID to move the note to (null for root)',
    example: 1,
    required: false,
  })
  folderId: number | null;
}

export class MoveNoteResponseDto {
  @ApiProperty({
    description: 'Move operation success message',
    example: 'Note moved successfully',
  })
  message: string;

  @ApiProperty({
    description: 'Updated note information',
  })
  note: {
    id: number;
    title: string;
    folderId: number | null;
  };
}
