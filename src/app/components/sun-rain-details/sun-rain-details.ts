import { Component } from '@angular/core';

// 1. Імпортуємо модулі
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatMenuModule } from '@angular/material/menu'; // Для меню "..."

@Component({
  selector: 'app-sun-rain-details',
  standalone: true, // Встановлюємо standalone
  // 2. Додаємо модулі в 'imports'
  imports: [
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatDividerModule,
    MatMenuModule
  ],
  templateUrl: './sun-rain-details.html',
  styleUrl: './sun-rain-details.css'
})
export class SunRainDetails {

}