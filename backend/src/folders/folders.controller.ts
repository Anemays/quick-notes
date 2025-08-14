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
import { SessionGuard } from '../auth/guards/session.guard';
import { FoldersService } from './folders.service';
import { CreateFolderDto } from './dto/create-folder.dto';
import { UpdateFolderDto } from './dto/update-folder.dto';
import {
  FolderResponseDto,
  MoveFolderDto,
  MoveNoteResponseDto,
} from './dto/response.dto';
import { AuthenticatedRequest } from '../types/auth.interface';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiHeader,
} from '@nestjs/swagger';

@ApiTags('folders')
@Controller('folders')
@UseGuards(SessionGuard)
export class FoldersController {
  constructor(private readonly foldersService: FoldersService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new folder' })
  @ApiBody({ type: CreateFolderDto })
  @ApiHeader({
    name: 'x-session-id',
    description: 'Session ID for authentication',
    required: true,
  })
  @ApiResponse({
    status: 201,
    description: 'Folder created successfully',
    type: FolderResponseDto,
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
    @Body() createFolderDto: CreateFolderDto,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.foldersService.create(createFolderDto, req.user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all folders for authenticated user' })
  @ApiHeader({
    name: 'x-session-id',
    description: 'Session ID for authentication',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'List of folders retrieved successfully',
    type: [FolderResponseDto],
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - invalid or missing session',
  })
  findAll(@Request() req: AuthenticatedRequest) {
    return this.foldersService.findAll(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a folder by ID' })
  @ApiParam({
    name: 'id',
    description: 'Folder ID to retrieve',
    example: 1,
  })
  @ApiHeader({
    name: 'x-session-id',
    description: 'Session ID for authentication',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Folder retrieved successfully',
    type: FolderResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - invalid or missing session',
  })
  @ApiResponse({
    status: 404,
    description: 'Folder not found or does not belong to user',
  })
  findOne(@Param('id') id: string, @Request() req: AuthenticatedRequest) {
    return this.foldersService.findOne(+id, req.user.id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an existing folder' })
  @ApiParam({
    name: 'id',
    description: 'Folder ID to update',
    example: 1,
  })
  @ApiBody({ type: UpdateFolderDto })
  @ApiHeader({
    name: 'x-session-id',
    description: 'Session ID for authentication',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Folder updated successfully',
    type: FolderResponseDto,
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
    description: 'Folder not found or does not belong to user',
  })
  update(
    @Param('id') id: string,
    @Body() updateFolderDto: UpdateFolderDto,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.foldersService.update(+id, updateFolderDto, req.user.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a folder' })
  @ApiParam({
    name: 'id',
    description: 'Folder ID to delete',
    example: 1,
  })
  @ApiHeader({
    name: 'x-session-id',
    description: 'Session ID for authentication',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Folder deleted successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - invalid or missing session',
  })
  @ApiResponse({
    status: 404,
    description: 'Folder not found or does not belong to user',
  })
  remove(@Param('id') id: string, @Request() req: AuthenticatedRequest) {
    return this.foldersService.remove(+id, req.user.id);
  }

  @Put('notes/:noteId/move')
  @ApiOperation({ summary: 'Move a note to a different folder' })
  @ApiParam({
    name: 'noteId',
    description: 'Note ID to move',
    example: 1,
  })
  @ApiBody({ type: MoveFolderDto })
  @ApiHeader({
    name: 'x-session-id',
    description: 'Session ID for authentication',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Note moved successfully',
    type: MoveNoteResponseDto,
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
    description: 'Note or folder not found',
  })
  moveNoteToFolder(
    @Param('noteId') noteId: string,
    @Body('folderId') folderId: number | null,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.foldersService.moveNoteToFolder(+noteId, folderId, req.user.id);
  }
}
