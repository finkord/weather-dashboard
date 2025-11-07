import { Component } from '@angular/core';

// 1. Імпортуємо модулі
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common'; // Потрібен для ngClass

@Component({
  selector: 'app-seven-day-forecast',
  standalone: true, // Встановлюємо standalone
  // 2. Додаємо модулі в 'imports'
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule
  ],
  templateUrl: './seven-day-forecast.html',
  styleUrl: './seven-day-forecast.css'
})
export class SevenDayForecast {
  // Мок-дані для відображення іконок
  forecast = [
    { day: 'Saturday', precipitation: 45, icon: 'cloud', temp: '+7°C', active: true },
    { day: 'Sunday', precipitation: 45, icon: 'cloud', temp: '+7°C', active: false },
    { day: 'Monday', precipitation: 45, icon: 'wb_sunny', temp: '+7°C', active: false },
    { day: 'Tuesday', precipitation: 45, icon: 'cloud', temp: '+7°C', active: false },
    { day: 'Wednesday', precipitation: 45, icon: 'cloud', temp: '+7°C', active: false },
    { day: 'Thursday', precipitation: 45, icon: 'cloud', temp: '+7°C', active: false },
    { day: 'Friday', precipitation: 45, icon: 'cloud', temp: '+7°C', active: false }
  ];
}