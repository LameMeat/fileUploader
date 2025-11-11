"use client";
import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { detectLocalIP } from '../lib/network/detectLocalIp';

export default function QRCodeDisplay() {
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [targetUrl, setTargetUrl] = useState<string>('');

  useEffect(() => {
    let mounted = true;
    (async () => {
      const host = await detectLocalIP();
      const url = `${window.location.protocol}//${host}`;
      if (!mounted) return;
      setTargetUrl(url);
      try {
        const dataUrl = await QRCode.toDataURL(url, { margin: 2, width: 200 });
        if (mounted) setQrDataUrl(dataUrl);
      } catch (err) {
        console.error('QR generation failed', err);
      }
    })();
    return () => { mounted = false; };
  }, []);

  if (!qrDataUrl) return null;

  return (
    <div className="qr-root">
      <img src={qrDataUrl} alt={`QR for ${targetUrl}`} />
      <p className="qr-caption">{targetUrl}</p>
    </div>
  );
}
