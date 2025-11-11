"use client";
import { useEffect, useRef, useState } from 'react';

type PreviewFile = { file: File; url: string };

export function useUpload() {
  const [selectedFiles, setSelectedFiles] = useState<PreviewFile[] | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [percentUploaded, setPercentUploaded] = useState<number | null>(null);
  const mountedRef = useRef(true);
  const xhrRef = useRef<XMLHttpRequest | null>(null);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
  if (selectedFiles) selectedFiles.forEach((p: PreviewFile) => { try { URL.revokeObjectURL(p.url); } catch (e) {} });
      if (xhrRef.current) {
        try { xhrRef.current.abort(); } catch (e) {}
        xhrRef.current = null;
      }
    };
  }, []);

  function handleFilesChange(e: React.ChangeEvent<HTMLInputElement>) {
    const fl = e.target.files;
  if (selectedFiles) selectedFiles.forEach((p: PreviewFile) => URL.revokeObjectURL(p.url));
    if (!fl) {
      setSelectedFiles(null);
      return;
    }
    const out: PreviewFile[] = [];
    for (let i = 0; i < fl.length; i++) {
      const f = fl.item(i);
      if (!f) continue;
      out.push({ file: f, url: URL.createObjectURL(f) });
    }
    setSelectedFiles(out);
  }

  function resetSelection() {
  if (selectedFiles) selectedFiles.forEach((p: PreviewFile) => { try { URL.revokeObjectURL(p.url); } catch (e) {} });
    setSelectedFiles(null);
    setStatusMessage(null);
    setPercentUploaded(null);
    const el = document.getElementById('native-file-input') as HTMLInputElement | null;
    if (el) el.value = '';
  }

  function submitUpload(e?: React.FormEvent) {
    if (e) e.preventDefault();
    if (!selectedFiles || selectedFiles.length === 0) return;

    const formData = new FormData();
    for (let i = 0; i < selectedFiles.length; i++) {
      formData.append('files', selectedFiles[i].file, selectedFiles[i].file.name);
    }

    setStatusMessage('Uploading...');
    setPercentUploaded(0);

    const xhr = new XMLHttpRequest();
    xhrRef.current = xhr;
    xhr.open('POST', '/api/upload');

    xhr.upload.onprogress = (progressEvent: ProgressEvent) => {
      if (!progressEvent.lengthComputable) return;
      const percent = Math.round((progressEvent.loaded / progressEvent.total) * 100);
      if (!mountedRef.current) return;
      setPercentUploaded(percent);
    };

    xhr.onload = () => {
      if (!mountedRef.current) return;
      if (xhr.status >= 200 && xhr.status < 300) {
        setStatusMessage('Upload successful');
      } else {
        setStatusMessage('Upload failed: ' + xhr.statusText);
      }
      setPercentUploaded(null);
      xhrRef.current = null;
    };

    xhr.onerror = () => {
      if (!mountedRef.current) return;
      setStatusMessage('Upload failed: network error');
      setPercentUploaded(null);
      xhrRef.current = null;
    };

    xhr.send(formData);
  }

  function abortUpload() {
    if (xhrRef.current) {
      try { xhrRef.current.abort(); } catch (e) {}
      xhrRef.current = null;
      setStatusMessage('Upload aborted');
      setPercentUploaded(null);
    }
  }

  return {
    selectedFiles,
    statusMessage,
    percentUploaded,
    handleFilesChange,
    resetSelection,
    submitUpload,
    abortUpload,
  } as const;
}
