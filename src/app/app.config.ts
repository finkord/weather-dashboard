import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';

// Імпортуємо необхідні функції
import {
  provideHttpClient
} from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),

    // Реєструємо HttpClient
    provideHttpClient(),
  ],
};