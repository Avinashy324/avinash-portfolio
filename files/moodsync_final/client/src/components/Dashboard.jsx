import React, { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import MoodPicker from './MoodPicker';
import PlayerCard from './PlayerCard';

export default function Dashboard({theme}){
  const [weather, setWeather] = useState(null);
  const [query, setQuery] = useState('');
  const [tracks, setTracks] = useState([]);

  const getWeather = async () => {
    if (!navigator.geolocation) return alert('Geolocation not supported');
    navigator.geolocation.getCurrentPosition(async pos => {
      const { latitude, longitude } = pos.coords;
      const res = await axios.get(`/api/weather?lat=${latitude}&lon=${longitude}`);
      setWeather(res.data);
    }, err => alert('Location denied'));
  };

  const search = async () => {
    try {
      const res = await axios.get(`/api/spotify/search?q=${encodeURIComponent(query)}`);
      setTracks(res.data.tracks.items || []);
    } catch (err) {
      console.error(err);
      alert('Spotify search failed. Make sure you logged in via /auth/login.');
    }
  };

  return (
    <div className="space-y-8">
      <section className="glass p-6 flex items-center justify-between gap-6">
        <div>
          <h3 className="text-xl font-semibold neon">Mood + Weather</h3>
          <p className="text-sm text-zinc-300">Pick a mood or fetch your local weather to tune recommendations.</p>
          <div className="mt-4 flex gap-3">
            <button onClick={getWeather} className="px-4 py-2 rounded-md bg-indigo-600 hover:scale-102 transform transition">Get Local Weather</button>
            <a href="/auth/login" className="px-4 py-2 rounded-md bg-green-600">Login Spotify</a>
          </div>
        </div>
        <div className="text-right">
          {weather ? (
            <motion.div initial={{x:20, opacity:0}} animate={{x:0,opacity:1}} className="p-4 rounded-lg bg-white/5">
              <div className="font-medium">{weather.name} · {weather.weather[0].main}</div>
              <div className="text-3xl font-bold">{Math.round(weather.main.temp)}°C</div>
            </motion.div>
          ) : <div className="text-sm text-zinc-400">No weather data</div>}
        </div>
      </section>

      <MoodPicker onPick={m => console.log('picked', m)} />

      <section className="glass p-6">
        <h3 className="text-lg font-semibold">Search Spotify</h3>
        <div className="mt-4 flex gap-2">
          <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search songs, artists..." className="flex-1 rounded-md p-3 bg-black/20" />
          <button onClick={search} className="px-4 py-2 rounded-md bg-pink-500">Search</button>
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          {tracks.map(t => (
            <motion.div key={t.id} whileHover={{ scale: 1.03 }} className="p-3 rounded-lg bg-white/3">
              <div className="flex items-center gap-3">
                <img src={t.album.images?.[0]?.url} alt="" className="w-16 h-16 rounded-md object-cover floaty" />
                <div>
                  <div className="font-semibold">{t.name}</div>
                  <div className="text-sm text-zinc-300">{t.artists.map(a=>a.name).join(', ')}</div>
                  <div className="mt-2"><PlayerCard track={t} /></div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
