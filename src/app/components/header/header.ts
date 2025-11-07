// 1. Імпортуємо Input та Output
import { Component, Input, Output, EventEmitter } from '@angular/core';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common'; // 2. Імпортуємо CommonModule

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule, // 3. Додаємо CommonModule (для *ngIf)
    MatToolbarModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule
  ],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header {
  // 4. Приймаємо 'isHandset'
  @Input() isHandset: boolean | null = false;

  // 5. Створюємо подію для кнопки-бургера
  @Output() toggleSidenav = new EventEmitter<void>();
}