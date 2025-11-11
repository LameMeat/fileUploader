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

  // In formidable v3 the API is a factory: formidable(opts)
  const form = formidable({ multiples: true });

  form.parse(req, async (err: any, fields: any, files: any) => {
    if (err) {
      console.error('form.parse error', err);
      return res.status(500).send('Failed to parse form');
    }

    try {
      const uploadedFiles: any[] = [];

      // Files shape can differ by formidable version and form field names.
      let fileEntries: any[] = [];
      if (!files) fileEntries = [];
      else if (Array.isArray(files.files)) fileEntries = files.files;
      else if (files.files) fileEntries = [files.files];
      else {
        // gather and flatten all file values
        const vals = Object.values(files || {});
        fileEntries = vals.flat();
      }

      for (const f of fileEntries) {
        if (!f) continue;
        // support both v2 and v3 shapes
        const filePath = f.filepath || f.filePath || f.path;
        const originalName = f.originalFilename || f.originalname || f.name || 'file';
        const mime = f.mimetype || f.mimeType || f.type || undefined;
        const buffer = fs.readFileSync(filePath);
        const out = await storage.save({ filename: originalName, buffer, mimeType: mime });
        uploadedFiles.push(out);
        // remove temporary file if present
        try { await fs.promises.unlink(filePath); } catch (e) {}
      }

      res.status(200).json({ uploaded: uploadedFiles });
    } catch (e) {
      console.error(e);
      res.status(500).send('Upload failed');
    }
  });
}
