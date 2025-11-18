import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { LocationSearchComponent } from './features/location-search/location-search.component';
import { WeatherForecastComponent } from './features/weather-forecast/weather-forecast.component';
import { ClockComponent } from './features/clock/clock.component';
import { ThemeToggleComponent } from './features/theme-toggle/theme-toggle.component';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet, 
    LocationSearchComponent, 
    WeatherForecastComponent, 
    ClockComponent, 
    ThemeToggleComponent 
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('Angular Weather Dashboard');
}