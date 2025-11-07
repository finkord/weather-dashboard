import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { environment } from '../../../environments/environment';

/**
 * Цей interceptor додає API-ключ Google Weather до кожного запиту,
 * що спрямований на URL API погоди.
 */
export const apiKeyInterceptor: HttpInterceptorFn = (req, next) => {
  // Перевіряємо, чи запит йде до нашого API
  if (req.url.startsWith(environment.weatherApi.baseUrl)) {
    // Клонуємо запит і додаємо ключ API як query-параметр
    const modifiedReq = req.clone({
      params: req.params.append('key', environment.weatherApi.apiKey),
    });
    return next(modifiedReq);
  }

  // Для всіх інших запитів просто передаємо їх далі
  return next(req);
};