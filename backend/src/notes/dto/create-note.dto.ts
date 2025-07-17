import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateNoteDto {
  @ApiProperty({ description: 'The title of the note' })
  @IsString()
  title: string;

  @ApiProperty({ description: 'The content of the note' })
  @IsString()
  content: string;

  @ApiProperty({ description: 'The URL of the uploaded file', required: false })
  @IsOptional()
  @IsString()
  fileUrl?: string;
}
