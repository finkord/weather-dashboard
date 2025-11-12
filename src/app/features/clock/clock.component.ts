// src/app/features/clock/clock.component.ts

import { Component, OnInit, signal, OnDestroy } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { interval, Subscription } from 'rxjs';
import { tap, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-clock',
  standalone: true,
  // DatePipe включено в imports, оскільки це standalone-компонент
  imports: [CommonModule, DatePipe], 
  templateUrl: './clock.component.html',
  styleUrls: ['./clock.component.scss'],
})
export class ClockComponent implements OnInit, OnDestroy {
  // Використовуємо signal для реактивного зберігання поточного часу
  public currentTime = signal(new Date());
  private intervalSubscription!: Subscription;

  ngOnInit(): void {
    // 1. Створюємо інтервал, який випускає значення кожну секунду
    this.intervalSubscription = interval(1000)
      .pipe(
        startWith(0), // Запускаємо оновлення одразу
        // 2. Оновлюємо signal поточним часом
        tap(() => this.currentTime.set(new Date()))
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    // 3. Важливо: відписуємось, щоб уникнути витоків пам'яті (RxJS Best Practice)
    if (this.intervalSubscription) {
      this.intervalSubscription.unsubscribe();
    }
  }
}