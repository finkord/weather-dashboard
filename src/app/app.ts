
import { Sidebar } from './components/sidebar/sidebar';
import { Header } from './components/header/header'; 
import { MainContent } from './components/main-content/main-content';
import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { MatSidenavModule } from '@angular/material/sidenav';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
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
}