// src/app/features/theme-toggle/theme-toggle.component.ts

import { Component, inject } from '@angular/core';
import { CommonModule, TitleCasePipe } from '@angular/common'; //
import { MatButtonModule } from '@angular/material/button'; //
import { MatIconModule } from '@angular/material/icon'; //
import { MatMenuModule } from '@angular/material/menu'; //
import { ThemeService, ThemeMode, ColorTheme } from '../../core/services/theme.service'; //

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  imports: [
    CommonModule, 
    MatButtonModule, 
    MatIconModule, 
    MatMenuModule,
    TitleCasePipe // Додано TitleCasePipe, оскільки він використовується в шаблоні
  ],
  // !!! ЗМІНА ТУТ: Використовуємо templateUrl замість inline template !!!
  templateUrl: './theme-toggle.component.html', 
})
export class ThemeToggleComponent {
  public themeService = inject(ThemeService); //

  public currentModeIcon = () => { //
    switch (this.themeService.themeMode()) {
      case 'light': return 'light_mode';
      case 'dark': return 'dark_mode';
      default: return 'brightness_auto';
    }
  };

  public currentModeLabel = () => { //
     switch (this.themeService.themeMode()) {
      case 'light': return 'Світла';
      case 'dark': return 'Темна';
      default: return 'Авто';
    }
  }

  public setMode(mode: ThemeMode) { //
    this.themeService.setMode(mode);
  }

  public setColor(color: ColorTheme) { //
    this.themeService.setColor(color);
  }
}