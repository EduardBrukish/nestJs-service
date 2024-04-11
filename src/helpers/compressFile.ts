import { createReadStream, createWriteStream } from 'node:fs';
import { join } from 'path';
import { createGzip } from 'node:zlib';
import { promisify } from 'node:util';
import { pipeline } from 'node:stream';

const pipe = promisify(pipeline);

export const compressFile = async (
  filePath: string,
  folderPath: string,
  isErrorLog?: boolean,
): Promise<void> => {
  const compressedFileName = join(
    folderPath,
    `logs-${isErrorLog ? 'errors-' : ''}${new Date().toISOString()}.gz`,
  );

  const gzip = createGzip();
  const source = createReadStream(filePath);
  const destination = createWriteStream(compressedFileName);

  try {
    await pipe(source, gzip, destination);
  } catch (e) {
    console.error('An error occurred:', e);
  }
};
