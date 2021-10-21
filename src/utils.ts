import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import archiver from 'archiver';
import path from 'path';

export const getEndPoint = (serviceId: string): string => {
  return `https://open.qingfuwu.cn/v1/services/${serviceId}/hosting/versions`;
};

export const getReqHeaders = (
  token: string,
): {
  Authorization: string;
  'x-timestamp': number;
  'x-nonce': string;
} => {
  return {
    "Authorization": `Bearer ${token}`,
    'x-timestamp': Date.now(),
    'x-nonce': uuidv4(),
  };
};

export const zipFile = (directory: string, filename: string): Promise<void> => {
  const archive = archiver('zip', { zlib: { level: 9 } });
  const stream = fs.createWriteStream(path.resolve(process.cwd(), filename));

  return new Promise((resolve, reject) => {
    archive
      .directory(directory, false)
      .on('error', (err) => reject(err))
      .pipe(stream);

    stream.on('close', () => resolve());
    archive.finalize();
  });
};

export const getFileSize = (path: string): number => {
  const { size } = fs.statSync(path);
  return size;
};
