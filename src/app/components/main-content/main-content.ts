import { Component } from '@angular/core';
// 1. Імпортуємо standalone-компоненти
import { SevenDayForecast } from '../seven-day-forecast/seven-day-forecast'; 
import { AirQualityIndex } from '../air-quality-index/air-quality-index';
import { SunRainDetails } from '../sun-rain-details/sun-rain-details';

@Component({
  selector: 'app-main-content',
  standalone: true, 
  // 2. Переконуємося, що вони в 'imports'
  imports: [
    SevenDayForecast, 
    AirQualityIndex, 
    SunRainDetails
  ], 
  templateUrl: './main-content.html',
  styleUrl: './main-content.css'
})
export class MainContent { 
  // тут буде логіка
}