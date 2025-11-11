import React from 'react';
import '../styles/globals.sass';

export const metadata = {
  title: 'Local File Uploader'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
      </head>
      <body>{children}</body>
    </html>
  );
}
