import { Injectable } from '@nestjs/common';
import { writeFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';

@Injectable()
export class LoggingService {
  async writeLogToFile(message: string, isErrorLog?: boolean): Promise<void> {
    const logsFileName = 'logs.txt';
    const errorLogsFileName = 'errors.txt'
    const folderPath = 'src/logs'
    const filePathToLogs = `src/logs/${isErrorLog ? errorLogsFileName : logsFileName}`

    try {
      if(!existsSync(folderPath)) {
        await mkdir(folderPath, { recursive: true });
      }

      await writeFile(filePathToLogs, message, { flag: 'w' })
    } catch (err) {
      console.error(err);
    } 
  }

  async log(message: string): Promise<void> {
    this.writeLogToFile(message);
  }

  error(message: string, error: any): void {
    this.writeLogToFile(`${message}, ${JSON.stringify(error)}`, true);
  }
}