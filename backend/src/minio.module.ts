import { Module, Global } from '@nestjs/common';
import { S3Client } from '@aws-sdk/client-s3';

@Global()
@Module({
  providers: [
    {
      provide: 'S3',
      useFactory: () =>
        new S3Client({
          region: 'us-east-1',
          endpoint: process.env.MINIO_ENDPOINT || 'http://minio:9000',
          forcePathStyle: true,
          credentials: {
            accessKeyId: process.env.MINIO_ROOT_USER || '',
            secretAccessKey: process.env.MINIO_ROOT_PASSWORD || '',
          },
        }),
    },
  ],
  exports: ['S3'],
})
export class MinioModule {}
