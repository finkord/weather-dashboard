import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

// TODO: Визначити чіткі інтерфейси для Places API
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
  private readonly apiUrl = environment.placesApi.baseUrl; // Нам потрібно додати це в environment

  /**
   * Пошук міст за введеним текстом (Autocomplete)
   */
  public findCities(query: string): Observable<PlaceSuggestion[]> {
    const url = `${this.apiUrl}/autocomplete/json`;
    const params = new HttpParams()
      .set('input', query)
      .set('types', '(cities)'); // Шукаємо тільки міста

    // Ми очікуємо, що interceptor додасть 'key'
    return this.http.get<{ predictions: PlaceSuggestion[] }>(url, { params })
      .pipe(map(res => res.predictions));
    // TODO: Додати catchError(...)
  }
  /**
   * Отримання деталей (включаючи lat/lng) для обраного місця
   */
  public getPlaceDetails(placeId: string): Observable<PlaceDetails> {
    const url = `${this.apiUrl}/details/json`;
    const params = new HttpParams()
      .set('place_id', placeId)
      .set('fields', 'name,geometry/location'); // Запитуємо тільки потрібні поля

    return this.http
      .get<{ result: PlaceDetails }>(url, { params })
      .pipe(map(res => res.result));
    // TODO: Додати catchError(...)
  }
}