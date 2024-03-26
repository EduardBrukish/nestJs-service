import { Injectable } from '@nestjs/common';

@Injectable()
export class LoggingService {
  info(message: string): void {
    console.log(`[INFO] ${message}`);
  }

  error(message: string, error: any): void {
    console.error(`[ERROR] ${message}`, error);
  }
}