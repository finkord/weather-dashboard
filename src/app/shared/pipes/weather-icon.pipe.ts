import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'weatherIcon',
  standalone: true
})
export class WeatherIconPipe implements PipeTransform {

  transform(iconType: string | null | undefined): string {
    // 1. Захист від пустих даних
    if (!iconType) {
      return 'help_outline';
    }

    // 2. Нормалізація: верхній регістр + заміна підкреслень на пробіли
    // Наприклад: "LIGHT_RAIN" -> "LIGHT RAIN"
    const code = iconType.toUpperCase().replace(/_/g, ' ');

    // 3. Розумний пошук (ПОРЯДОК ВАЖЛИВИЙ!)
    
    // Гроза (Thunder)
    if (code.includes('THUNDER')) return 'flash_on'; // Безпечна іконка

    // Сніг / Лід (Snow, Ice, Blizzard)
    if (code.includes('SNOW') || code.includes('BLIZZARD') || code.includes('ICE') || code.includes('SLEET') || code.includes('FREEZING')) {
      return 'ac_unit';
    }

    // Дощ (Rain, Drizzle, Shower)
    if (code.includes('RAIN') || code.includes('DRIZZLE') || code.includes('SHOWER') || code.includes('WATER')) {
      return 'grain'; // 'grain' точно є в шрифті (виглядає як дощ)
    }

    // Туман (Fog, Mist)
    if (code.includes('FOG') || code.includes('MIST') || code.includes('HAZE')) {
      return 'blur_on'; // Виглядає як туманність
    }

    // Мінлива хмарність (Partly Cloudy) - має бути ПЕРЕД просто Cloudy
    if (code.includes('PARTLY') || code.includes('VARIABLE')) {
      return 'wb_cloudy'; // Хмара з сонцем у старій версії Material
    }

    // Хмарно (Cloudy, Overcast)
    if (code.includes('CLOUD') || code.includes('OVERCAST') || code.includes('GLOOMY')) {
      return 'cloud';
    }

    // Ясно (Clear, Sunny)
    if (code.includes('CLEAR') || code.includes('SUNNY') || code.includes('FAIR')) {
      return 'wb_sunny';
    }

    // Вітер (Wind)
    if (code.includes('WIND') || code.includes('BREEZE')) {
      return 'air'; // Якщо 'air' не спрацює, можна замінити на 'toys' (вентилятор)
    }

    // 4. Якщо нічого не знайшли - логуємо і показуємо питання
    console.warn(`[WeatherIconPipe] Невідомий код погоди: "${iconType}"`);
    return 'help_outline';
  }
}