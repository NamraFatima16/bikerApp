const MAPBOX_TOKEN = process.env.EXPO_PUBLIC_MAPBOX_TOKEN || "";

export async function getDirections(
  startLng: number,
  startLat: number,
  endLng: number,
  endLat: number,
) {
  const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${startLng},${startLat};${endLng},${endLat}?geometries=geojson&access_token=${MAPBOX_TOKEN}`;

  const response = await fetch(url);
  const data = await response.json();

  if (!data.routes || data.routes.length === 0) {
    throw new Error("No routes found");
  }

  const route = data.routes[0];

  return {
    distance: route.distance,
    duration: route.duration,
    coordinates: route.geometry.coordinates,
  };
}
