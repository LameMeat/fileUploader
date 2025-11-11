"use client";
import React, { useState, useEffect } from 'react';

export default function UploadForm() {
  type PreviewFile = { file: File; url: string };
  const [files, setFiles] = useState<PreviewFile[] | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const inputId = 'native-file-input';

  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    const fl = e.target.files;
    // revoke previous previews
    if (files) {
      files.forEach((p: PreviewFile) => URL.revokeObjectURL(p.url));
    }
    if (!fl) {
      setFiles(null);
      return;
    }
    const out: PreviewFile[] = [];
    for (let i = 0; i < fl.length; i++) {
      const f = fl.item(i);
      if (!f) continue;
      out.push({ file: f, url: URL.createObjectURL(f) });
    }
    setFiles(out);
  }

  // cleanup object URLs when files are cleared
  useEffect(() => {
    return () => {
      // noop - we revoke on Reset below
    };
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!files || files.length === 0) return;
    const fd = new FormData();
    for (let i = 0; i < files.length; i++) {
      // append the actual File object (not the wrapper) and include filename
      fd.append('files', files[i].file, files[i].file.name);
    }
    setStatus('Uploading...');
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: fd });
      if (!res.ok) throw new Error(await res.text());
      setStatus('Upload successful');
    } catch (err: any) {
      setStatus('Upload failed: ' + (err.message || String(err)));
    }
  }

  const fileCount = files ? files.length : 0;

  return (
    <form onSubmit={onSubmit} className="u-form">
      <div className="file-picker">
        <input id={inputId} className="hidden-file-input" type="file" accept="image/*" multiple onChange={onChange} />
        <label htmlFor={inputId} className="picker-btn" aria-hidden>
          Choose files
        </label>
        <div className="file-info">
          {fileCount === 0 ? 'No files selected' : `${fileCount} file${fileCount > 1 ? 's' : ''} selected`}
        </div>
      </div>

      {files && files.length > 0 && (
        <div className="thumbs">
          {files.slice(0, 12).map((p: PreviewFile, i: number) => {
            return (
              <span className="thumb" key={i}>
                <img src={p.url} alt={p.file.name} />
              </span>
            );
          })}
        </div>
      )}

      <div className="u-actions">
        <button className="btn btn-primary" type="submit">
          Upload
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => {
            // revoke object urls
            if (files) {
              files.forEach((p: PreviewFile) => {
                try { URL.revokeObjectURL(p.url); } catch (e) {}
              });
            }
            setFiles(null);
            setStatus(null);
            const el = document.getElementById(inputId) as HTMLInputElement | null;
            if (el) el.value = '';
          }}
        >
          Reset
        </button>
      </div>
      {status && <p className="status">{status}</p>}
    </form>
  );
}
