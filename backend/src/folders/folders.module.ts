import { Module } from '@nestjs/common';
import { FoldersService } from './folders.service';
import { FoldersController } from './folders.controller';
import { PrismaService } from '../prisma.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [FoldersController],
  providers: [FoldersService, PrismaService],
  exports: [FoldersService],
})
export class FoldersModule {}
