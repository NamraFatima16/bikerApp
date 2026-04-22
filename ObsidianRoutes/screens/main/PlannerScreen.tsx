import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  FlatList,
} from "react-native";
import MapboxGL from "@rnmapbox/maps";
import { getDirections } from "../../lib/api/directions";
import { getWeatherAlongRoute, WeatherData } from "../../lib/api/weather";

MapboxGL.setAccessToken(process.env.EXPO_PUBLIC_MAPBOX_TOKEN || "");

const MAPBOX_TOKEN = process.env.EXPO_PUBLIC_MAPBOX_TOKEN || "";

type Suggestion = {
  id: string;
  place_name: string;
  center: [number, number];
};

async function searchPlaces(query: string): Promise<Suggestion[]> {
  if (!query || query.length < 3) return [];
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${MAPBOX_TOKEN}&country=IE,GB&limit=5`;
  const response = await fetch(url);
  const data = await response.json();
  return (data.features || []).map((f: any) => ({
    id: f.id,
    place_name: f.place_name,
    center: f.center,
  }));
}

export default function PlannerScreen() {
  const [startQuery, setStartQuery] = useState("");
  const [endQuery, setEndQuery] = useState("");
  const [startSuggestions, setStartSuggestions] = useState<Suggestion[]>([]);
  const [endSuggestions, setEndSuggestions] = useState<Suggestion[]>([]);
  const [startCoord, setStartCoord] = useState<[number, number] | null>(null);
  const [endCoord, setEndCoord] = useState<[number, number] | null>(null);
  const [routeCoords, setRouteCoords] = useState<number[][]>([]);
  const [distance, setDistance] = useState<number | null>(null);
  const [duration, setDuration] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [weatherPoints, setWeatherPoints] = useState
    { coordinate: number[]; weather: WeatherData }[]
  >([]);

  const handleStartSearch = async (text: string) => {
    setStartQuery(text);
    setStartCoord(null);
    const results = await searchPlaces(text);
    setStartSuggestions(results);
  };

  const handleEndSearch = async (text: string) => {
    setEndQuery(text);
    setEndCoord(null);
    const results = await searchPlaces(text);
    setEndSuggestions(results);
  };

  const selectStart = (suggestion: Suggestion) => {
    setStartQuery(suggestion.place_name);
    setStartCoord(suggestion.center);
    setStartSuggestions([]);
  };

  const selectEnd = (suggestion: Suggestion) => {
    setEndQuery(suggestion.place_name);
    setEndCoord(suggestion.center);
    setEndSuggestions([]);
  };

  const handleGetRoute = async () => {
    if (!startCoord || !endCoord) {
      Alert.alert("Error", "Please select a start and end location");
      return;
    }
    setLoading(true);
    try {
      const result = await getDirections(
        startCoord[0],
        startCoord[1],
        endCoord[0],
        endCoord[1],
      );
      setRouteCoords(result.coordinates);
      setDistance(result.distance);
      setDuration(result.duration);
      const weather = await getWeatherAlongRoute(result.coordinates);
      setWeatherPoints(weather);
    } catch (error) {
      Alert.alert("Error", "Could not get directions");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.label}>Start Location</Text>
        <TextInput
          style={styles.input}
          placeholder="Search start location..."
          placeholderTextColor="#999"
          value={startQuery}
          onChangeText={handleStartSearch}
        />
        {startSuggestions.length > 0 && (
          <FlatList
            data={startSuggestions}
            keyExtractor={(item) => item.id}
            style={styles.suggestions}
            keyboardShouldPersistTaps="handled"
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.suggestion}
                onPress={() => selectStart(item)}
              >
                <Text style={styles.suggestionText}>{item.place_name}</Text>
              </TouchableOpacity>
            )}
          />
        )}

        <Text style={styles.label}>End Location</Text>
        <TextInput
          style={styles.input}
          placeholder="Search end location..."
          placeholderTextColor="#999"
          value={endQuery}
          onChangeText={handleEndSearch}
        />
        {endSuggestions.length > 0 && (
          <FlatList
            data={endSuggestions}
            keyExtractor={(item) => item.id}
            style={styles.suggestions}
            keyboardShouldPersistTaps="handled"
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.suggestion}
                onPress={() => selectEnd(item)}
              >
                <Text style={styles.suggestionText}>{item.place_name}</Text>
              </TouchableOpacity>
            )}
          />
        )}

        <TouchableOpacity
          style={[
            styles.button,
            (!startCoord || !endCoord) && styles.buttonDisabled,
          ]}
          onPress={handleGetRoute}
          disabled={!startCoord || !endCoord || loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Get Route</Text>
          )}
        </TouchableOpacity>

        {distance && duration && (
          <View style={styles.info}>
            <Text style={styles.infoText}>
              Distance: {(distance / 1000).toFixed(1)} km
            </Text>
            <Text style={styles.infoText}>
              Duration: {Math.round(duration / 60)} mins
            </Text>
          </View>
        )}
      </View>

      <MapboxGL.MapView style={styles.map}>
        <MapboxGL.Camera
          zoomLevel={7}
          centerCoordinate={[-8.24389, 53.0]}
        />
        {routeCoords.length > 0 && (
          <MapboxGL.ShapeSource
            id="routeSource"
            shape={{
              type: "Feature",
              properties: {},
              geometry: {
                type: "LineString",
                coordinates: routeCoords,
              },
            }}
          >
            <MapboxGL.LineLayer
              id="routeLine"
              style={{ lineColor: "#000", lineWidth: 4 }}
            />
          </MapboxGL.ShapeSource>
        )}
        {weatherPoints.map((point, index) => (
          <MapboxGL.PointAnnotation
            key={`weather-${index}`}
            id={`weather-${index}`}
            coordinate={point.coordinate as [number, number]}
          >
            <View style={styles.weatherMarker}>
              <Text style={styles.weatherTemp}>
                {Math.round(point.weather.temperature)}°
              </Text>
            </View>
          </MapboxGL.PointAnnotation>
        ))}
      </MapboxGL.MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  form: { padding: 16, backgroundColor: "#fff" },
  label: { fontSize: 14, fontWeight: "bold", marginBottom: 4 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    color: "#000",
    marginBottom: 4,
  },
  suggestions: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    maxHeight: 150,
    marginBottom: 8,
  },
  suggestion: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  suggestionText: {
    fontSize: 13,
    color: "#333",
  },
  button: {
    backgroundColor: "#000",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
  },
  buttonDisabled: {
    backgroundColor: "#999",
  },
  buttonText: { color: "#fff", fontWeight: "bold" },
  info: { marginTop: 12 },
  infoText: { fontSize: 14, color: "#333", marginBottom: 4 },
  map: { flex: 1 },
  weatherMarker: {
    backgroundColor: "#000",
    borderRadius: 12,
    padding: 4,
    minWidth: 36,
    alignItems: "center",
  },
  weatherTemp: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
});