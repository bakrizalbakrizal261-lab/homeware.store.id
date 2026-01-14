
import { PrayerData } from '../types';

export const fetchPrayerTimesByCity = async (city: string): Promise<PrayerData> => {
  const response = await fetch(
    `https://api.aladhan.com/v1/timingsByCity?city=${city}&country=Indonesia&method=11`
  );
  if (!response.ok) throw new Error('Gagal mengambil jadwal sholat');
  const result = await response.json();
  return {
    ...result.data,
    meta: { ...result.data.meta, city }
  };
};

export const fetchPrayerTimesByCoords = async (lat: number, lng: number): Promise<PrayerData> => {
  const response = await fetch(
    `https://api.aladhan.com/v1/timings?latitude=${lat}&longitude=${lng}&method=11`
  );
  if (!response.ok) throw new Error('Gagal mengambil jadwal sholat berdasarkan lokasi');
  const result = await response.json();
  return result.data;
};
