
import React, { useState, useEffect } from 'react';

interface CountdownProps {
  targetTime: string; // HH:mm format
  label: string;
}

const Countdown: React.FC<CountdownProps> = ({ targetTime, label }) => {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const calculateTime = () => {
      const now = new Date();
      const [hours, minutes] = targetTime.split(':').map(Number);
      const target = new Date();
      target.setHours(hours, minutes, 0, 0);

      if (target < now) {
        target.setDate(target.getDate() + 1);
      }

      const diff = target.getTime() - now.getTime();
      const h = Math.floor(diff / (1000 * 60 * 60));
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft(`${h}j ${m}m ${s}d`);
    };

    calculateTime();
    const timer = setInterval(calculateTime, 1000);
    return () => clearInterval(timer);
  }, [targetTime]);

  return (
    <div className="text-center py-6 bg-gradient-to-br from-emerald-500/20 to-teal-600/20 rounded-2xl border border-emerald-500/30">
      <p className="text-emerald-300 text-sm font-medium mb-1">Menuju {label}</p>
      <h2 className="text-4xl font-bold font-mono tracking-tighter text-white drop-shadow-md">
        {timeLeft}
      </h2>
    </div>
  );
};

export default Countdown;
