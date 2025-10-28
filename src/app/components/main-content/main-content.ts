import { Component } from '@angular/core';
import { SevenDayForecast } from '../seven-day-forecast/seven-day-forecast'; 
import { AirQualityIndex } from '../air-quality-index/air-quality-index';
import { SunRainDetails } from '../sun-rain-details/sun-rain-details';

@Component({
  selector: 'app-main-content',
  standalone: true, 
  imports: [SevenDayForecast, AirQualityIndex, SunRainDetails], 
  templateUrl: './main-content.html',
  styleUrl: './main-content.css'
})
export class MainContent { 
  // тут буде логіка
}