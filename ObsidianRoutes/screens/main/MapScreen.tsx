import React, { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import MapboxGL from "@rnmapbox/maps";
import {
  requestLocationPermission,
  watchLocation,
  LocationPoint,
} from "../../lib/api/location";
import * as Location from "expo-location";

MapboxGL.setAccessToken(process.env.EXPO_PUBLIC_MAPBOX_TOKEN || "");

export default function MapScreen() {
  const [isRiding, setIsRiding] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<LocationPoint | null>(
    null,
  );
  const [routeCoords, setRouteCoords] = useState<number[][]>([]);
  const [distance, setDistance] = useState(0);
  const [speed, setSpeed] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const watchRef = useRef<Location.LocationSubscription | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastCoordRef = useRef<number[] | null>(null);

  useEffect(() => {
    return () => {
      watchRef.current?.remove();
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const startRide = async () => {
    const granted = await requestLocationPermission();
    if (!granted) {
      Alert.alert("Error", "Location permission required");
      return;
    }
    setIsRiding(true);
    setRouteCoords([]);
    setDistance(0);
    setElapsedTime(0);

    timerRef.current = setInterval(() => {
      setElapsedTime((prev) => prev + 1);
    }, 1000);

    watchRef.current = await watchLocation((point) => {
      setCurrentLocation(point);
      setSpeed(point.speed ? Math.round(point.speed * 3.6 * 10) / 10 : 0);
      const newCoord = [point.longitude, point.latitude];
      setRouteCoords((prev) => [...prev, newCoord]);
    });
  };

  const stopRide = () => {
    setIsRiding(false);
    watchRef.current?.remove();
    if (timerRef.current) clearInterval(timerRef.current);
    Alert.alert("Ride Complete", `Distance: ${distance.toFixed(1)} km`);
  };

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <View style={styles.container}>
      <MapboxGL.MapView style={styles.map}>
        <MapboxGL.Camera
          zoomLevel={15}
          centerCoordinate={
            currentLocation
              ? [currentLocation.longitude, currentLocation.latitude]
              : [-8.24389, 51.89854]
          }
          followUserLocation={isRiding}
        />
        {currentLocation && (
          <MapboxGL.PointAnnotation
            id="userLocation"
            coordinate={[currentLocation.longitude, currentLocation.latitude]}
          >
            <View style={styles.locationDot} />
          </MapboxGL.PointAnnotation>
        )}
        {routeCoords.length > 1 && (
          <MapboxGL.ShapeSource
            id="rideRoute"
            shape={{
              type: "Feature",
              properties: {},
              geometry: { type: "LineString", coordinates: routeCoords },
            }}
          >
            <MapboxGL.LineLayer
              id="rideLine"
              style={{ lineColor: "#000", lineWidth: 3 }}
            />
          </MapboxGL.ShapeSource>
        )}
      </MapboxGL.MapView>

      <View style={styles.stats}>
        <View style={styles.stat}>
          <Text style={styles.statValue}>{speed}</Text>
          <Text style={styles.statLabel}>km/h</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statValue}>{distance.toFixed(1)}</Text>
          <Text style={styles.statLabel}>km</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statValue}>{formatTime(elapsedTime)}</Text>
          <Text style={styles.statLabel}>time</Text>
        </View>
      </View>

      <TouchableOpacity
        style={[styles.button, isRiding ? styles.stopBtn : styles.startBtn]}
        onPress={isRiding ? stopRide : startRide}
      >
        <Text style={styles.buttonText}>
          {isRiding ? "Stop Ride" : "Start Ride"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  locationDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#000",
    borderWidth: 2,
    borderColor: "#fff",
  },
  stats: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 16,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  stat: { alignItems: "center" },
  statValue: { fontSize: 24, fontWeight: "bold" },
  statLabel: { fontSize: 12, color: "#666" },
  button: {
    margin: 16,
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  startBtn: { backgroundColor: "#000" },
  stopBtn: { backgroundColor: "#ff3b30" },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
