import React from 'react';
import UploadForm from '../components/UploadForm';
import QRCodeDisplay from '../components/QRCodeDisplay';

export default function Home() {
  return (
    <main className="page-root">
      <div className="card">
        <h1 className="title">Local File Uploader</h1>
        <p className="lead">Upload photos from your phone to this computer.</p>
        <div className="form-with-qr">
          <div className="form-column">
            <UploadForm />
          </div>
          <div className="qr-wrapper">
            <QRCodeDisplay />
          </div>
        </div>
      </div>
    </main>
  );
}
