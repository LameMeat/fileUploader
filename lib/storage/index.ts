export type SaveResult = {
  path: string;
  url?: string;
  filename: string;
  size?: number;
};

export type StorageAdapterOptions = Record<string, any>;

export interface StorageAdapter {
  save(opts: { filename: string; buffer: Buffer; mimeType?: string }): Promise<SaveResult>;
}
