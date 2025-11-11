"use client";
import { useUpload } from './useUpload';
import ProgressBar from './ProgressBar';

export default function UploadForm() {
  const {
    selectedFiles,
    statusMessage,
    percentUploaded,
    handleFilesChange,
    resetSelection,
    submitUpload,
    abortUpload,
  } = useUpload();

  const fileCount = selectedFiles ? selectedFiles.length : 0;

  return (
    <form onSubmit={submitUpload} className="u-form">
      <div className="file-picker">
        <input id="native-file-input" className="hidden-file-input" type="file" accept="image/*" multiple onChange={handleFilesChange} />
        <label htmlFor="native-file-input" className="picker-btn" aria-hidden>
          Choose files
        </label>
        <div className="file-info">
          {fileCount === 0 ? 'No files selected' : `${fileCount} file${fileCount > 1 ? 's' : ''} selected`}
        </div>
      </div>

      {selectedFiles && selectedFiles.length > 0 && (
        <div className="thumbs">
          {selectedFiles.slice(0, 12).map((p: { file: File; url: string }, i: number) => {
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
        <button type="button" className="btn btn-secondary" onClick={resetSelection}>
          Reset
        </button>
        <button type="button" className="btn btn-tertiary" onClick={abortUpload}>
          Cancel
        </button>
      </div>
      <ProgressBar progress={percentUploaded} />
      {statusMessage && <p className="status">{statusMessage}</p>}
    </form>
  );
}
