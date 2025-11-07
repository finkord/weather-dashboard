import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

// (Інтерфейси залишаємо без змін)
export interface PlaceSuggestion {
  description: string;
  placeId: string;
}

export interface PlaceDetails {
  name: string;
  location: {
    latitude: number;
    longitude: number;
  };
}

@Injectable({
  providedIn: 'root',
})
export class PlacesService {
  private http = inject(HttpClient);
  private readonly apiUrl = '/maps/api/place';

  /**
   * Пошук міст за введеним текстом (Autocomplete)
   */
  public findCities(query: string): Observable<PlaceSuggestion[]> {
    const url = `${this.apiUrl}/autocomplete/json`;
    const params = new HttpParams()
      .set('input', query)
      .set('types', '(cities)');

    return this.http
      .get<{ predictions: PlaceSuggestion[] }>(url, { params })
      .pipe(
        // !!! КЛЮЧОВЕ ВИПРАВЛЕННЯ №1:
        // Ми "розпаковуємо" відповідь і повертаємо компоненту
        // чистий масив [ ... ], а не об'єкт { predictions: ... }.
        // Це виправить помилку NG0955.
        map((res) => res.predictions),
        catchError((err) => {
          console.error('PlacesService.findCities error:', err);
          return of([]); // Завжди повертаємо масив
        })
      );
  }

  /**
   * Отримання деталей (включаючи lat/lng) для обраного місця
   */
  public getPlaceDetails(placeId: string): Observable<PlaceDetails | null> {
    const url = `${this.apiUrl}/details/json`;
    const params = new HttpParams()
      .set('place_id', placeId)
      .set('fields', 'name,geometry/location');

    return this.http
      .get<{ result: PlaceDetails; status: string }>(url, { params })
      .pipe(
        // !!! КЛЮЧОВЕ ВИПРАВЛЕННЯ №2:
        // Ми "розпаковуємо" відповідь і повертаємо компоненту
        // чистий об'єкт { name: ..., location: ... }, а не { result: ... }.
        // Це виправить TypeError і дозволить погоді оновитися.
        map((res) => (res.status === 'OK' ? res.result : null)),
        catchError((err) => {
          console.error('PlacesService.getPlaceDetails error:', err);
          return of(null);
        })
      );
  }
}