import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Alert,
} from "react-native";
import MapboxGL from "@rnmapbox/maps";
import { Ride } from "../../lib/api/rides";
import { useEffect, useState } from "react";
import { getHazardsByRide, upvoteHazard } from "../../lib/api/hazards";

type Props = {
  visible: boolean;
  ride?: Ride | null;
  onClose: () => void;
  onDelete: (id: string) => void;
};

export default function RideDetailModal({
  visible,
  ride,
  onClose,
  onDelete,
}: Props) {
  const [hazards, setHazards] = useState<any[]>([]);
  const [loadingHazards, setLoadingHazards] = useState(false);

  useEffect(() => {
    async function fetchHazards() {
      if (!visible || !ride) return;
      setLoadingHazards(true);
      try {
        const data = await getHazardsByRide(ride.id);
        setHazards(data || []);
      } catch (err) {
        // ignore for now
      } finally {
        setLoadingHazards(false);
      }
    }
    fetchHazards();
  }, [visible, ride]);

  if (!ride) return null;

  const coords = ride.route_coordinates.map((c) => [c[1], c[0]]); // [lng, lat]

  const handleDelete = () => {
    Alert.alert("Delete Ride", "This cannot be undone. Delete?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => onDelete(ride.id),
      },
    ]);
  };

  const handleUpvote = async (id: string) => {
    try {
      await upvoteHazard(id);
      setHazards((prev) =>
        prev.map((h) =>
          h.id === id ? { ...h, upvotes: (h.upvotes || 0) + 1 } : h,
        ),
      );
    } catch (err) {
      Alert.alert("Error", "Failed to upvote");
    }
  };

  return (
    <Modal visible={visible} animationType="slide">
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Ride Details</Text>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.close}>Close</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.mapContainer}>
          <MapboxGL.MapView style={styles.map} compassEnabled={false}>
            <MapboxGL.Camera
              centerCoordinate={coords.length ? coords[0] : [0, 0]}
              zoomLevel={12}
            />
            {coords.length > 0 && (
              <MapboxGL.ShapeSource
                id="routeLine"
                shape={{
                  type: "Feature",
                  geometry: { type: "LineString", coordinates: coords },
                }}
              >
                <MapboxGL.LineLayer
                  id="routeLineLayer"
                  style={{ lineColor: "#825514", lineWidth: 4 }}
                />
              </MapboxGL.ShapeSource>
            )}

            {hazards.map((h) =>
              h.longitude && h.latitude ? (
                <MapboxGL.PointAnnotation
                  key={h.id}
                  id={`hazard-${h.id}`}
                  coordinate={[h.longitude, h.latitude]}
                >
                  <View style={hazardStyles.marker} />
                </MapboxGL.PointAnnotation>
              ) : null,
            )}
          </MapboxGL.MapView>
        </View>

        <View style={styles.stats}>
          <Text>Date: {new Date(ride.start_time).toLocaleString()}</Text>
          <Text>Distance: {ride.distance.toFixed(1)} km</Text>
          <Text>Duration: {Math.round(ride.duration)} s</Text>
          {ride.avg_speed !== undefined && (
            <Text>Avg speed: {ride.avg_speed} km/h</Text>
          )}
          {ride.max_speed !== undefined && (
            <Text>Max speed: {ride.max_speed} km/h</Text>
          )}
        </View>

        <View style={styles.hazardsList}>
          <Text style={{ fontWeight: "bold", marginBottom: 8 }}>Incidents</Text>
          {loadingHazards && <Text>Loading...</Text>}
          {!loadingHazards && hazards.length === 0 && (
            <Text>No incidents logged for this ride.</Text>
          )}
          {hazards.map((h) => (
            <View key={h.id} style={styles.hazardItem}>
              <View style={{ flex: 1 }}>
                <Text style={{ fontWeight: "600" }}>
                  {h.hazard_type.replace("_", " ")}
                </Text>
                <Text style={{ color: "#666" }}>
                  {new Date(h.created_at).toLocaleString()}
                </Text>
                {h.notes ? <Text>{h.notes}</Text> : null}
              </View>
              <TouchableOpacity
                style={styles.upvoteBtn}
                onPress={() => handleUpvote(h.id)}
              >
                <Text style={{ color: "#116682" }}>▲ {h.upvotes || 0}</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        <TouchableOpacity style={styles.deleteBtn} onPress={handleDelete}>
          <Text style={styles.deleteText}>Delete Ride</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f0f0f0" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
  },
  title: { fontSize: 18, fontWeight: "bold" },
  close: { color: "#116682" },
  mapContainer: { flex: 1, borderRadius: 8, overflow: "hidden", margin: 16 },
  map: { flex: 1 },
  stats: { padding: 16 },
  hazardsList: { padding: 16, backgroundColor: "#fff" },
  hazardItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  upvoteBtn: { padding: 8 },
  deleteBtn: {
    backgroundColor: "#fff",
    padding: 16,
    margin: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  deleteText: { color: "red", textAlign: "center" },
});

const hazardStyles = StyleSheet.create({
  marker: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#8c1717",
    borderWidth: 2,
    borderColor: "#fff",
  },
});
