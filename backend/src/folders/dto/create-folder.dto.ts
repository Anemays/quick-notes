import { IsString, IsOptional, IsHexColor } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateFolderDto {
  @ApiProperty({ description: 'Name of the folder', example: 'Work' })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Optional description of the folder',
    example: 'Folder for work-related notes',
    required: false,
  })
  @IsOptional()
  @IsHexColor()
  color?: string;
}
