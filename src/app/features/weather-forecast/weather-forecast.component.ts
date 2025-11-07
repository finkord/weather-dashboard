import { AsyncPipe, CommonModule, DatePipe, JsonPipe, DecimalPipe } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Observable, of } from 'rxjs';
import { catchError, filter, map, startWith, switchMap } from 'rxjs/operators';

import { DailyForecast, GoogleDate } from '../../core/models/weather.models';
import { WeatherService } from '../../core/services/weather.service';

// Створюємо інтерфейс для управління станом UI
interface ForecastState {
  status: 'initial' | 'loading' | 'success' | 'error';
  data?: DailyForecast[];
  error?: any;
}

@Component({
  selector: 'app-weather-forecast',
  standalone: true,
  imports: [
    CommonModule,
    AsyncPipe,
    DatePipe,        // Для форматування дати
    JsonPipe,        // Для показу помилки
    DecimalPipe,     // Для форматування температури (number:'1.0-0')
    MatCardModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './weather-forecast.component.html',
  styleUrls: ['./weather-forecast.component.scss'],
  // Реєструємо DatePipe та DecimalPipe для використання у шаблоні
  providers: [DatePipe, DecimalPipe], 
})
export class WeatherForecastComponent {
  private weatherService = inject(WeatherService);

  /**
   * 1. Створюємо computed-сигнал для отримання назви обраної локації.
   */
  public selectedLocationName = computed(
    () => this.weatherService.selectedLocation()?.name
  );

  /**
   * 2. Створюємо головний потік стану, що реагує на зміни локації.
   */
  public forecastState$: Observable<ForecastState> = toObservable(
    this.weatherService.selectedLocation
  ).pipe(
    // 3. Реагуємо, тільки якщо локація дійсно обрана (не null)
    filter((location) => !!location),
    
    // 4. Використовуємо switchMap для скасування попередніх запитів
    switchMap((location) =>
      // location! - ми впевнені, що він не null завдяки filter()
      this.weatherService.getDailyForecast(location!.coords).pipe(
        // 5a. Успіх: повертаємо дані
        map((data) => ({ status: 'success', data } as ForecastState)),
        
        // 5b. Завантаження: показуємо спіннер перед початком запиту
        startWith({ status: 'loading' } as ForecastState),
        
        // 5c. Помилка: перехоплюємо і повертаємо об'єкт помилки
        catchError((error) =>
          of({ status: 'error', error } as ForecastState)
        )
      )
    ),
    
    // 6. Початковий стан (до того, як будь-яка локація була обрана)
    startWith({ status: 'initial' } as ForecastState)
  );

  /**
   * Допоміжна функція для перетворення дати з Google API у об'єкт Date.
   */
  public getJsDate(googleDate: GoogleDate): Date {
    return new Date(googleDate.year, googleDate.month - 1, googleDate.day);
  }

  /**
   * Допоміжна функція для мапінгу кодів іконок.
   * У комерційному продукті тут був би 'WeatherIconPipe' або компонент,
   * який працює з вашою бібліотекою іконок (наприклад, SVG спрайтом).
   */
  public getWeatherIconClass(iconCode: number): string {
    // Це псевдо-реалізація. Нам потрібна реальна бібліотека іконок (напр. weather-icons).
    // `wi` - це префікс для weather-icons.
    if (iconCode >= 200 && iconCode < 300) return 'wi wi-thunderstorm';
    if (iconCode >= 300 && iconCode < 400) return 'wi wi-sprinkle';
    if (iconCode >= 500 && iconCode < 600) return 'wi wi-rain';
    if (iconCode >= 600 && iconCode < 700) return 'wi wi-snow';
    if (iconCode >= 700 && iconCode < 800) return 'wi wi-fog';
    if (iconCode === 800) return 'wi wi-day-sunny';
    if (iconCode === 801) return 'wi wi-day-cloudy';
    if (iconCode > 801) return 'wi wi-cloudy';
    return 'wi wi-na';
  }
}