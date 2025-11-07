import { Component } from '@angular/core';

// 1. Імпортуємо модулі
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-air-quality-index',
  standalone: true, // Встановлюємо standalone
  // 2. Додаємо модулі в 'imports'
  imports: [
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatDividerModule
  ],
  templateUrl: './air-quality-index.html',
  styleUrl: './air-quality-index.css'
})
export class AirQualityIndex {

}