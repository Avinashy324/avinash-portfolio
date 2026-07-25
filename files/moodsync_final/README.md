MoodSync - Full project (client + server) with futuristic UI, light/dark toggle, and deployment configs.

Quick start (local):
1. Unzip project.
2. server/.env: copy .env.example and set SPOTIFY_CLIENT_SECRET (required).
3. cd server && npm install && npm run dev
4. cd client && npm install && npm start
5. Open http://localhost:3000

Deployment:
- Push repo to GitHub.
- Import to Render (render.yaml will configure backend).
- Import client to Netlify (netlify.toml will configure frontend).
- Update Spotify app Redirect URIs to include Render backend callback URL.
