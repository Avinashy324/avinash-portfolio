require('dotenv').config();
const express = require('express');
const SpotifyWebApi = require('spotify-web-api-node');
const axios = require('axios');
const cookieParser = require('cookie-parser');
const path = require('path');

const app = express();
app.use(express.json());
app.use(cookieParser());

const {
  SPOTIFY_CLIENT_ID,
  SPOTIFY_CLIENT_SECRET,
  SPOTIFY_REDIRECT_URI,
  WEATHER_API_KEY,
  PORT = 4000
} = process.env;

const spotifyApi = new SpotifyWebApi({
  clientId: SPOTIFY_CLIENT_ID,
  clientSecret: SPOTIFY_CLIENT_SECRET,
  redirectUri: SPOTIFY_REDIRECT_URI
});

app.get('/auth/login', (req, res) => {
  const scopes = ['user-read-private','user-read-email','user-modify-playback-state','user-read-playback-state','streaming','user-library-read'];
  const authorizeURL = spotifyApi.createAuthorizeURL(scopes, 'state123');
  res.redirect(authorizeURL);
});

app.get('/auth/callback', async (req, res) => {
  const { code, error } = req.query;
  if (error) return res.status(400).send(error);
  try {
    const data = await spotifyApi.authorizationCodeGrant(code);
    const { access_token, refresh_token, expires_in } = data.body;
    res.cookie('spotify_access_token', access_token, { httpOnly: true, maxAge: expires_in * 1000 });
    res.cookie('spotify_refresh_token', refresh_token, { httpOnly: true });
    res.redirect(process.env.FRONTEND_URL || 'http://localhost:3000/?auth=success');
  } catch (err) {
    console.error(err);
    res.status(500).send('Auth failed');
  }
});

function setSpotifyFromToken(req) {
  const at = req.cookies['spotify_access_token'];
  if (at) spotifyApi.setAccessToken(at);
}

app.get('/api/spotify/search', async (req, res) => {
  try {
    setSpotifyFromToken(req);
    const q = req.query.q;
    if (!q) return res.status(400).json({ error: 'q required' });
    const data = await spotifyApi.searchTracks(q, { limit: 12 });
    res.json(data.body);
  } catch (err) {
    console.error('spotify search error:', err?.message || err);
    res.status(500).json({ error: 'Spotify search failed' });
  }
});

app.get('/api/weather', async (req, res) => {
  try {
    const { lat, lon } = req.query;
    if (!lat || !lon) return res.status(400).json({ error: 'lat & lon required' });
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lon)}&units=metric&appid=${WEATHER_API_KEY}`;
    const resp = await axios.get(url);
    res.json(resp.data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Weather fetch failed' });
  }
});

// Serve static client in production if built
app.use(express.static(path.join(__dirname, '../client/build')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});

app.listen(PORT, () => console.log(`Server running on ${PORT}`));
