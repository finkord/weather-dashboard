import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Observable, catchError, of } from 'rxjs';
import {
  DailyForecast, // Тільки наш "чистий" інтерфейс
  LocationCoords,
} from '../models/weather.models';
// "Сирі" інтерфейси GoogleForecastResponse/GoogleForecastDay більше не потрібні

export interface SelectedLocation {
  name: string;
  coords: LocationCoords;
}

@Injectable({
  providedIn: 'root',
})
export class WeatherService {
  private readonly http = inject(HttpClient);
  private readonly forecastUrl = '/api/weather'; // Наш BFF ендпоінт

  public selectedLocation = signal<SelectedLocation | null>(null);

  /**
   * Отримує 10-денний прогноз.
   * BFF сам обробляє пагінацію, трансформацію та кешування.
   */
  public getDailyForecast(
    location: LocationCoords
  ): Observable<DailyForecast[]> {
    
    // Передаємо 'lat' та 'lon', як очікує наш BFF
    const params = new HttpParams()
      .set('lat', location.latitude.toString())
      .set('lon', location.longitude.toString());

    // Просто робимо GET запит і очікуємо чистий масив DailyForecast[]
    return this.http.get<DailyForecast[]>(this.forecastUrl, { params }).pipe(
      catchError((err) => {
        console.error('WeatherService.getDailyForecast error:', err);
        return of([]); // Повертаємо порожній масив у разі помилки
      })
    );
  }

  public setSelectedLocation(name: string, location: LocationCoords): void {
    this.selectedLocation.set({ name: name, coords: location });
  }
}