import { Injectable, LoggerService } from '@nestjs/common';
import { writeFile, mkdir, stat, appendFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join } from 'path';
import { compressFile } from '../helpers/compressFile';

@Injectable()
export class LoggingService implements LoggerService {
  async writeLogToFile(message: string, isErrorLog?: boolean): Promise<void> {
    const logsFileName = 'logs.txt';
    const errorLogsFileName = 'errors.txt';
    const folderPath = 'src/logs';
    const filePathToLogs = join(
      folderPath,
      isErrorLog ? errorLogsFileName : logsFileName,
    );

    try {
      if (!existsSync(folderPath)) {
        await mkdir(folderPath, { recursive: true });
      }

      await appendFile(filePathToLogs, `${message}\n`);

      const fileStat = await stat(filePathToLogs);
      const fileSizeInKb = fileStat.size / 1000;

      if (fileSizeInKb > parseInt(process.env.LOG_FILE_MAX_SIZE)) {
        await compressFile(filePathToLogs, folderPath, isErrorLog);
        await writeFile(filePathToLogs, '');
      }
    } catch (err) {
      console.error(err);
    }
  }

  async log(message: string): Promise<void> {
    await this.writeLogToFile(message);
  }

  async error(message: string, error: any): Promise<void> {
    await this.writeLogToFile(`${message}, ${JSON.stringify(error)}`, true);
  }

  warn(message: string, error: any): void {
    console.log(`${message}\n ${error}`);
  }
}
