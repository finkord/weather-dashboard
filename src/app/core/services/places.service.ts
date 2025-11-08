import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

// --- ІНТЕРФЕЙСИ ---

// 1. "Сирий" інтерфейс відповіді Autocomplete (відповідає "Запиту 1")
export interface GooglePlaceSuggestion {
  description: string;
  place_id: string; // ВИПРАВЛЕНО: snake_case
  // ... (інші поля можемо ігнорувати)
}

// 2. "Сирий" інтерфейс відповіді Details (відповідає "Запиту 2")
interface GooglePlaceDetailsResponse {
  name: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
}

// 3. "Чистий" інтерфейс, який ми хочемо використовувати у додатку
export interface PlaceLocation {
  name: string;
  coords: {
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
   * Пошук міст (Autocomplete)
   */
  public findCities(query: string): Observable<GooglePlaceSuggestion[]> {
    const url = `${this.apiUrl}/autocomplete/json`;
    const params = new HttpParams()
      .set('input', query)
      .set('types', '(cities)');

    return this.http
      .get<{ predictions: GooglePlaceSuggestion[] }>(url, { params })
      .pipe(
        // Тепер ми повертаємо масив з 'place_id' (snake_case)
        map((res) => res.predictions),
        catchError((err) => {
          console.error('PlacesService.findCities error:', err);
          return of([]);
        })
      );
  }

  /**
   * Отримання деталей (lat/lng) та їх ТРАНСФОРМАЦІЯ
   */
  public getPlaceDetails(placeId: string): Observable<PlaceLocation | null> {
    const url = `${this.apiUrl}/details/json`;
    const params = new HttpParams()
      .set('place_id', placeId)
      .set('fields', 'name,geometry/location');

    return this.http
      .get<{ result: GooglePlaceDetailsResponse; status: string }>(url, {
        params,
      })
      .pipe(
        map((res) => {
          if (res.status !== 'OK' || !res.result) {
            return null;
          }

          // !!! КЛЮЧОВЕ ВИПРАВЛЕННЯ !!!
          // Трансформуємо "сиру" відповідь API (Запит 2)
          // у наш чистий інтерфейс 'PlaceLocation'
          const details: PlaceLocation = {
            name: res.result.name,
            coords: {
              latitude: res.result.geometry.location.lat, // з lat
              longitude: res.result.geometry.location.lng, // з lng
            },
          };
          return details;
        }),
        catchError((err) => {
          console.error('PlacesService.getPlaceDetails error:', err);
          return of(null);
        })
      );
  }
}