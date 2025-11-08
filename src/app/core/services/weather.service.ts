import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Observable, catchError, map, of, switchMap } from 'rxjs';
import {
  DailyForecast, GoogleForecastDay, // Наш "чистий" інтерфейс
  GoogleForecastResponse, // "Сирий" інтерфейс
  LocationCoords,
} from '../models/weather.models';
import { environment } from '../../../environments/environment';

export interface SelectedLocation {
  name: string;
  coords: LocationCoords;
}

@Injectable({
  providedIn: 'root',
})
export class WeatherService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = '/weather/v1/forecast/days:lookup';

  public selectedLocation = signal<SelectedLocation | null>(null);

  /**
   * Отримує 10-денний прогноз, ОБРОБЛЯЮЧИ пагінацію
   */
  public getDailyForecast(
    location: LocationCoords
  ): Observable<DailyForecast[]> {
    // 1. Робимо перший запит
    return this._fetchForecastPage(location).pipe(
      switchMap((firstResponse) => {
        // 2. Трансформуємо першу сторінку
        const firstPageResults = this._transformResponse(firstResponse);

        // 3. Перевіряємо, чи є друга сторінка
        if (firstResponse.nextPageToken) {
          // 4. Якщо так, робимо другий запит
          return this._fetchForecastPage(
            location,
            firstResponse.nextPageToken
          ).pipe(
            map((secondResponse) => {
              // 5. Трансформуємо другу сторінку
              const secondPageResults = this._transformResponse(secondResponse);
              // 6. Об'єднуємо результати
              return [...firstPageResults, ...secondPageResults];
            })
          );
        }

        // 7. Якщо токена немає, повертаємо тільки результати першої сторінки
        return of(firstPageResults);
      }),
      catchError((err) => {
        console.error('WeatherService.getDailyForecast error:', err);
        return of([]); 
      })
    );
  }

  /**
   * Приватний метод для отримання ОДНІЄЇ "сторінки" прогнозу
   */
  private _fetchForecastPage(
    location: LocationCoords,
    pageToken?: string
  ): Observable<GoogleForecastResponse> {
    
    let params = new HttpParams()
      .set('location.latitude', location.latitude.toString())
      .set('location.longitude', location.longitude.toString())
      .set('days', '10'); // <-- ПАРАМЕТР МАЄ БУТИ ЗАВЖДИ

    if (pageToken) {
      params = params.set('pageToken', pageToken);
    }

    return this.http.get<GoogleForecastResponse>(this.apiUrl, { params });
  }

  /**
   * Приватний метод для трансформації відповіді у наш "чистий" формат
   */
  private _transformResponse(
    response: GoogleForecastResponse
  ): DailyForecast[] {
    if (!response || !response.forecastDays) {
      return [];
    }

    // (Ця логіка та сама, що й раніше)
    return response.forecastDays.map((day: GoogleForecastDay): DailyForecast => {
      return {
        date: day.displayDate,
        tempMax: day.maxTemperature.degrees,
        tempMin: day.minTemperature.degrees,
        description: day.daytimeForecast.weatherCondition.description.text,
        iconType: day.daytimeForecast.weatherCondition.type,
        precipitationChance:
          day.daytimeForecast.precipitation.probability.percent,
        windSpeed: day.daytimeForecast.wind.speed.value,
      };
    });
  }

  public setSelectedLocation(name: string, location: LocationCoords): void {
    this.selectedLocation.set({ name: name, coords: location });
  }
}