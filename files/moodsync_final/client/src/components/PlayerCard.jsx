import React from 'react';
export default function PlayerCard({track}){
  return (
    <div className="flex items-center gap-2 mt-2">
      <button className="px-3 py-1 rounded-md bg-white/5">Play</button>
      <button className="px-2 py-1 rounded-md border">Save</button>
    </div>
  );
}
