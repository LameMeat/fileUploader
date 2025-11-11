"use client";
import React, { useState } from 'react';

export default function UploadForm() {
  const [files, setFiles] = useState<FileList | null>(null);
  const [status, setStatus] = useState<string | null>(null);

  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFiles(e.target.files);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!files || files.length === 0) return;
    const fd = new FormData();
    for (let i = 0; i < files.length; i++) fd.append('files', files[i]);
    setStatus('Uploading...');
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: fd });
      if (!res.ok) throw new Error(await res.text());
      setStatus('Upload successful');
    } catch (err: any) {
      setStatus('Upload failed: ' + (err.message || String(err)));
    }
  }

  return (
    <form onSubmit={onSubmit} className="u-form">
      <input
        type="file"
        accept="image/*"
        capture="environment"
        multiple
        onChange={onChange}
      />
      <div className="u-actions">
        <button className="btn btn-primary" type="submit">
          Upload
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => {
            setFiles(null);
            setStatus(null);
          }}
        >
          Reset
        </button>
      </div>
      {status && <p className="status">{status}</p>}
    </form>
  );
}
