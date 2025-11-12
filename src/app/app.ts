import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

// 1. Імпортуємо наші нові Standalone-компоненти
import { LocationSearchComponent } from './features/location-search/location-search.component';
import { WeatherForecastComponent } from './features/weather-forecast/weather-forecast.component';

@Component({
  selector: 'app-root',
  // 2. Додаємо їх до 'imports', щоб шаблон міг їх "бачити"
  imports: [RouterOutlet, LocationSearchComponent, WeatherForecastComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  // 3. Оновлюємо title для нашого заголовка
  protected readonly title = signal('Angular Weather Dashboard');
}