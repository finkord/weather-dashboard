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
  PlaceSuggestion,
  PlaceDetails,
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

  public searchControl = new FormControl<string | PlaceSuggestion>(''); // Чітко вказуємо тип
  public suggestions$!: Observable<PlaceSuggestion[]>;

  ngOnInit(): void {
    this.suggestions$ = this.searchControl.valueChanges.pipe(
      debounceTime(400),
      
      // !!! КЛЮЧОВЕ ВИПРАВЛЕННЯ №3:
      // Ми реагуємо ТІЛЬКИ на рядки (string), які вводить користувач.
      // Коли користувач обирає опцію, 'valueChanges' видає ОБ'ЄКТ,
      // цей 'filter' його проігнорує, що запобіжить NG0955.
      filter((query): query is string => typeof query === 'string'),
      
      distinctUntilChanged(),
      switchMap((query: string) => {
        if (query && query.length > 2) {
          // 'findCities' тепер 100% повертає PlaceSuggestion[]
          return this.placesService.findCities(query);
        }
        return of([]); // Повертаємо порожній масив, щоб очистити список
      })
    );
  }

  /**
   * Викликається, коли користувач обирає опцію з автодоповнення
   */
  public onOptionSelected(event: MatAutocompleteSelectedEvent): void {
    const selectedPlace: PlaceSuggestion = event.option.value;

    if (!selectedPlace || !selectedPlace.placeId) {
      return;
    }

    this.placesService
      .getPlaceDetails(selectedPlace.placeId)
      .pipe(
        // Перевіряємо, що 'details' не null
        filter((details): details is PlaceDetails => !!details),
        tap((details) => {
          // 'details' тепер 100% має тип PlaceDetails.
          // Помилка TypeError не виникне, і 'setSelectedLocation' буде викликано.
          this.weatherService.setSelectedLocation(
            details.name,
            details.location
          );
          
          // Встановлюємо текстове значення в інпут,
          // і { emitEvent: false } запобігає повторному виклику valueChanges.
          this.searchControl.setValue(details.name, { emitEvent: false });
        })
      )
      .subscribe();
  }

  /**
   * Функція для відображення значення в autocomplete
   */
  public displayFn(place: PlaceSuggestion): string {
    // 'place' - це об'єкт PlaceSuggestion
    return place && place.description ? place.description : '';
  }
}