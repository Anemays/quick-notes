import { Injectable, OnModuleInit, Inject } from '@nestjs/common';
import {
  S3Client,
  CreateBucketCommand,
  HeadBucketCommand,
  PutBucketPolicyCommand,
} from '@aws-sdk/client-s3';

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

      // Set public read policy using AWS SDK
      try {
        const bucketPolicy = {
          Version: '2012-10-17',
          Statement: [
            {
              Effect: 'Allow',
              Principal: '*',
              Action: ['s3:GetObject'],
              Resource: ['arn:aws:s3:::notes/*'],
            },
          ],
        };

        await this.s3.send(
          new PutBucketPolicyCommand({
            Bucket: 'notes',
            Policy: JSON.stringify(bucketPolicy),
          }),
        );
        console.log('MinIO bucket policy set to public read');
      } catch (error) {
        console.log(
          'MinIO policy setup failed:',
          error instanceof Error ? error.message : 'Unknown error',
        );
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
