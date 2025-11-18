import { Component, inject, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { BookmarksService, Bookmark } from '../../core/services/bookmarks.service';
import { WeatherService } from '../../core/services/weather.service';

@Component({
  selector: 'app-bookmarks-list',
  standalone: true,
  imports: [
    CommonModule, 
    MatListModule, 
    MatIconModule, 
    MatButtonModule,
    MatDividerModule
  ],
  templateUrl: './bookmarks-list.component.html', // Використовуємо зовнішній файл
  styleUrls: ['./bookmarks-list.component.scss']  // Використовуємо зовнішній файл
})
export class BookmarksListComponent {
  public bookmarksService = inject(BookmarksService);
  private weatherService = inject(WeatherService);
  
  public locationSelected = output<void>();
  public close = output<void>();

  public selectLocation(bookmark: Bookmark): void {
    this.weatherService.setSelectedLocation(bookmark.name, bookmark.coords);
    this.locationSelected.emit();
  }

  public deleteBookmark(name: string): void {
    this.bookmarksService.removeBookmark(name);
  }
}