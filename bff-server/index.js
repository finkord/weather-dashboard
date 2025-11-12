require('dotenv').config();
const express = require('express');
const fetch = require('node-fetch'); // (v2: npm install node-fetch@2)
const cors = require('cors');
const NodeCache = require('node-cache');

const app = express();
const port = 3000;

const {
  GOOGLE_API_KEY,
  GOOGLE_WEATHER_API_URL, // Має вказувати на API погоди (напр. з environment.example.ts)
  GOOGLE_PLACES_API_URL, // Має бути https://maps.googleapis.com/maps/api/place
} = process.env;

// Ініціалізуємо кеші
const weatherCache = new NodeCache({ stdTTL: 3600 }); // 1 година (для погоди)
const geoCache = new NodeCache({ stdTTL: 31_536_000 }); // 1 рік (для деталей місця)

app.use(cors());

// --- ХЕЛПЕРИ ДЛЯ ПОГОДИ ---

/**
 * Хелпер: Отримує ОДНУ сторінку прогнозу від Google (ВИПРАВЛЕНА ВЕРСІЯ)
 */
async function _fetchForecastPage(lat, lon, pageToken) {
  // Кінцева точка (endpoint) для прогнозу по днях
  const endpoint = `${GOOGLE_WEATHER_API_URL}/v1/forecast/days:lookup`;

  // Використовуємо URLSearchParams для коректного формування параметрів
  const params = new URLSearchParams({
    key: GOOGLE_API_KEY,
    'location.latitude': lat,
    'location.longitude': lon,
    days: '10', // Google API за замовчуванням може повертати менше,
    // але ми просимо 10, щоб відповідати логіці пагінації
  });

  // Додаємо токен, якщо він є (для сторінки 2)
  if (pageToken) {
    params.append('pageToken', pageToken);
  }

  const apiUrl = `${endpoint}?${params.toString()}`;

  console.log(`[BFF] Fetching Google Weather API: ${endpoint}?key=...`); // Логуємо без ключа

  const response = await fetch(apiUrl);

  if (!response.ok) {
    const errorBody = await response.text(); // Спробуємо отримати деталі помилки
    console.error('[BFF] Google API Error Body:', errorBody);
    throw new Error(`Google API error: ${response.statusText} (Status: ${response.status})`);
  }

  return await response.json(); // Повертає "сирий" GoogleForecastResponse
}

/**
 * Хелпер: Трансформує "сирі" дані у наш "чистий" DailyForecast
 */
function _transformForecast(googleDays) {
  if (!googleDays || googleDays.length === 0) {
    return [];
  }

  // Це логіка з вашого 'weather.service.ts'
  return googleDays.map((day) => ({
    date: day.displayDate,
    tempMax: day.maxTemperature.degrees,
    tempMin: day.minTemperature.degrees,
    description: day.daytimeForecast.weatherCondition.description.text,
    iconType: day.daytimeForecast.weatherCondition.type,
    precipitationChance: day.daytimeForecast.precipitation.probability.percent,
    windSpeed: day.daytimeForecast.wind.speed.value,
  }));
}

// --- ЕНДПОІНТ ПОГОДИ ---

/**
 * Ендпоінт для погоди (з пагінацією та трансформацією)
 * /api/weather?lat=...&lon=...
 */
app.get('/api/weather', async (req, res) => {
  const { lat, lon } = req.query;
  if (!lat || !lon) {
    return res.status(400).json({ message: 'Missing lat or lon' });
  }

  const cacheKey = `weather:${lat}:${lon}`;

  // 1. Перевірка кешу (тут вже лежать чисті дані)
  const cachedData = weatherCache.get(cacheKey);
  if (cachedData) {
    console.log(`[BFF] Cache HIT (clean data) for: ${cacheKey}`);
    return res.json(cachedData);
  }

  console.log(`[BFF] Cache MISS for: ${cacheKey}`);

  try {
    // 2. Отримуємо сторінку 1
    const page1Response = await _fetchForecastPage(lat, lon);
    let allForecastDays = page1Response.forecastDays || [];

    // 3. Перевіряємо, чи потрібна сторінка 2
    if (page1Response.nextPageToken) {
      console.log(`[BFF] Fetching page 2 for: ${cacheKey}`);
      const page2Response = await _fetchForecastPage(lat, lon, page1Response.nextPageToken);
      allForecastDays = [...allForecastDays, ...(page2Response.forecastDays || [])];
    }

    // 4. Трансформуємо ВЕСЬ масив
    const cleanForecast = _transformForecast(allForecastDays);

    // 5. Кешуємо чисті дані
    weatherCache.set(cacheKey, cleanForecast);

    res.json(cleanForecast);
  } catch (error) {
    console.error('[BFF] Error fetching weather:', error.message);
    res.status(500).json({ message: 'Error fetching weather data' });
  }
});

// --- ЕНДПОІНТИ ДЛЯ ГЕОЛОКАЦІЇ ---

/**
 * Ендпоінт 1: Автозаповнення міст
 * /api/places/autocomplete?q=...
 */
app.get('/api/places/autocomplete', async (req, res) => {
  const { q } = req.query;
  if (!q) {
    return res.status(400).json({ message: 'Missing q (query) parameter' });
  }

  const apiUrl = `${GOOGLE_PLACES_API_URL}/autocomplete/json?input=${encodeURIComponent(
    q
  )}&types=(cities)&key=${GOOGLE_API_KEY}`;

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) throw new Error(`Google API error: ${response.statusText}`);
    const data = await response.json();

    res.json(data.predictions || []);
  } catch (error) {
    console.error('[BFF] Error fetching autocomplete:', error.message);
    res.status(500).json({ message: 'Error fetching autocomplete data' });
  }
});

/**
 * Ендпоінт 2: Деталі місця (з кешуванням та трансформацією)
 * /api/places/details?placeId=...
 */
app.get('/api/places/details', async (req, res) => {
  const { placeId } = req.query;
  if (!placeId) {
    return res.status(400).json({ message: 'Missing placeId parameter' });
  }

  const cacheKey = `place:${placeId}`;

  // 1. Перевірка кешу
  const cachedData = geoCache.get(cacheKey);
  if (cachedData) {
    console.log(`[BFF] Cache HIT (clean details) for: ${cacheKey}`);
    return res.json(cachedData);
  }

  console.log(`[BFF] Cache MISS for: ${cacheKey}`);

  // 2. Запит до Google
  const apiUrl = `${GOOGLE_PLACES_API_URL}/details/json?place_id=${placeId}&fields=name,geometry/location&key=${GOOGLE_API_KEY}`;

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) throw new Error(`Google API error: ${response.statusText}`);
    const data = await response.json();

    if (data.status !== 'OK' || !data.result) {
      throw new Error(`Google Details API status: ${data.status}`);
    }

    // 3. Трансформація
    const details = {
      name: data.result.name,
      coords: {
        latitude: data.result.geometry.location.lat,
        longitude: data.result.geometry.location.lng,
      },
    };

    // 4. Кешування
    geoCache.set(cacheKey, details);

    res.json(details);
  } catch (error) {
    console.error('[BFF] Error fetching place details:', error.message);
    res.status(500).json({ message: 'Error fetching place details' });
  }
});

app.listen(port, () => {
  console.log(`[BFF] Локальний "Розумний" BFF запущено на http://localhost:${port}`);
});
