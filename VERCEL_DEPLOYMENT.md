# Vercel Deployment Guide for PROJECT-ANCILE

## Method 1: GitHub Integration (Recommended)

Since all code is pushed to GitHub, use Vercel's GitHub integration:

### Steps

1. Go to <https://vercel.com/dashboard>
2. Click "Add New..." → "Project"
3. Import your repository: `SourishSenapati/PROJECT-ANCILE`
4. Configure build settings:
   - **Framework Preset**: Other
   - **Root Directory**: `./` (leave as is)
   - **Build Command**: `cd frontend && npm install && npm run build`
   - **Output Directory**: `frontend/dist`
   - **Install Command**: `npm install`

5. Click "Deploy"

### Environment Variables (if needed)

Add these in the Vercel dashboard under Settings → Environment Variables:

- No environment variables required for basic deployment

## Method 2: Vercel CLI (Alternative)

If you prefer CLI deployment:

### Prerequisites

```bash
npm install -g vercel
```

### Login to Vercel

```bash
vercel login
```

### Deploy

```bash
# From project root
vercel --prod
```

### Configuration

When prompted:

- Set up and deploy? **Yes**
- Which scope? **SourishSenapati** (or your team)
- Link to existing project? **No** (first time) or **Yes** (subsequent)
- Project name? **project-ancile** (or any name)
- Directory? **./** (current directory)
- Override settings? **Yes**
  - Build Command: `cd frontend && npm install && npm run build`
  - Output Directory: `frontend/dist`
  - Development Command: `cd frontend && npm run dev`

## Vercel Configuration

The project includes `vercel.json` with:

- Frontend build from `frontend/` directory
- Output to `frontend/dist`
- API routes at `/api/*` pointing to backend
- SPA fallback routing to `index.html`

## Post-Deployment

After deployment:

1. Visit your deployment URL (shown in terminal or dashboard)
2. Test all routes:
   - `/` - Home page with hero, inventory, rewards
   - `/admin` - Admin panel (login: admin/oyo-copy)
   - `/events/davos` - Event microsite demo
3. Verify mobile responsiveness
4. Test interactive trust indicators

## Troubleshooting

### Build Fails

- Check that `frontend/package.json` exists
- Verify all dependencies are in package.json
- Check build logs in Vercel dashboard

### Routes Not Working

- Ensure `vercel.json` is in project root
- Verify SPA routing configuration
- Check that `frontend/dist/index.html` is generated

### Backend API Issues

- Backend requires separate deployment (Render/Railway recommended)
- Update API URLs in frontend to point to backend deployment
- Set CORS headers on backend for Vercel domain

## Current Status

- Code: Pushed to GitHub (main branch)
- Build: Tested locally (successful)
- Bundle: 420.32 KB (gzipped: 130 KB)
- Ready: Yes

## Quick Deploy (GitHub Method)

1. Visit: https://vercel.com/new
2. Select: `SourishSenapati/PROJECT-ANCILE`
3. Configure as shown above
4. Deploy

Your application will be live at: `project-ancile.vercel.app` (or custom domain)
