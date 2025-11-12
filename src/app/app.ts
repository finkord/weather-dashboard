import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

// 1. Імпортуємо наші нові Standalone-компоненти
import { LocationSearchComponent } from './features/location-search/location-search.component';
import { WeatherForecastComponent } from './features/weather-forecast/weather-forecast.component';
import { ClockComponent } from './features/clock/clock.component'; // <--- NEW IMPORT

@Component({
  selector: 'app-root',
  // 2. Додаємо його до 'imports'
  imports: [RouterOutlet, LocationSearchComponent, WeatherForecastComponent, ClockComponent], // <--- MODIFIED
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  // 3. Оновлюємо title для нашого заголовка
  protected readonly title = signal('Angular Weather Dashboard');
}