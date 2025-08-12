import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Put,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { FoldersService } from './folders.service';
import { CreateFolderDto } from './dto/create-folder.dto';
import { UpdateFolderDto } from './dto/update-folder.dto';
import { AuthenticatedRequest } from '../types/auth.interface';

@Controller('folders')
@UseGuards(JwtAuthGuard)
export class FoldersController {
  constructor(private readonly foldersService: FoldersService) {}

  @Post()
  create(
    @Body() createFolderDto: CreateFolderDto,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.foldersService.create(createFolderDto, req.user.id);
  }

  @Get()
  findAll(@Request() req: AuthenticatedRequest) {
    return this.foldersService.findAll(req.user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req: AuthenticatedRequest) {
    return this.foldersService.findOne(+id, req.user.id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateFolderDto: UpdateFolderDto,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.foldersService.update(+id, updateFolderDto, req.user.id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req: AuthenticatedRequest) {
    return this.foldersService.remove(+id, req.user.id);
  }

  @Put('notes/:noteId/move')
  moveNoteToFolder(
    @Param('noteId') noteId: string,
    @Body('folderId') folderId: number | null,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.foldersService.moveNoteToFolder(+noteId, folderId, req.user.id);
  }
}
