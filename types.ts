
export interface PrayerTimings {
  Fajr: string;
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Sunset: string;
  Maghrib: string;
  Isha: string;
  Imsak: string;
  Midnight: string;
}

export interface PrayerData {
  timings: PrayerTimings;
  date: {
    readable: string;
    hijri: {
      date: string;
      month: { en: string; ar: string };
      year: string;
      day: string;
      weekday: { en: string; ar: string };
    };
  };
  meta: {
    latitude: number;
    longitude: number;
    timezone: string;
    city: string;
  };
}

export interface City {
  name: string;
  id: string;
}

export enum PrayerName {
  Fajr = 'Subuh',
  Sunrise = 'Terbit',
  Dhuhr = 'Dzuhur',
  Asr = 'Ashar',
  Maghrib = 'Maghrib',
  Isha = 'Isya',
  Imsak = 'Imsak'
}
