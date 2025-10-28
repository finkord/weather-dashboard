
import { Sidebar } from './components/sidebar/sidebar';
import { Header } from './components/header/header'; 
import { MainContent } from './components/main-content/main-content';
import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Sidebar, Header, MainContent], 
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('weather-dashboard');
}