import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  async onModuleInit() {
    try {
      // Connect to database
      await this.$connect();
      console.log('🔗 Connected to database');

      // Run database migrations automatically
      console.log('🔄 Running database migrations...');

      try {
        // Try to deploy migrations first
        await execAsync('npx prisma migrate deploy');
        console.log('✅ Database migrations deployed successfully');
      } catch {
        console.log('⚠️ Migration deploy failed, trying db push...');
        try {
          // Fallback to db push for development
          await execAsync('npx prisma db push --accept-data-loss');
          console.log('✅ Database schema synchronized with db push');
        } catch (pushError) {
          console.error(
            '❌ Database migration failed:',
            (pushError as Error).message,
          );
        }
      }
    } catch (error) {
      console.error('❌ Database connection failed:', error);
      throw error;
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
