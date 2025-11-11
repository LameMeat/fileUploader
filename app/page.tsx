import React from 'react';
import UploadForm from '../components/UploadForm';

export default function Home() {
  return (
    <main className="page-root">
      <div className="card">
        <h1 className="title">Local File Uploader</h1>
        <p className="lead">Upload photos from your phone to this computer.</p>
        <UploadForm />
      </div>
    </main>
  );
}
