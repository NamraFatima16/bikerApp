const WEATHER_API_KEY = "dd636bd4b282c2e3528628fa4a6e703a";

export type WeatherData = {
  temperature: number;
  feelsLike: number;
  description: string;
  windSpeed: number;
  humidity: number;
  icon: string;
};

export async function getWeatherAtPoint(
  lat: number,
  lng: number,
): Promise<WeatherData> {
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&units=metric&appid=${WEATHER_API_KEY}`;

  const response = await fetch(url);
  const data = await response.json();

  if (data.cod !== 200) {
    throw new Error(data.massage || "Failed to get weather");
  }

  return {
    temperature: data.main.temp,
    feelsLike: data.main.feels_like,
    description: data.weather[0].description,
    windSpeed: data.wind.speed,
    humidity: data.main.humidity,
    icon: data.weather[0].icon,
  };
}

export async function getWeatherAlongRoute(
  coordinates: number[][],
  intervalKm: number = 15,
): Promise<{ coordinate: number[]; weather: WeatherData }[]> {
  const result = [];
  const intervalMeters = intervalKm * 1000;
  let distanceCovered = 0;

  for (let i = 0; i < coordinates.length; i++) {
    if (i === 0 || distanceCovered >= intervalMeters) {
      const [lng, lat] = coordinates[i];
      const weather = await getWeatherAtPoint(lat, lng);
      result.push({ coordinate: coordinates[i], weather });
      distanceCovered = 0;
    }

    if (i < coordinates.length - 1) {
      const [lng1, lat1] = coordinates[i];
      const [lng2, lat2] = coordinates[i + 1];
      distanceCovered += getDistanceMetres(lat1, lng1, lat2, lng2);
    }
  }
  return result;
}

function getDistanceMetres(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): number {
  const R = 6371000;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
