import { AsyncPipe, CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Observable, EMPTY } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  switchMap,
  tap,
} from 'rxjs/operators';
import { PlacesService, PlaceSuggestion } from '../../core/services/places.service';
import { WeatherService } from '../../core/services/weather.service';

@Component({
  selector: 'app-location-search',
  standalone: true,
  imports: [
    // Необхідні імпорти для Standalone-компонента
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
  // Використовуємо inject() для сервісів
  private placesService = inject(PlacesService);
  private weatherService = inject(WeatherService);

  public searchControl = new FormControl('');
  public suggestions$!: Observable<PlaceSuggestion[]>;

  ngOnInit(): void {
    this.suggestions$ = this.searchControl.valueChanges.pipe(
      // Затримка перед запитом
      debounceTime(400),
      // Не робити запит, якщо значення не змінилося
      distinctUntilChanged(),
      // Робимо запит до API
      switchMap((query) => {
        if (query && query.length > 2) {
          return this.placesService.findCities(query);
        }
        // Якщо запит короткий, повертаємо порожній масив
        return EMPTY;
      })
    );
  }

  /**
   * Викликається, коли користувач обирає опцію з автодоповнення
   */
  public onOptionSelected(event: MatAutocompleteSelectedEvent): void {
    const selectedPlaceId = event.option.value;

    // Отримуємо деталі (lat/lng) для обраного місця
    this.placesService
      .getPlaceDetails(selectedPlaceId)
      .pipe(
        // tap для "side effect" - оновлення стану
        tap((details) => {
          this.weatherService.setSelectedLocation(
            details.name,
            details.location
          );
          // Очищуємо поле вводу та показуємо обране місто
          this.searchControl.setValue(details.name, { emitEvent: false });
        })
      )
      .subscribe();
  }

  /**
   * Функція для відображення значення в autocomplete
   */
  public displayFn(place: PlaceSuggestion): string {
    return place && place.description ? place.description : '';
  }
}