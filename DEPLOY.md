# Deploying KAI Japanese Mastery to Vercel

## 1. Project Configuration
- **Framework Preset**: Vite
- **Root Directory**: `./`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

## 2. Environment Variables Required in Vercel
Set the following environment variables in your Vercel Project Settings under **Settings > Environment Variables**:

| Variable Name | Description | Example / Format |
|---|---|---|
| `VITE_SUPABASE_URL` | Your Supabase project URL | `https://<your-project>.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase public anonymous API key | `eyJhbGciOi...` |

> [!WARNING]
> **Client-Side Environment Variables Notice:**
> Any environment variable prefixed with `VITE_` is bundled into the client-side JavaScript output and is **publicly readable by every visitor** who opens your website in their browser.
> - Never store secret passwords, service-role keys, or private API keys in any `VITE_` variable.
> - `VITE_GEMINI_API_KEY` is **not required** and should **not** be set on public Vercel deployments. AI Tutor requests are handled via Supabase Edge Functions with server-side secrets or through KAI's built-in offline pedagogical engine.
