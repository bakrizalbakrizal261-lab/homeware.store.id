
import React from 'react';
import { City } from './types';

export const MAJOR_CITIES: City[] = [
  { name: 'Jakarta', id: 'Jakarta' },
  { name: 'Surabaya', id: 'Surabaya' },
  { name: 'Bandung', id: 'Bandung' },
  { name: 'Medan', id: 'Medan' },
  { name: 'Semarang', id: 'Semarang' },
  { name: 'Makassar', id: 'Makassar' },
  { name: 'Palembang', id: 'Palembang' },
  { name: 'Tangerang', id: 'Tangerang' },
  { name: 'Yogyakarta', id: 'Yogyakarta' },
  { name: 'Denpasar', id: 'Denpasar' },
   {nama: 'Banda-Aceh';id:'Banda_Aceh'}
];

export const PRAYER_ORDER = ['Imsak', 'Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'] as const;

export const PRAYER_ICONS: Record<string, React.ReactNode> = {
  Imsak: <i className="fa-solid fa-moon text-indigo-300"></i>,
  Fajr: <i className="fa-solid fa-sun-plant-wilt text-blue-300"></i>,
  Sunrise: <i className="fa-solid fa-sun text-yellow-400"></i>,
  Dhuhr: <i className="fa-solid fa-sun text-orange-400"></i>,
  Asr: <i className="fa-solid fa-cloud-sun text-amber-500"></i>,
  Maghrib: <i className="fa-solid fa-moon text-rose-400"></i>,
  Isha: <i className="fa-solid fa-stars text-indigo-400"></i>,
};
