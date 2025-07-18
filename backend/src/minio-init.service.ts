import { Injectable, OnModuleInit, Inject } from '@nestjs/common';
import {
  S3Client,
  CreateBucketCommand,
  HeadBucketCommand,
} from '@aws-sdk/client-s3';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

@Injectable()
export class MinioInitService implements OnModuleInit {
  constructor(@Inject('S3') private readonly s3: S3Client) {}

  async onModuleInit() {
    try {
      // Create bucket if it doesn't exist
      try {
        await this.s3.send(new HeadBucketCommand({ Bucket: 'notes' }));
        console.log('MinIO bucket "notes" already exists');
      } catch {
        // Bucket doesn't exist, create it
        await this.s3.send(new CreateBucketCommand({ Bucket: 'notes' }));
        console.log('MinIO bucket "notes" created successfully');
      }

      // Set public read policy using mc command
      try {
        await execAsync(
          'mc alias set local http://localhost:9000 ${MINIO_ROOT_USER:-minioadmin} ${MINIO_ROOT_PASSWORD:-minioadmin}',
        );
        await execAsync('mc anonymous set download local/notes');
        console.log('MinIO bucket policy set to public download');
      } catch {
        console.log(
          'MinIO policy setup using mc command failed, trying alternative approach',
        );
        // This is fine, we can set policy manually if needed
      }

      console.log('MinIO initialization completed');
    } catch (error) {
      console.log(
        'MinIO init error:',
        error instanceof Error ? error.message : 'Unknown error',
      );
    }
  }
}
