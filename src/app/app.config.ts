import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';

// Імпортуємо необхідні функції
import {
  provideHttpClient,
  withInterceptors,
} from '@angular/common/http';
import { apiKeyInterceptor } from './core/interceptors/api-key.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),

    // Реєструємо HttpClient з нашим interceptor
    provideHttpClient(withInterceptors([apiKeyInterceptor])),

    // ...інші providers
  ],
};