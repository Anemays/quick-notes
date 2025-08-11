import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma.service';
import { NotesModule } from './notes/notes.module';
import { MinioModule } from './minio.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [NotesModule, MinioModule, AuthModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
  exports: [PrismaService],
})
export class AppModule {}
