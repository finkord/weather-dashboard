import { Component, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatDividerModule],
  template: `
    <div class="about-header">
      <h3>About Project</h3>
      <button mat-icon-button (click)="close.emit()" aria-label="Close about">
        <mat-icon>close</mat-icon>
      </button>
    </div>

    <div class="about-content">
      <div class="logo-section">
        <mat-icon class="app-logo">cloud_circle</mat-icon>
        <h2>Weather Dashboard</h2>
        <span class="version">v1.0.0</span>
      </div>

      <p class="description">
        A modern, responsive weather application built with Angular 20 and Material Design. 
        Provides real-time forecasts and location bookmarks.
      </p>

      <mat-divider></mat-divider>

      <div class="section">
        <h4>Team</h4>
        
        <div class="team-member">
          <div class="avatar-wrapper">
            <img src="team/volodymyr.jpg" alt="Volodymyr" class="member-photo">
          </div>
          <div class="member-info">
            <span class="name">Володимир Фуфалько</span>
            <span class="role">Full Stack Developer</span>
          </div>
        </div>

        <div class="team-member">
          <div class="avatar-wrapper">
            <img src="team/viktoriia.jpg" alt="Viktoriia" class="member-photo">
          </div>
          <div class="member-info">
            <span class="name">Вікторія Яківчук</span>
            <span class="role">Frontend Developer</span>
          </div>
        </div>
      </div>

      <mat-divider></mat-divider>

      <div class="section">
        <h4>Tech Stack</h4>
        <div class="tech-chips">
          <span>Angular 20</span>
          <span>Material UI</span>
          <span>RxJS</span>
          <span>TypeScript</span>
        </div>
      </div>

      <div class="footer">
        <a href="https://github.com/finkord/weather-dashboard" target="_blank" mat-button color="primary">
          <mat-icon>code</mat-icon>
          GitHub Repository
        </a>
        <span class="copyright">© 2025 Weather Dashboard</span>
      </div>
    </div>
  `,
  styleUrls: ['./about.component.scss']
})
export class AboutComponent {
  public close = output<void>();
}