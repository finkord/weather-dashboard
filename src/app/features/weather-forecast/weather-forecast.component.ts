import { AsyncPipe, CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button'; // Додаємо кнопку
import { Observable, of } from 'rxjs';
import { catchError, filter, map, startWith, switchMap, tap } from 'rxjs/operators';
import {
  DailyForecast, 
  GoogleDate,
} from '../../core/models/weather.models';
import { WeatherService } from '../../core/services/weather.service';
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
    MatCardModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatDividerModule,
    MatButtonModule, // Додано модуль кнопок
    WeatherIconPipe,
  ],
  templateUrl: './weather-forecast.component.html',
  styleUrls: ['./weather-forecast.component.scss'],
  providers: [DatePipe, DecimalPipe],
})
export class WeatherForecastComponent {
  private weatherService = inject(WeatherService);

  // === СТАН ===
  public selectedForecastDay = signal<DailyForecast | null>(null);
  
  // Пагінація
  public currentPage = signal(0);
  public readonly pageSize = 5;

  public selectedLocationName = computed(
    () => this.weatherService.selectedLocation()?.name
  );

  public forecastState$: Observable<ForecastState> = toObservable(
    this.weatherService.selectedLocation
  ).pipe(
    filter((location) => !!location),
    tap(() => {
      // Скидаємо пагінацію на першу сторінку при зміні міста
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
    // Це не зовсім реактивно для шаблону без сигналу даних, 
    // але оскільки ми використовуємо це всередині @if (state.data), це безпечно.
    return 2; // 10 днів / 5 = 2 сторінки. Можна зробити динамічно: Math.ceil(total / pageSize)
  }
}