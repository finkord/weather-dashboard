import { Component, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';
import { ThemeService, ThemeMode, ColorTheme } from '../../core/services/theme.service';

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatTooltipModule,
    MatDividerModule
  ],
  templateUrl: './theme-toggle.component.html',
  styleUrls: ['./theme-toggle.component.scss'] // виправлено
})
export class ThemeToggleComponent {
  public themeService = inject(ThemeService);

  @ViewChild(MatMenuTrigger) menuTrigger!: MatMenuTrigger;

  public availableColors: { name: ColorTheme; hex: string; label: string }[] = [
    { name: 'azure', hex: '#3b82f6', label: 'Azure (Стандарт)' },
    { name: 'magenta', hex: '#d946ef', label: 'Magenta' },
    { name: 'green', hex: '#22c55e', label: 'Green' },
    { name: 'orange', hex: '#f97316', label: 'Orange' },
  ];

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
  };

  public setMode(mode: ThemeMode) {
    this.themeService.setMode(mode);
    this.keepMenuOpen();
  }

  public setColor(color: ColorTheme) {
    this.themeService.setColor(color);
    this.keepMenuOpen();
  }

  private keepMenuOpen() {
    setTimeout(() => this.menuTrigger.openMenu(), 0);
  }
}
