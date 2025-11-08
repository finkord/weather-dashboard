import { AsyncPipe, CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  MatAutocompleteModule,
  MatAutocompleteSelectedEvent,
} from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Observable, of } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  switchMap,
  tap,
  filter,
} from 'rxjs/operators';
import {
  PlacesService,
  GooglePlaceSuggestion, // <-- ВИПРАВЛЕНО: Використовуємо "сирий" інтерфейс з place_id
  PlaceLocation, // <-- ВИПРАВЛЕНО: Використовуємо "чистий" інтерфейс
} from '../../core/services/places.service';
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
  ],
  templateUrl: './location-search.component.html',
  styleUrls: ['./location-search.component.scss'],
})
export class LocationSearchComponent implements OnInit {
  private placesService = inject(PlacesService);
  private weatherService = inject(WeatherService);

  // Контрол тепер оперує 'string' або 'GooglePlaceSuggestion'
  public searchControl = new FormControl<string | GooglePlaceSuggestion>('');
  public suggestions$!: Observable<GooglePlaceSuggestion[]>;

  ngOnInit(): void {
    this.suggestions$ = this.searchControl.valueChanges.pipe(
      debounceTime(400),
      // Цей 'filter' все ще важливий, він ігнорує об'єкти
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
    // 'value' - це об'єкт 'GooglePlaceSuggestion' з 'place_id'
    const selectedPlace: GooglePlaceSuggestion = event.option.value;

    if (!selectedPlace || !selectedPlace.place_id) {
      return;
    }

    this.placesService
      .getPlaceDetails(selectedPlace.place_id) // Використовуємо place_id
      .pipe(
        // Сервіс повертає 'PlaceLocation | null'
        filter((details): details is PlaceLocation => !!details),
        tap((details) => {
          // 'details' - це наш чистий об'єкт: { name: '...', coords: { latitude: ..., longitude: ... } }
          
          // !!! ВИПРАВЛЕНО !!!
          // 'details.coords' тепер коректно визначений. Помилки не буде.
          // Погода ОНОВИТЬСЯ.
          this.weatherService.setSelectedLocation(
            details.name,
            details.coords
          );

          // Встановлюємо в інпут чисту назву міста, а не 'description'
          this.searchControl.setValue(details.name, { emitEvent: false });
        })
      )
      .subscribe();
  }

  public displayFn(place: GooglePlaceSuggestion): string {
    // Відображаємо 'description'
    return place && place.description ? place.description : '';
  }
}