import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { ThemeService, ThemeMode, ColorTheme } from '../../core/services/theme.service';

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatMenuModule],
  template: `
    <button mat-icon-button [matMenuTriggerFor]="mainMenu" aria-label="Налаштування теми">
      <mat-icon>palette</mat-icon> </button>

    <mat-menu #mainMenu="matMenu">
      <button mat-menu-item [matMenuTriggerFor]="modeMenu">
        <mat-icon>{{ currentModeIcon() }}</mat-icon>
        <span>Режим: {{ currentModeLabel() }}</span>
      </button>

      <button mat-menu-item [matMenuTriggerFor]="colorMenu">
        <mat-icon>color_lens</mat-icon>
        <span>Колір: {{ themeService.colorTheme() | titlecase }}</span>
      </button>
    </mat-menu>

    <mat-menu #modeMenu="matMenu">
      <button mat-menu-item (click)="setMode('light')">
        <mat-icon>light_mode</mat-icon><span>Світла</span>
      </button>
      <button mat-menu-item (click)="setMode('dark')">
        <mat-icon>dark_mode</mat-icon><span>Темна</span>
      </button>
      <button mat-menu-item (click)="setMode('system')">
        <mat-icon>brightness_auto</mat-icon><span>Системна</span>
      </button>
    </mat-menu>

    <mat-menu #colorMenu="matMenu">
      <button mat-menu-item (click)="setColor('azure')">
        <mat-icon style="color: #3b82f6">circle</mat-icon> Azure (Default)
      </button>
      <button mat-menu-item (click)="setColor('magenta')">
        <mat-icon style="color: #d946ef">circle</mat-icon> Magenta
      </button>
      <button mat-menu-item (click)="setColor('green')">
        <mat-icon style="color: #22c55e">circle</mat-icon> Green
      </button>
      <button mat-menu-item (click)="setColor('orange')">
        <mat-icon style="color: #f97316">circle</mat-icon> Orange
      </button>
    </mat-menu>
  `
})
export class ThemeToggleComponent {
  public themeService = inject(ThemeService);

  public currentModeIcon = () => {
    switch (this.themeService.themeMode()) {
      case 'light': return 'light_mode';
      case 'dark': return 'dark_mode';
      default: return 'brightness_auto';
    }
  };

  public currentModeLabel = () => {
     switch (this.themeService.themeMode()) {
      case 'light': return 'Світла';
      case 'dark': return 'Темна';
      default: return 'Авто';
    }
  }

  public setMode(mode: ThemeMode) {
    this.themeService.setMode(mode);
  }

  public setColor(color: ColorTheme) {
    this.themeService.setColor(color);
  }
}