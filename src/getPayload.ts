import { zipFile } from './utils';
import fs from 'fs';
import path from 'path';

const getPayload = async (
  file: string,
  directory: string,
): Promise<{ body: Buffer; size: number }> => {
  if (file) {
    try {
      const packagePath = path.resolve(process.cwd(), file);
      return {
        body: fs.readFileSync(packagePath),
        size: fs.statSync(packagePath).size,
      };
    } catch (e) {
      throw new Error(`Read file ${file} failed: ${e}`);
    }
  }

  if (directory) {
    try {
      await zipFile(directory, 'file.zip');
      const packagePath = path.resolve(process.cwd(), 'file.zip');
      return {
        body: fs.readFileSync(packagePath),
        size: fs.statSync(packagePath).size,
      };
    } catch (e) {
      throw new Error(`Zip file ${directory} failed: ${e}`);
    }
  }

  throw new Error(`[file] and [directory] param is empty.`);
};

export default getPayload;
