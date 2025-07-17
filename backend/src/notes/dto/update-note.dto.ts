import { PartialType } from '@nestjs/swagger';
import { CreateNoteDto } from './create-note.dto';

// Semua properti CreateNoteDto diubah menjadi optional
export class UpdateNoteDto extends PartialType(CreateNoteDto) {}
