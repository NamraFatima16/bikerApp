import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import MapboxGL from "@rnmapbox/maps";
import { getDirections } from "../../lib/api/directions";

MapboxGL.setAccessToken(process.env.EXPO_PUBLIC_MAPBOX_TOKEN || "");

export default function PlannerScreen() {
  const [startLng, setStartLng] = useState("");
  const [startLat, setStartLat] = useState("");
  const [endLng, setEndLng] = useState("");
  const [endLat, setEndLat] = useState("");
  const [routeCoords, setRouteCoords] = useState<number[][]>([]);
  const [distance, setDistance] = useState<number | null>(null);
  const [duration, setDuration] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGetRoute = async () => {
    if (!startLng || !startLat || !endLng || !endLat) {
      Alert.alert("Error", "Please fill in all coordinates");
      return;
    }
    setLoading(true);
    try {
      const result = await getDirections(
        parseFloat(startLng),
        parseFloat(startLat),
        parseFloat(endLng),
        parseFloat(endLat),
      );
      setRouteCoords(result.coordinates);
      setDistance(result.distance);
      setDuration(result.duration);
    } catch (error) {
      Alert.alert("Error", "Could not get directions");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.label}>Start Point</Text>
        <View style={styles.row}>
          <TextInput
            style={[styles.input, styles.half]}
            placeholder="Longitude"
            placeholderTextColor="#999"
            value={startLng}
            onChangeText={setStartLng}
            keyboardType="numeric"
          />
          <TextInput
            style={[styles.input, styles.half]}
            placeholder="Latitude"
            placeholderTextColor="#999"
            value={startLat}
            onChangeText={setStartLat}
            keyboardType="numeric"
          />
        </View>
        <Text style={styles.label}>End Point</Text>
        <View style={styles.row}>
          <TextInput
            style={[styles.input, styles.half]}
            placeholder="Longitude"
            placeholderTextColor="#999"
            value={endLng}
            onChangeText={setEndLng}
            keyboardType="numeric"
          />
          <TextInput
            style={[styles.input, styles.half]}
            placeholder="Latitude"
            placeholderTextColor="#999"
            value={endLat}
            onChangeText={setEndLat}
            keyboardType="numeric"
          />
        </View>
        <TouchableOpacity style={styles.button} onPress={handleGetRoute}>
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
          zoomLevel={10}
          centerCoordinate={[-8.24389, 51.89854]}
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
      </MapboxGL.MapView>
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1 },
  form: { padding: 16, backgroundColor: "#fff" },
  label: { fontSize: 14, fontWeight: "bold", marginBottom: 4 },
  row: { flexDirection: "row", gap: 8, marginBottom: 12 },
  half: { flex: 1 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    color: "#000",
  },
  button: {
    backgroundColor: "#000",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "bold" },
  info: { marginTop: 12 },
  infoText: { fontSize: 14, color: "#333", marginBottom: 4 },
  map: { flex: 1 },
});
