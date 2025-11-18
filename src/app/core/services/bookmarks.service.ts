import { Injectable, effect, signal } from '@angular/core';
import { LocationCoords } from '../models/weather.models';

export interface Bookmark {
  name: string;
  coords: LocationCoords;
}

@Injectable({
  providedIn: 'root',
})
export class BookmarksService {
  private readonly STORAGE_KEY = 'weather-bookmarks';

  // Сигнал, що містить список закладок
  public bookmarks = signal<Bookmark[]>(this.loadBookmarks());

  constructor() {
    // Ефект: при будь-якій зміні сигналу bookmarks, оновлюємо localStorage
    effect(() => {
      const data = JSON.stringify(this.bookmarks());
      localStorage.setItem(this.STORAGE_KEY, data);
    });
  }

  public addBookmark(name: string, coords: LocationCoords): void {
    if (!this.isBookmarked(name)) {
      this.bookmarks.update((current) => [...current, { name, coords }]);
    }
  }

  public removeBookmark(name: string): void {
    this.bookmarks.update((current) => current.filter((b) => b.name !== name));
  }

  public toggleBookmark(name: string, coords: LocationCoords): void {
    if (this.isBookmarked(name)) {
      this.removeBookmark(name);
    } else {
      this.addBookmark(name, coords);
    }
  }

  public isBookmarked(name: string): boolean {
    return this.bookmarks().some((b) => b.name === name);
  }

  private loadBookmarks(): Bookmark[] {
    const saved = localStorage.getItem(this.STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  }
}