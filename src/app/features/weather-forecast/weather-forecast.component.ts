import { AsyncPipe, CommonModule, DatePipe, DecimalPipe } from '@angular/common'; // Прибрали JsonPipe
import { Component, computed, inject, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { Observable, of } from 'rxjs';
import { catchError, filter, map, startWith, switchMap, tap } from 'rxjs/operators';
import {
  DailyForecast,
  GoogleDate,
} from '../../core/models/weather.models';
import { WeatherService } from '../../core/services/weather.service';
import { BookmarksService } from '../../core/services/bookmarks.service';
import { WeatherIconPipe } from '../../shared/pipes/weather-icon.pipe';

interface ForecastState {
  status: 'initial' | 'loading' | 'success' | 'error';
  data?: DailyForecast[];
  error?: any;
}

@Component({
  selector: 'app-weather-forecast',
  standalone: true,
  imports: [
    CommonModule,
    AsyncPipe,
    DatePipe,
    DecimalPipe,
    // JsonPipe видалено звідси
    MatCardModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatDividerModule,
    MatButtonModule,
    WeatherIconPipe,
  ],
  templateUrl: './weather-forecast.component.html',
  styleUrls: ['./weather-forecast.component.scss'],
  providers: [DatePipe, DecimalPipe],
})
export class WeatherForecastComponent {
  private weatherService = inject(WeatherService);
  public bookmarksService = inject(BookmarksService);

  // === СТАН ===
  public selectedForecastDay = signal<DailyForecast | null>(null);

  // Пагінація
  public currentPage = signal(0);
  public readonly pageSize = 5;

  public selectedLocationName = computed(
    () => this.weatherService.selectedLocation()?.name
  );

  public isCurrentLocationBookmarked = computed(() => {
    const location = this.weatherService.selectedLocation();
    if (!location) return false;
    return this.bookmarksService.isBookmarked(location.name);
  });

  public forecastState$: Observable<ForecastState> = toObservable(
    this.weatherService.selectedLocation
  ).pipe(
    filter((location) => !!location),
    tap(() => {
      this.currentPage.set(0);
    }),
    switchMap((location) =>
      this.weatherService.getDailyForecast(location!.coords).pipe(
        map((data) => {
          if (data && data.length > 0) {
            this.selectedForecastDay.set(data[0]);
          } else {
            this.selectedForecastDay.set(null);
          }
          return ({ status: 'success', data } as ForecastState);
        }),
        startWith({ status: 'loading' } as ForecastState),
        catchError((error) =>
          of({ status: 'error', error } as ForecastState)
        )
      )
    ),
    startWith({ status: 'initial' } as ForecastState)
  );

  public getJsDate(googleDate: GoogleDate): Date {
    return new Date(googleDate.year, googleDate.month - 1, googleDate.day);
  }

  public selectDay(day: DailyForecast): void {
    this.selectedForecastDay.set(day);
  }

  public isSelected(day: DailyForecast): boolean {
    const selected = this.selectedForecastDay();
    if (!selected || !day) return false;

    return day.date.year === selected.date.year &&
           day.date.month === selected.date.month &&
           day.date.day === selected.date.day;
  }

  public toggleBookmark(): void {
    const location = this.weatherService.selectedLocation();
    if (location) {
      this.bookmarksService.toggleBookmark(location.name, location.coords);
    }
  }

  // === МЕТОДИ ПАГІНАЦІЇ ===

  public nextPage(totalItems: number): void {
    if ((this.currentPage() + 1) * this.pageSize < totalItems) {
      this.currentPage.update(page => page + 1);
    }
  }

  public prevPage(): void {
    if (this.currentPage() > 0) {
      this.currentPage.update(page => page - 1);
    }
  }

  public get totalPages(): number {
    return 2;
  }
}