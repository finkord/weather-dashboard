import { Component, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [
    CommonModule, 
    MatButtonModule, 
    MatIconModule, 
    MatDividerModule
  ],
  templateUrl: './about.component.html', 
  styleUrls: ['./about.component.scss']
})
export class AboutComponent {
  public close = output<void>();
}