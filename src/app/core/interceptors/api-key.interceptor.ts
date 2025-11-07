import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../../environments/environment';

/**
 * Цей interceptor додає API-ключ Google до кожного запиту,
 * що спрямований на 'googleapis.com'.
 */
export const apiKeyInterceptor: HttpInterceptorFn = (req, next) => {

  const weatherApiUrl = environment.weatherApi.baseUrl;
  const placesApiProxyPath = '/maps';

  // Перевіряємо, чи запит йде до API погоди АБО до нашого проксі-шляху
  if (
    req.url.startsWith(weatherApiUrl) ||
    req.url.startsWith(placesApiProxyPath)
  ) {
    // Ключ однаковий для обох API
    const apiKey = environment.weatherApi.apiKey;

    const modifiedReq = req.clone({
      params: req.params.append('key', apiKey),
    });
    return next(modifiedReq);
  }
  
  // Перевіряємо, чи запит йде до Google API
  // if (req.url.includes('googleapis.com')) {
  //   // Використовуємо єдиний ключ з environment
  //   const apiKey = environment.weatherApi.apiKey; // (або placesApi.apiKey, вони однакові)

  //   const modifiedReq = req.clone({
  //     params: req.params.append('key', apiKey),
  //   });
  //   return next(modifiedReq);
  // }

  return next(req);
};