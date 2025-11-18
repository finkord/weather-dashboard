import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export interface GooglePlaceSuggestion {
  description: string;
  place_id: string; 
}

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

  private readonly autocompleteUrl = '/api/places/autocomplete';
  private readonly detailsUrl = '/api/places/details';
  // Наш новий ендпоінт на BFF
  private readonly reverseUrl = '/api/places/reverse';

  public findCities(query: string): Observable<GooglePlaceSuggestion[]> {
    const params = new HttpParams().set('q', query);
    return this.http.get<GooglePlaceSuggestion[]>(this.autocompleteUrl, { params })
      .pipe(catchError(() => of([])));
  }

  public getPlaceDetails(placeId: string): Observable<PlaceLocation | null> {
    const params = new HttpParams().set('placeId', placeId);
    return this.http.get<PlaceLocation>(this.detailsUrl, { params })
      .pipe(catchError(() => of(null)));
  }

  /**
   * Отримує назву міста через наш BFF (який використовує Google API).
   */
  public getCityNameByCoords(lat: number, lon: number): Observable<string | null> {
    const params = new HttpParams()
      .set('lat', lat.toString())
      .set('lon', lon.toString());

    return this.http
      .get<{ name: string | null }>(this.reverseUrl, { params })
      .pipe(
        map(response => response.name),
        catchError((err) => {
          console.error('PlacesService.getCityNameByCoords error:', err);
          return of(null);
        })
      );
  }
}