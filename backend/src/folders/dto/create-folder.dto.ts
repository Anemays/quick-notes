import { IsString, IsOptional, IsHexColor } from 'class-validator';

export class CreateFolderDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsHexColor()
  color?: string;
}
