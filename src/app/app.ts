import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { LocationSearchComponent } from './features/location-search/location-search.component';
import { WeatherForecastComponent } from './features/weather-forecast/weather-forecast.component';
import { ClockComponent } from './features/clock/clock.component';
import { ThemeToggleComponent } from './features/theme-toggle/theme-toggle.component';
import { BookmarksListComponent } from './features/bookmarks/bookmarks-list.component';
import { AboutComponent } from './features/about/about.component'; // Імпорт

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    MatSidenavModule, 
    MatButtonModule,  
    MatIconModule,    
    LocationSearchComponent,
    WeatherForecastComponent,
    ClockComponent,
    ThemeToggleComponent,
    BookmarksListComponent,
    AboutComponent 
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('Angular Weather Dashboard');
}