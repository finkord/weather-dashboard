import { Sidebar } from './components/sidebar/sidebar';
import { Header } from './components/header/header'; 
import { MainContent } from './components/main-content/main-content';
import { Component, signal, inject } from '@angular/core'; // 1. Додано 'inject'
import { RouterOutlet } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';

// 2. Імпортуємо BreakpointObserver
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { CommonModule } from '@angular/common'; // 3. Імпортуємо CommonModule

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule, // 4. Додаємо CommonModule (для async pipe)
    RouterOutlet, 
    Sidebar, 
    Header, 
    MainContent,
    MatSidenavModule 
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('weather-dashboard');

  // 5. Впроваджуємо BreakpointObserver
  private breakpointObserver = inject(BreakpointObserver);

  // 6. Створюємо Observable, який буде true на мобільних
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );
}