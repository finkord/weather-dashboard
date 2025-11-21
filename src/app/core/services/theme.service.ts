import { Injectable, effect, inject, signal } from '@angular/core';
import { DOCUMENT } from '@angular/common';

export type ThemeMode = 'light' | 'dark' | 'system';
export type ColorTheme = 'azure' | 'magenta' | 'green' | 'orange'; // Додані кольори

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private document = inject(DOCUMENT);
  
  public themeMode = signal<ThemeMode>(this.getSavedMode());
  // Новий сигнал для кольору
  public colorTheme = signal<ColorTheme>(this.getSavedColor()); 

  constructor() {
    // Ефект для Mode (Light/Dark)
    effect(() => {
      const mode = this.themeMode();
      localStorage.setItem('theme-mode', mode);
      this.applyMode(mode);
    });

    // Ефект для Color (Azure/Magenta/...)
    effect(() => {
      const color = this.colorTheme();
      localStorage.setItem('theme-color', color);
      this.applyColor(color);
    });

    // Слухач системних змін
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
      if (this.themeMode() === 'system') {
        this.applyMode('system');
      }
    });
  }

  public setMode(mode: ThemeMode): void {
    this.themeMode.set(mode);
  }

  public setColor(color: ColorTheme): void {
    this.colorTheme.set(color);
  }

  private getSavedMode(): ThemeMode {
    return (localStorage.getItem('theme-mode') as ThemeMode) || 'system';
  }

  private getSavedColor(): ColorTheme {
    return (localStorage.getItem('theme-color') as ColorTheme) || 'azure';
  }

  private applyMode(mode: ThemeMode): void {
    const html = this.document.documentElement;
    let isDark = false;
    if (mode === 'system') {
      isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    } else {
      isDark = mode === 'dark';
    }
    isDark ? html.classList.add('dark-theme') : html.classList.remove('dark-theme');
  }

  private applyColor(color: ColorTheme): void {
    const html = this.document.documentElement;
    // Видаляємо всі можливі класи кольорів
    const colors: ColorTheme[] = ['azure', 'magenta', 'green', 'orange'];
    colors.forEach(c => html.classList.remove(`theme-${c}`));

    // Якщо не дефолтний (azure), додаємо клас
    if (color !== 'azure') {
      html.classList.add(`theme-${color}`);
    }
  }
}