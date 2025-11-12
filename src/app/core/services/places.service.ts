import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
// Вам більше не потрібен CacheService тут!

// --- ІНТЕРФЕЙСИ ---

// 1. Інтерфейс для відповіді від /api/places/autocomplete
// (BFF повертає той самий "сирий" список, що і Google)
export interface GooglePlaceSuggestion {
  description: string;
  place_id: string; 
}

// 2. "Чистий" інтерфейс, який повертає /api/places/details
// (BFF вже виконав трансформацію)
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

  // URL-и наших "розумних" BFF ендпоінтів
  private readonly autocompleteUrl = '/api/places/autocomplete';
  private readonly detailsUrl = '/api/places/details';

  /**
   * Пошук міст (Autocomplete)
   * Звертається до BFF, який звертається до Google.
   */
  public findCities(query: string): Observable<GooglePlaceSuggestion[]> {
    const params = new HttpParams().set('q', query);

    return this.http
      // BFF вже повертає чистий масив 'predictions'
      .get<GooglePlaceSuggestion[]>(this.autocompleteUrl, { params })
      .pipe(
        catchError((err) => {
          console.error('PlacesService.findCities error:', err);
          return of([]);
        })
      );
  }

  /**
   * Отримання деталей (lat/lng)
   * Звертається до BFF, який кешує та трансформує дані.
   */
  public getPlaceDetails(placeId: string): Observable<PlaceLocation | null> {
    
    // BFF очікує 'placeId'
    const params = new HttpParams().set('placeId', placeId);

    return this.http
      // BFF вже повертає "чистий" об'єкт PlaceLocation
      .get<PlaceLocation>(this.detailsUrl, { params })
      .pipe(
        catchError((err) => {
          console.error('PlacesService.getPlaceDetails error:', err);
          return of(null);
        })
      );
  }
}