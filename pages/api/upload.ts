import type { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';
import { LocalStorageAdapter } from '../../lib/storage/local';

// Disable Next's default bodyParser so we can use formidable
export const config = {
  api: {
    bodyParser: false
  }
};

const uploadsDir = path.join(process.cwd(), 'uploads');
const storage = new LocalStorageAdapter({ uploadsDir });

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end('Method Not Allowed');

  const form = new formidable.IncomingForm({ multiples: true });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error('form.parse error', err);
      return res.status(500).send('Failed to parse form');
    }

    try {
      const uploadedFiles: any[] = [];
      const fileEntries = Array.isArray(files.files) ? files.files : [files.files];
      for (const f of fileEntries) {
        if (!f) continue;
        const buffer = fs.readFileSync(f.path);
        const out = await storage.save({ filename: f.name, buffer, mimeType: f.type });
        uploadedFiles.push(out);
      }

      res.status(200).json({ uploaded: uploadedFiles });
    } catch (e) {
      console.error(e);
      res.status(500).send('Upload failed');
    }
  });
}
