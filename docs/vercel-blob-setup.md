# Vercel Blob Setup

The app uses [Vercel Blob](https://vercel.com/docs/storage/vercel-blob) for storing organization header images (uploaded in admin → Organizations → [org] → General tab).

## 1. Create a Blob store

1. Open your [Vercel project](https://vercel.com/dashboard) → **Storage**.
2. Click **Create Database** (or **Add Storage**) and choose **Blob**.
3. Name the store (e.g. `race-results-blob`) and create it.

Vercel adds `BLOB_READ_WRITE_TOKEN` to the project environment.

**Note:** Send the `BLOB_READ_WRITE_TOKEN` value to Kyle and Shamit so they can add it to their local env

## 2. Local development

Pull the token into your local env:

```bash
vercel env pull .env.local
```

Or copy `BLOB_READ_WRITE_TOKEN` from the Vercel project **Settings** → **Environment Variables** into `.env` or `.env.local`:

```env
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_...
```

## 3. Production / Preview

The token is automatically available in Vercel deployments once the Blob store is linked and the variable is set for the right environment (Production, Preview, Development).

## Notes

- Header images are stored under `org-headers/{orgId}/{filename}` and the returned URL is saved in the `orgs.header_image_url` column.
- Server uploads are subject to Vercel’s request body size limit (~4.5 MB); larger files may require client uploads.
