/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-argument */

import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

interface SessionData {
  userId: number;
  email: string;
  [key: string]: any;
}

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private client: Redis;

  constructor(private configService: ConfigService) {}

  async onModuleInit() {
    const redisConfig = {
      host: this.configService.get<string>('REDIS_HOST') || 'localhost',
      port: this.configService.get<number>('REDIS_PORT') || 6379,
      password: this.configService.get<string>('REDIS_PASSWORD'),
      maxRetriesPerRequest: 3,
      lazyConnect: true,
    };

    this.client = new Redis(redisConfig);

    this.client.on('connect', () => {
      console.log('✅ Redis connected successfully');
    });

    this.client.on('error', (error) => {
      console.error('❌ Redis connection error:', error);
    });

    try {
      await this.client.connect();
    } catch (error) {
      console.error('Failed to connect to Redis:', error);
    }
  }

  onModuleDestroy() {
    if (this.client) {
      this.client.disconnect();
    }
  }

  getClient(): Redis {
    return this.client;
  }

  // Session methods
  async setSession(
    sessionId: string,
    userData: SessionData,
    ttlSeconds: number = 86400,
  ): Promise<void> {
    const key = `session:${sessionId}`;
    await this.client.setex(key, ttlSeconds, JSON.stringify(userData));
  }

  async getSession(sessionId: string): Promise<SessionData | null> {
    const key = `session:${sessionId}`;
    const data = await this.client.get(key);
    return data ? JSON.parse(data) : null;
  }

  async deleteSession(sessionId: string): Promise<void> {
    const key = `session:${sessionId}`;
    await this.client.del(key);
  }

  async deleteAllUserSessions(userId: number): Promise<void> {
    const pattern = 'session:*';
    const keys = await this.client.keys(pattern);

    for (const key of keys) {
      const sessionData = await this.client.get(key);
      if (sessionData) {
        const data: SessionData = JSON.parse(sessionData);
        if (data.userId === userId) {
          await this.client.del(key);
        }
      }
    }
  }

  async extendSession(
    sessionId: string,
    ttlSeconds: number = 86400,
  ): Promise<void> {
    const key = `session:${sessionId}`;
    await this.client.expire(key, ttlSeconds);
  }

  async getActiveSessions(userId: number): Promise<string[]> {
    const pattern = 'session:*';
    const keys = await this.client.keys(pattern);
    const userSessions: string[] = [];

    for (const key of keys) {
      const sessionData = await this.client.get(key);
      if (sessionData) {
        const data: SessionData = JSON.parse(sessionData);
        if (data.userId === userId) {
          userSessions.push(key.replace('session:', ''));
        }
      }
    }

    return userSessions;
  }
}
