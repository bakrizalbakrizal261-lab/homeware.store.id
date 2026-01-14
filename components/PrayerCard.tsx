
import React from 'react';
import { PrayerName } from '../types';
import { PRAYER_ICONS } from '../constants';

interface PrayerCardProps {
  name: keyof typeof PrayerName;
  time: string;
  isNext: boolean;
}

const PrayerCard: React.FC<PrayerCardProps> = ({ name, time, isNext }) => {
  return (
    <div 
      className={`flex items-center justify-between p-4 rounded-xl transition-all duration-300 border ${
        isNext 
          ? 'bg-emerald-600/40 border-emerald-400 shadow-lg shadow-emerald-900/50 scale-[1.02]' 
          : 'bg-white/5 border-white/10 hover:bg-white/10'
      }`}
    >
      <div className="flex items-center gap-4">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-emerald-900/50 text-xl`}>
          {PRAYER_ICONS[name] || <i className="fa-solid fa-clock"></i>}
        </div>
        <div>
          <h3 className="font-semibold text-slate-100">{PrayerName[name]}</h3>
          {isNext && <span className="text-[10px] uppercase tracking-wider bg-emerald-400 text-emerald-950 px-2 py-0.5 rounded-full font-bold">Selanjutnya</span>}
        </div>
      </div>
      <div className="text-right">
        <span className="text-2xl font-bold font-mono text-emerald-100">{time}</span>
      </div>
    </div>
  );
};

export default PrayerCard;
