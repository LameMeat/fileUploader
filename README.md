# Local File Uploader

Simple local web server to upload photos from your phone to this computer.

Tech: Next.js, React, TypeScript, SASS, PNPM (recommended), Jest.

Quick start

1. Install dependencies: pnpm install
2. Run dev: pnpm dev

Uploads are stored in the `uploads/` directory by the default local storage adapter. See `lib/storage` for the abstraction and `lib/storage/local.ts` for the local implementation.

Security and auth

This project currently has no auth. See `lib/auth/placeholder.ts` for a place to integrate session/JWT checks and middleware.

Next steps

- Add a storage adapter for S3 and wire it behind the `StorageAdapter` interface.
- Add optional authentication on the API route.
- Improve UI & progress reporting.
