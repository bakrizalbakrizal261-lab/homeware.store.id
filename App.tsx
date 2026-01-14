
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { PrayerData, PrayerName } from './types';
import { fetchPrayerTimesByCity, fetchPrayerTimesByCoords } from './services/prayerService';
import { getSpiritualInsight } from './services/geminiService';
import { MAJOR_CITIES, PRAYER_ORDER } from './constants';
import PrayerCard from './components/PrayerCard';
import Countdown from './components/Countdown';

const App: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [prayerData, setPrayerData] = useState<PrayerData | null>(null);
  const [selectedCity, setSelectedCity] = useState(MAJOR_CITIES[0].id);
  const [nextPrayer, setNextPrayer] = useState<{ name: keyof typeof PrayerName; time: string } | null>(null);
  const [insight, setInsight] = useState<{ quote: string; source: string; message: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const initialLoadDone = useRef(false);

  const determineNextPrayer = useCallback((timings: any) => {
    const now = new Date();
    const currentTimeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    
    // We only care about main prayer times
    const prayersToCheck = PRAYER_ORDER;
    
    for (const prayer of prayersToCheck) {
      if (timings[prayer] > currentTimeStr) {
        return { name: prayer as keyof typeof PrayerName, time: timings[prayer] };
      }
    }
    // If none found for today, it's Imsak/Fajr of tomorrow
    return { name: 'Imsak' as keyof typeof PrayerName, time: timings['Imsak'] };
  }, []);

  const loadData = useCallback(async (cityId: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchPrayerTimesByCity(cityId);
      setPrayerData(data);
      const next = determineNextPrayer(data.timings);
      setNextPrayer(next);
      
      // Get AI insights
      const aiResponse = await getSpiritualInsight(next.name, cityId);
      setInsight(aiResponse);
    } catch (err) {
      setError('Gagal memuat data. Silakan coba lagi.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [determineNextPrayer]);

  useEffect(() => {
    if (!initialLoadDone.current) {
      loadData(selectedCity);
      initialLoadDone.current = true;
    }
  }, [selectedCity, loadData]);

  const handleLocationDetection = () => {
    if (!navigator.geolocation) {
      alert('Geolokasi tidak didukung oleh browser Anda');
      return;
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const data = await fetchPrayerTimesByCoords(position.coords.latitude, position.coords.longitude);
          setPrayerData(data);
          const next = determineNextPrayer(data.timings);
          setNextPrayer(next);
          // Update city context for AI (approximated)
          const aiResponse = await getSpiritualInsight(next.name, "Lokasi Anda");
          setInsight(aiResponse);
        } catch (err) {
          setError('Gagal mendeteksi lokasi');
        } finally {
          setLoading(false);
        }
      },
      () => {
        setError('Izin lokasi ditolak');
        setLoading(false);
      }
    );
  };

  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCity = e.target.value;
    setSelectedCity(newCity);
    loadData(newCity);
  };

  return (
    <div className="max-w-md mx-auto px-4 py-10 md:py-20 animate-fade-in">
      {/* Header Section */}
      <header className="text-center mb-8">
        <div className="inline-block p-4 bg-white/10 backdrop-blur-md rounded-full mb-4 shadow-xl border border-white/20">
          <i className="fa-solid fa-mosque text-4xl text-emerald-400"></i>
        </div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Bakrizal Jadwal</h1>
        <p className="text-emerald-400/80 font-medium">{prayerData?.date.readable || 'Memuat...'}</p>
        <div className="mt-2 flex items-center justify-center gap-2 text-xs text-slate-400 bg-white/5 w-fit mx-auto px-3 py-1 rounded-full border border-white/10">
          <i className="fa-solid fa-calendar-day"></i>
          <span>{prayerData?.date.hijri.date} {prayerData?.date.hijri.month.ar} {prayerData?.date.hijri.year}H</span>
        </div>
      </header>

      {/* Main Container */}
      <main className="space-y-6">
        {/* Controls */}
        <div className="flex gap-3">
          <select 
            value={selectedCity}
            onChange={handleCityChange}
            className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 appearance-none cursor-pointer"
          >
            {MAJOR_CITIES.map(city => (
              <option key={city.id} value={city.id} className="bg-slate-900">{city.name}</option>
            ))}
          </select>
          <button 
            onClick={handleLocationDetection}
            className="bg-emerald-600 hover:bg-emerald-500 transition-colors p-3 rounded-xl shadow-lg shadow-emerald-900/40 border border-emerald-400/30"
            title="Deteksi Lokasi Otomatis"
          >
            <i className="fa-solid fa-location-crosshairs text-white"></i>
          </button>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <div className="w-12 h-12 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin"></div>
            <p className="text-emerald-400 animate-pulse">Menghitung waktu mustajab...</p>
          </div>
        ) : error ? (
          <div className="bg-rose-500/20 border border-rose-500/40 p-4 rounded-xl text-center text-rose-200">
            {error}
            <button onClick={() => loadData(selectedCity)} className="block mx-auto mt-2 underline text-sm">Coba Lagi</button>
          </div>
        ) : (
          <>
            {/* Next Prayer Countdown */}
            {nextPrayer && <Countdown targetTime={nextPrayer.time} label={PrayerName[nextPrayer.name]} />}

            {/* Prayer List */}
            <div className="grid gap-3">
              {PRAYER_ORDER.map((prayer) => (
                <PrayerCard 
                  key={prayer} 
                  name={prayer} 
                  time={prayerData?.timings[prayer] || '--:--'}
                  isNext={nextPrayer?.name === prayer}
                />
              ))}
            </div>

            {/* Gemini Insight Card */}
            {insight && (
              <div className="relative group bg-slate-900/50 backdrop-blur-md rounded-2xl border border-white/5 p-6 shadow-2xl overflow-hidden mt-8 transition-all hover:border-emerald-500/30">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <i className="fa-solid fa-quote-right text-5xl"></i>
                </div>
                <div className="relative z-10">
                   <div className="flex items-center gap-2 mb-3">
                    <span className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center text-xs">
                       <i className="fa-solid fa-star-and-crescent text-emerald-400"></i>
                    </span>
                    <h4 className="text-xs font-bold uppercase tracking-widest text-emerald-400">Hikmah Harian</h4>
                  </div>
                  <p className="text-lg font-serif italic text-slate-100 mb-3 leading-relaxed">
                    "{insight.quote}"
                  </p>
                  <p className="text-xs text-emerald-400 font-semibold mb-4">— {insight.source}</p>
                  <div className="pt-4 border-t border-white/5">
                    <p className="text-sm text-slate-300">
                      <i className="fa-solid fa-heart text-rose-400 mr-2"></i>
                      {insight.message}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-12 text-center pb-8">
        <p className="text-slate-500 text-xs">
          Powered by Aladhan API & Google Gemini AI
        </p>
        <p className="text-slate-600 text-[10px] mt-1">
          © {new Date().getFullYear()} Nurul Jadwal • Made for Dev
        </p>
      </footer>
    </div>
  );
};

export default App;
