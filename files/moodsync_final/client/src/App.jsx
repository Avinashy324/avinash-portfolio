import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Dashboard from './components/Dashboard';
import './App.css';

export default function App(){
  const [theme, setTheme] = useState(() => localStorage.getItem('moodsync_theme') || 'dark');
  useEffect(()=>{ document.documentElement.setAttribute('data-theme', theme); localStorage.setItem('moodsync_theme', theme); },[theme]);
  return (
    <div className={`min-h-screen transition-colors duration-500 ${theme==='dark'?'bg-gradient-to-br from-black via-zinc-900 to-slate-900 text-white':'bg-white text-slate-900'}`}>
      <header className="p-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-wide">MoodSync</h1>
        <div className="flex items-center gap-3">
          <button onClick={()=> setTheme(t=> t==='dark'?'light':'dark')} className="rounded-full p-2 border">
            Toggle Theme
          </button>
        </div>
      </header>
      <main className="p-6">
        <AnimatePresence mode='wait'>
          <motion.div initial={{opacity:0, y:10}} animate={{opacity:1,y:0}} exit={{opacity:0,y:10}} transition={{duration:0.45}}>
            <Dashboard theme={theme} />
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
