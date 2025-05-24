# PPTX Templater

This repository contains a Next.js frontend and a Python FastAPI backend for generating personalised PowerPoint presentations.

## Repository Structure

- `pptx-templater/` – Next.js 14 frontend
- `pptx-backend/` – FastAPI backend service

`PROJECT_OVERVIEW.md` provides a detailed architecture and roadmap.

## Deploying the Frontend to Vercel

1. Install the [Vercel CLI](https://vercel.com/download) and login.
2. From the repository root, run:
   ```bash
   vercel --prod
   ```
   The included `vercel.json` file builds and serves the `pptx-templater` app.

Vercel will detect the configuration, run `npm install` and `npm run build` inside `pptx-templater`, and deploy the built application.

## Backend Deployment

The backend can be deployed separately (e.g. AWS). See `pptx-backend/README.md` for details.
