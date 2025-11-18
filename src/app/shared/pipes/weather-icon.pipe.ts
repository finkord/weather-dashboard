import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'weatherIcon',
  standalone: true
})
export class WeatherIconPipe implements PipeTransform {

  // Величезний словник відповідностей для Google Weather API codes
  // Використовуємо іконки з набору Material Symbols Outlined
  private readonly iconMap: Record<string, string> = {
    // --- СОНЦЕ / ЯСНО ---
    'CLEAR': 'sunny',
    'SUNNY': 'sunny',
    'MOSTLY_CLEAR': 'sunny',
    'MAINLY_CLEAR': 'sunny',
    'FAIR': 'sunny',

    // --- ХМАРНІСТЬ ---
    'PARTLY_CLOUDY': 'partly_cloudy_day',  // Сонце + хмара
    'PARTLY_SUNNY': 'partly_cloudy_day',
    'VARIABLE_CLOUDS': 'partly_cloudy_day',
    
    // ВИПРАВЛЕНО ТУТ: "Переважно хмарно" тепер показує сонце з хмарою, 
    // щоб відрізнятися від суцільної хмарності ("Cloudy")
    'MOSTLY_CLOUDY': 'partly_cloudy_day',  
    'MAINLY_CLOUDY': 'partly_cloudy_day',

    // Суцільна хмарність
    'CLOUDY': 'cloud',                     // Тільки хмара
    'OVERCAST': 'cloud',                   // Тільки хмара
    'GLOOMY': 'cloud',

    // --- ТУМАН / ВИДИМІСТЬ ---
    'FOG': 'foggy',
    'MIST': 'mist',
    'HAZE': 'dehaze',
    'SMOKE': 'smoke_free',
    'DUST': 'air',
    'SAND': 'air',
    'SANDSTORM': 'cyclone',
    'VOLCANIC_ASH': 'volcano',

    // --- ВІТЕР ---
    'WINDY': 'air',
    'BREEZE': 'air',
    'STRONG_WIND': 'air',
    'GALE': 'cyclone',
    'TORNADO': 'tornado',
    'HURRICANE': 'cyclone',
    'TROPICAL_STORM': 'cyclone',

    // --- ДОЩ (RAIN) ---
    'RAIN': 'rainy',
    'LIGHT_RAIN': 'rainy',
    'MODERATE_RAIN': 'rainy',
    'HEAVY_RAIN': 'tsunami',         // "Велика вода" для сильного дощу
    'EXTREME_RAIN': 'tsunami',
    'SHOWERS': 'showers',            // Злива
    'RAIN_SHOWERS': 'showers',
    'LIGHT_RAIN_SHOWERS': 'showers',
    'HEAVY_RAIN_SHOWERS': 'tsunami',
    'SCATTERED_SHOWERS': 'rainy',
    'CHANCE_OF_RAIN': 'rainy',
    'CHANCE_OF_SHOWERS': 'showers',
    
    // --- МРЯКА (DRIZZLE) ---
    'DRIZZLE': 'grain',
    'LIGHT_DRIZZLE': 'grain',
    'HEAVY_DRIZZLE': 'grain',
    'FREEZING_DRIZZLE': 'ac_unit',

    // --- СНІГ (SNOW) ---
    'SNOW': 'ac_unit',
    'LIGHT_SNOW': 'weather_snowy',
    'MODERATE_SNOW': 'ac_unit',
    'HEAVY_SNOW': 'severe_cold',
    'SNOW_SHOWERS': 'weather_snowy',
    'LIGHT_SNOW_SHOWERS': 'weather_snowy',
    'SNOW_GRAINS': 'grain',
    'ICE_CRYSTALS': 'ac_unit',
    'ICE_PELLETS': 'hail',
    'HAIL': 'hail',
    'BLIZZARD': 'severe_cold',
    'BLOWING_SNOW': 'air',
    'CHANCE_OF_SNOW': 'weather_snowy',

    // --- ЗМІШАНІ ОПАДИ ---
    'SLEET': 'weather_mix',
    'RAIN_AND_SNOW': 'weather_mix',
    'FREEZING_RAIN': 'weather_mix',
    'CHANCE_OF_SNOW_AND_RAIN': 'weather_mix',

    // --- ГРОЗА (THUNDER) ---
    'THUNDERSTORM': 'thunderstorm',
    'THUNDERSHOWER': 'thunderstorm',
    'STORM': 'thunderstorm',
    'LIGHT_THUNDERSTORM': 'thunderstorm',
    'HEAVY_THUNDERSTORM': 'flash_on',
    'SEVERE_THUNDERSTORM': 'flash_on',
    'ISOLATED_THUNDERSTORMS': 'thunderstorm',
    'SCATTERED_THUNDERSTORMS': 'thunderstorm'
  };

  transform(iconType: string | null | undefined): string {
    if (!iconType) {
      return 'help_outline';
    }

    const normalizedCode = iconType.toUpperCase().replace(/\s+/g, '_');

    if (this.iconMap[normalizedCode]) {
      return this.iconMap[normalizedCode];
    }

    // Fallback logic
    if (normalizedCode.includes('THUNDER')) return 'thunderstorm';
    if (normalizedCode.includes('BLIZZARD')) return 'severe_cold';
    if (normalizedCode.includes('SNOW') || normalizedCode.includes('ICE')) return 'ac_unit';
    if (normalizedCode.includes('SLEET') || normalizedCode.includes('MIX')) return 'weather_mix';
    if (normalizedCode.includes('HAIL')) return 'hail';
    if (normalizedCode.includes('RAIN') || normalizedCode.includes('SHOWER')) return 'rainy';
    if (normalizedCode.includes('DRIZZLE')) return 'grain';
    if (normalizedCode.includes('FOG') || normalizedCode.includes('MIST') || normalizedCode.includes('HAZE')) return 'foggy';
    if (normalizedCode.includes('WIND') || normalizedCode.includes('BREEZE')) return 'air';
    
    // Якщо є слово "PARTLY" або "MOSTLY" - показуємо сонце з хмарою
    if (normalizedCode.includes('PARTLY') || normalizedCode.includes('MOSTLY') || normalizedCode.includes('VARIABLE')) return 'partly_cloudy_day';
    
    if (normalizedCode.includes('CLOUD') || normalizedCode.includes('OVERCAST')) return 'cloud';
    if (normalizedCode.includes('CLEAR') || normalizedCode.includes('SUN')) return 'sunny';

    console.warn(`[WeatherIconPipe] Unknown weather code: "${iconType}" (Normalized: "${normalizedCode}")`);
    return 'thermostat';
  }
}