# Next.js Setup (local)

This repository was scaffolded with a minimal Next.js App Router setup.

PowerShell commands (run in project root `c:\Users\PC\Desktop\Gumbotech\invoice-tracker-ui`):

```powershell
# 1) Install dependencies
npm install

# 2) Start development server
npm run dev

# 3) Build for production
npm run build

# 4) Run production build locally
npm run start
```

Notes:
- The project uses the App Router (`/app` directory).
- Replace `next`, `react`, and `react-dom` versions in `package.json` if you need pinned versions.
- Add assets to the `public/` folder.
 
Cross-origin API and cookie-based auth
- If your API is hosted on a different origin, set the API base URL using an environment variable in the frontend. Create a `.env.local` with:

```text
NEXT_PUBLIC_API_BASE=https://api.example.com
```

- The auth service supports cookies (server-set JWT cookie). The server must:
	- Include `Access-Control-Allow-Credentials: true` in responses.
	- Use a specific origin value in `Access-Control-Allow-Origin` (do NOT use `*`).
	- Set the cookie with `SameSite=None; Secure` when the API is cross-site, and send it over HTTPS.
	- Allow the methods/headers your frontend uses (CORS preflight).

- The frontend service will send cookies using `credentials: 'include'`. You can set the base URL programmatically with the auth helper:

```js
import { setBaseUrl } from './services/auth'
setBaseUrl(process.env.NEXT_PUBLIC_API_BASE)
```
