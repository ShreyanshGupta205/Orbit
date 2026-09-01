import { evalSevereWeatherAlert } from "./alerts.service.js";

// In-memory weather cache: Map<key, { data, fetchedAt }>, 15 min TTL
const weatherCache = new Map();
const CACHE_TTL_MS = 15 * 60 * 1000;

/**
 * Fetch location-aware weather data from Open-Meteo API with server-side caching.
 */
export async function getWeatherData(lat, lng) {
  const parsedLat = parseFloat(lat);
  const parsedLng = parseFloat(lng);

  if (isNaN(parsedLat) || isNaN(parsedLng)) {
    throw new Error("Invalid latitude or longitude coordinates");
  }

  // Cache key rounded to 2 decimal places (~1.1 km grid)
  const cacheKey = `${parsedLat.toFixed(2)}_${parsedLng.toFixed(2)}`;
  const now = Date.now();

  if (weatherCache.has(cacheKey)) {
    const cached = weatherCache.get(cacheKey);
    if (now - cached.fetchedAt < CACHE_TTL_MS) {
      return {
        ...cached.data,
        isCached: true,
        dataFreshness: `Fetched ${Math.round((now - cached.fetchedAt) / 1000)}s ago`
      };
    }
  }

  // Call Open-Meteo Free Public Weather API
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${parsedLat}&longitude=${parsedLng}&current=temperature_2m,relative_humidity_2m,precipitation,rain,wind_speed_10m,wind_direction_10m&hourly=precipitation_probability,rain&forecast_days=1`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Open-Meteo API error: ${response.statusText}`);
    }

    const json = await response.json();
    const current = json.current || {};
    const hourly = json.hourly || {};

    const precipitation = current.precipitation !== undefined ? current.precipitation : (current.rain || 0);
    const precipProbability = hourly.precipitation_probability ? hourly.precipitation_probability[0] || 0 : 0;
    const windSpeed = current.wind_speed_10m || 0;

    // Derived rainfall risk score [0, 1] for NERA risk engine
    const rainfallScore = Math.min(parseFloat((precipitation / 20.0).toFixed(3)), 1.0);
    const isSevere = precipitation >= 15.0 || precipProbability >= 80 || windSpeed >= 50;

    const weatherData = {
      location: { lat: parsedLat, lng: parsedLng },
      temperature: current.temperature_2m !== undefined ? current.temperature_2m : 24,
      humidity: current.relative_humidity_2m !== undefined ? current.relative_humidity_2m : 75,
      precipitation,
      precipitationProbability: precipProbability,
      windSpeed,
      windDirection: current.wind_direction_10m || 0,
      rainfallScore,
      isSevere,
      condition: isSevere ? "Heavy Rain / Severe Warning" : precipitation > 2.0 ? "Moderate Rain" : "Partly Cloudy",
      fetchedAt: new Date().toISOString(),
      provider: "Open-Meteo Meteorological Service"
    };

    // Cache the result
    weatherCache.set(cacheKey, { data: weatherData, fetchedAt: now });

    // Trigger severe weather alert evaluation if weather is severe
    if (isSevere) {
      evalSevereWeatherAlert({
        location: `${parsedLat.toFixed(2)}, ${parsedLng.toFixed(2)}`,
        rainfall: precipitation,
        windSpeed,
        districtId: null
      }).catch(err => console.error("Severe weather alert trigger error:", err));
    }

    return {
      ...weatherData,
      isCached: false,
      dataFreshness: "Live reading"
    };
  } catch (err) {
    console.error("Weather fetch failed, utilizing fallback baseline:", err.message);

    // Fallback baseline when external API is unreachable
    return {
      location: { lat: parsedLat, lng: parsedLng },
      temperature: 24.5,
      humidity: 78,
      precipitation: 0.0,
      precipitationProbability: 20,
      windSpeed: 12.0,
      windDirection: 180,
      rainfallScore: 0.0,
      isSevere: false,
      condition: "Data Temporarily Offline (Fallback Baseline)",
      fetchedAt: new Date().toISOString(),
      provider: "NERA Regional Weather Service (Offline Baseline)",
      isCached: false,
      isStale: true,
      dataFreshness: "Offline baseline estimate"
    };
  }
}

export default {
  getWeatherData
};
