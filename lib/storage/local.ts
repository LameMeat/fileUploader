import fs from 'fs';
import path from 'path';
import { StorageAdapter, SaveResult } from './index';

export type LocalOptions = { uploadsDir: string };

export class LocalStorageAdapter implements StorageAdapter {
  uploadsDir: string;
  constructor(opts: LocalOptions) {
    this.uploadsDir = opts.uploadsDir;
    if (!fs.existsSync(this.uploadsDir)) fs.mkdirSync(this.uploadsDir, { recursive: true });
  }

  async save({ filename, buffer, mimeType }: { filename: string; buffer: Buffer; mimeType?: string }): Promise<SaveResult> {
    const safeName = `${Date.now()}-${filename}`.replace(/[^a-zA-Z0-9._-]/g, '_');
    const outPath = path.join(this.uploadsDir, safeName);
    await fs.promises.writeFile(outPath, buffer);
    const stats = await fs.promises.stat(outPath);
    return { path: outPath, filename: safeName, size: stats.size };
  }
}
