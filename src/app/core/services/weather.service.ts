import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  DailyForecast,
  DailyForecastResponse,
  LocationCoords,
} from '../models/weather.models';

export interface SelectedLocation {
  name: string;
  coords: LocationCoords;
}

@Injectable({
  providedIn: 'root',
})
export class WeatherService {
  // Використовуємо сучасний 'inject()' для DI
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.weatherApi.baseUrl;

  /**
   * STATE: Сигнал, що зберігає поточну обрану локацію.
   * `null` означає, що локація ще не обрана.
   */
  public selectedLocation = signal<SelectedLocation | null>(null);

  /**
   * Отримує 10-денний прогноз погоди для заданих координат.
   * @param location Координати (широта та довгота)
   * @returns Observable з масивом щоденних прогнозів
   */
  public getDailyForecast(
    location: LocationCoords
  ): Observable<DailyForecast[]> {
    const url = `${this.apiUrl}/forecast:lookup`;

    // Параметри запиту, як вимагає Google Weather API
    const params = new HttpParams()
      .set('latitude', location.latitude.toString())
      .set('longitude', location.longitude.toString())
      .set('daily', 'true') // Вказуємо, що нам потрібен саме денний прогноз
      .set('days', '10') // Кількість днів (макс. 10 для цього API)
      .set('temperatureUnit', 'C'); // Використовуємо Цельсій

    return this.http
      .get<DailyForecastResponse>(url, { params })
      .pipe(
        // Використовуємо 'map' для того, щоб повернути
        // компоненту чистий масив, а не всю відповідь API
        map((response) => response.dailyForecasts)
      );
  }

  // У майбутньому ми можемо додати сюди методи:
  // - getCurrentConditions(location: LocationCoords)
  // - getHourlyForecast(location: LocationCoords)

  /**
   * PUBLIC ACTION: Метод для оновлення обраної локації.
   * Викликається з `LocationSearchComponent`.
   */
  public setSelectedLocation(name: string, location: LocationCoords): void {
    this.selectedLocation.set({ name: name, coords: location });
  }
}