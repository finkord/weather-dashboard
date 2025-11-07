/**
 * Модель для координат
 */
export interface LocationCoords {
  latitude: number;
  longitude: number;
}

/**
 * Відповідь API для 10-денного прогнозу (спрощена)
 * Базується на документації Google Weather API
 */
export interface DailyForecastResponse {
  dailyForecasts: DailyForecast[];
}

export interface DailyForecast {
  date: GoogleDate;
  temperature: Temperature;
  temperatureMin: Temperature;
  temperatureMax: Temperature;
  shortDescription: string;
  iconCode: number; // Код іконки (наприклад, 800 для 'Clear')
  precipitationChance: number; // %
  windSpeed: number; // м/с
  windDirection: string; // "NW"
}

// Допоміжні типи
interface Temperature {
  value: number;
  unit: 'C' | 'F';
}

interface GoogleDate {
  year: number;
  month: number;
  day: number;
}