import { PartialType } from '@nestjs/mapped-types';
import { CreateNoteDto } from './create-note.dto';

// Semua properti CreateNoteDto diubah menjadi optional
export class UpdateNoteDto extends PartialType(CreateNoteDto) {}
