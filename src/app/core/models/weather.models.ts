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

// --- "Сирі" інтерфейси, які повертає Google API (на основі вашого JSON) ---

// 1. Повна відповідь
export interface GoogleForecastResponse {
  forecastDays: GoogleForecastDay[];
  nextPageToken?: string;
}

// 2. Один день (елемент масиву)
export interface GoogleForecastDay {
  displayDate: GoogleDate;
  maxTemperature: {
    degrees: number;
    unit: string;
  };
  minTemperature: {
    degrees: number;
    unit: string;
  };
  // Ми будемо брати дані з 'daytimeForecast'
  daytimeForecast: {
    weatherCondition: {
      description: {
        text: string;
      };
      type: string; // "CLOUDY", "LIGHT_RAIN"
    };
    precipitation: {
      probability: {
        percent: number;
      };
    };
    wind: {
      speed: {
        value: number;
        unit: string;
      };
    };
  };
  // (nighttimeForecast та інші поля ігноруємо для простоти)
}