"use client";
import React, { useState, useEffect, useRef } from 'react';
import ProgressBar from './ProgressBar';

export default function UploadForm() {
  type PreviewFile = { file: File; url: string };
  const [files, setFiles] = useState<PreviewFile[] | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const inputId = 'native-file-input';
  const mountedRef = useRef(true);

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
      // revoke any previews on unmount
      mountedRef.current = false;
  if (files) files.forEach((p: PreviewFile) => { try { URL.revokeObjectURL(p.url); } catch (e) {} });
    };
  }, []);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!files || files.length === 0) return;

    const fd = new FormData();
    for (let i = 0; i < files.length; i++) fd.append('files', files[i].file, files[i].file.name);

    setStatus('Uploading...');
    setUploadProgress(0);

    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/api/upload');

    xhr.upload.onprogress = (ev) => {
      if (!ev.lengthComputable) return;
      const pct = Math.round((ev.loaded / ev.total) * 100);
      setUploadProgress(pct);
    };

    xhr.onload = () => {
      if (!mountedRef.current) return;
      if (xhr.status >= 200 && xhr.status < 300) {
        setStatus('Upload successful');
      } else {
        setStatus('Upload failed: ' + xhr.statusText);
      }
      setUploadProgress(null);
    };

    xhr.onerror = () => {
      if (!mountedRef.current) return;
      setStatus('Upload failed: network error');
      setUploadProgress(null);
    };

    xhr.send(fd);
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
      <ProgressBar progress={uploadProgress} />
      {status && <p className="status">{status}</p>}
    </form>
  );
}
