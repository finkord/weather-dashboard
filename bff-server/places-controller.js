const fetch = require('node-fetch');

// Отримуємо ключ з змінних середовища (вони вже завантажені в index.js через dotenv)
const { GOOGLE_API_KEY } = process.env;

/**
 * Отримує назву міста за координатами (Google Geocoding API).
 */
async function reverseGeocode(req, res) {
  const { lat, lon } = req.query;

  if (!lat || !lon) {
    return res.status(400).json({ message: 'Missing lat or lon parameter' });
  }

  // Формуємо URL до Google API
  // result_type=locality|administrative_area_level_1 фільтрує результати, щоб отримати населені пункти
  const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lon}&result_type=locality|administrative_area_level_1&key=${GOOGLE_API_KEY}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Google API error: ${response.statusText}`);
    }

    const data = await response.json();

    if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
       throw new Error(`Google API returned status: ${data.status}`);
    }

    let cityName = null;

    if (data.results && data.results.length > 0) {
      const result = data.results[0];
      
      // 1. Шукаємо 'locality' (місто)
      const cityComponent = result.address_components.find(c => 
        c.types.includes('locality')
      );
      
      // 2. Якщо міста немає, шукаємо 'administrative_area_level_1' (область/штат)
      const adminComponent = result.address_components.find(c => 
        c.types.includes('administrative_area_level_1')
      );

      // 3. Запасні варіанти
      const fallbackComponent = result.address_components.find(c =>
        c.types.includes('administrative_area_level_2') || c.types.includes('political')
      );

      if (cityComponent) {
        cityName = cityComponent.long_name;
      } else if (adminComponent) {
        cityName = adminComponent.long_name;
      } else if (fallbackComponent) {
        cityName = fallbackComponent.long_name;
      } else {
        // Крайній випадок: беремо початок адреси
        cityName = result.formatted_address.split(',')[0];
      }
    }

    console.log(`[BFF] Reverse Geocoding (Google): ${lat}, ${lon} -> ${cityName}`);
    
    res.json({ name: cityName });

  } catch (error) {
    console.error('[BFF] Error in reverseGeocode:', error.message);
    // Повертаємо null, клієнт покаже "Your Location" без міста
    res.json({ name: null });
  }
}

module.exports = { reverseGeocode };