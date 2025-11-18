import { AsyncPipe, CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Observable, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, tap, filter } from 'rxjs/operators';
import { PlacesService, GooglePlaceSuggestion, PlaceLocation } from '../../core/services/places.service';
import { WeatherService } from '../../core/services/weather.service';

@Component({
  selector: 'app-location-search',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    AsyncPipe,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './location-search.component.html',
  styleUrls: ['./location-search.component.scss'],
})
export class LocationSearchComponent implements OnInit {
  private placesService = inject(PlacesService);
  private weatherService = inject(WeatherService);

  public searchControl = new FormControl<string | GooglePlaceSuggestion>('');
  public suggestions$!: Observable<GooglePlaceSuggestion[]>;
  
  public isLocating = signal(false);

  ngOnInit(): void {
    this.suggestions$ = this.searchControl.valueChanges.pipe(
      debounceTime(600),
      filter((query): query is string => typeof query === 'string'),
      distinctUntilChanged(),
      switchMap((query: string) => {
        if (query && query.length > 2) {
          return this.placesService.findCities(query);
        }
        return of([]);
      })
    );
  }

  public onOptionSelected(event: MatAutocompleteSelectedEvent): void {
    const selectedPlace: GooglePlaceSuggestion = event.option.value;

    if (!selectedPlace || !selectedPlace.place_id) {
      return;
    }

    this.placesService
      .getPlaceDetails(selectedPlace.place_id)
      .pipe(
        filter((details): details is PlaceLocation => !!details),
        tap((details) => {
          this.weatherService.setSelectedLocation(
            details.name,
            details.coords
          );
          this.searchControl.setValue(details.name, { emitEvent: false });
        })
      )
      .subscribe();
  }

  public displayFn(place: GooglePlaceSuggestion): string {
    return place && place.description ? place.description : '';
  }

  // --- ГЕОЛОКАЦІЯ ---
  public useCurrentLocation(): void {
    if (!navigator.geolocation) {
      console.error('Geolocation is not supported');
      return;
    }

    this.isLocating.set(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        const coords = { latitude: lat, longitude: lon };

        // Запитуємо назву міста у нашого BFF
        this.placesService.getCityNameByCoords(lat, lon).subscribe({
          next: (cityName) => {
            // Формуємо красиву назву
            const displayName = cityName ? `Your Location (${cityName})` : 'Your Location';

            // Оновлюємо погоду і текст в полі
            this.weatherService.setSelectedLocation(displayName, coords);
            this.searchControl.setValue(displayName, { emitEvent: false });
            
            this.isLocating.set(false);
          },
          error: () => {
            // Якщо щось пішло не так, просто пишемо "Your Location"
            this.weatherService.setSelectedLocation('Your Location', coords);
            this.searchControl.setValue('Your Location', { emitEvent: false });
            this.isLocating.set(false);
          }
        });
      },
      (error) => {
        console.error('Error getting location:', error);
        this.isLocating.set(false);
      },
      { timeout: 10000 }
    );
  }
}