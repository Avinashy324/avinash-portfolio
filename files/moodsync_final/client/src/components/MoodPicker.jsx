import React from 'react';
import { motion } from 'framer-motion';

const moods = [
  {id: 'chill', emoji: '😌', label: 'Chill'},
  {id: 'happy', emoji: '😄', label: 'Happy'},
  {id: 'focus', emoji: '🤓', label: 'Focus'},
  {id: 'party', emoji: '🎉', label: 'Party'}
];

export default function MoodPicker({onPick}){
  return (
    <div className="glass p-4">
      <h4 className="font-semibold neon">Choose a mood</h4>
      <div className="mt-3 flex gap-3">
        {moods.map(m => (
          <motion.button key={m.id} whileHover={{ scale: 1.08 }} onClick={()=> onPick(m.id)} className="flex items-center gap-3 p-3 rounded-xl border border-white/5">
            <span className="text-2xl">{m.emoji}</span>
            <div className="text-sm text-zinc-200">{m.label}</div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
