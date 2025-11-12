// --- "Чисті" інтерфейси, які використовує наш додаток ---

export interface LocationCoords {
  latitude: number;
  longitude: number;
}

export interface GoogleDate {
  year: number;
  month: number;
  day: number;
}

// Це чиста, спрощена модель, яку очікує наш компонент
export interface DailyForecast {
  date: GoogleDate;
  tempMax: number;
  tempMin: number;
  description: string;
  iconType: string; // Наприклад, "CLOUDY", "CLEAR"
  precipitationChance: number;
  windSpeed: number;
}