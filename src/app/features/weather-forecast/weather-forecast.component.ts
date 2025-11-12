import { AsyncPipe, CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Observable, of } from 'rxjs';
import { catchError, filter, map, startWith, switchMap } from 'rxjs/operators';
import {
  DailyForecast, // Наш "чистий" інтерфейс
  GoogleDate,
} from '../../core/models/weather.models';
import { WeatherService } from '../../core/services/weather.service';

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
  ],
  templateUrl: './weather-forecast.component.html',
  styleUrls: ['./weather-forecast.component.scss'],
  providers: [DatePipe, DecimalPipe],
})
export class WeatherForecastComponent {
  private weatherService = inject(WeatherService);

  public selectedLocationName = computed(
    () => this.weatherService.selectedLocation()?.name
  );

  public forecastState$: Observable<ForecastState> = toObservable(
    this.weatherService.selectedLocation
  ).pipe(
    filter((location) => !!location),
    switchMap((location) =>
      this.weatherService.getDailyForecast(location!.coords).pipe(
        map((data) => ({ status: 'success', data } as ForecastState)),
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

  /**
   * !!! КЛЮЧОВЕ ВИПРАВЛЕННЯ (ІКОНКИ) !!!
   * Оновлюємо мапінг іконок, щоб він працював з
   * рядками ("CLOUDY", "CLEAR"), а не з кодами.
   */
  public getWeatherIconClass(iconType: string): string {
    const prefix = 'wi wi-';
    
    // (Мапінг потрібно буде розширити на основі всіх типів API)
    switch (iconType) {
      case 'CLEAR':
        return prefix + 'day-sunny';
      case 'PARTLY_CLOUDY':
        return prefix + 'day-cloudy';
      case 'CLOUDY':
        return prefix + 'cloudy';
      case 'LIGHT_RAIN':
        return prefix + 'sprinkle';
      case 'RAIN':
        return prefix + 'rain';
      case 'SNOW':
        return prefix + 'snow';
      case 'THUNDERSTORM':
        return prefix + 'thunderstorm';
      case 'FOG':
        return prefix + 'fog';
      default:
        return prefix + 'na'; // Not available
    }
  }
}