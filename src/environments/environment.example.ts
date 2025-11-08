const GOOGLE_MAPS_API_KEY = '[YOUR_GOOGLE_MAPS_API_KEY]';

export const environment = {
  production: false,
  weatherApi: {
    baseUrl: 'https://weather.googleapis.com/v1',
    apiKey: GOOGLE_MAPS_API_KEY,
  },
  placesApi: {
    baseUrl: 'https://maps.googleapis.com/maps/api/place',
    apiKey: GOOGLE_MAPS_API_KEY,
  },
};