import fs from 'fs';
import path from 'path';
import { LocalStorageAdapter } from '../lib/storage/local';

test('local storage saves a file', async () => {
  const uploadsDir = path.join(process.cwd(), 'tmp-uploads-test');
  if (fs.existsSync(uploadsDir)) await fs.promises.rm(uploadsDir, { recursive: true, force: true });
  const storage = new LocalStorageAdapter({ uploadsDir });
  const result = await storage.save({ filename: 'hello.txt', buffer: Buffer.from('hello') });
  expect(result.filename).toBeDefined();
  expect(fs.existsSync(result.path)).toBe(true);
  const contents = await fs.promises.readFile(result.path, 'utf8');
  expect(contents).toBe('hello');
  await fs.promises.rm(uploadsDir, { recursive: true, force: true });
});
