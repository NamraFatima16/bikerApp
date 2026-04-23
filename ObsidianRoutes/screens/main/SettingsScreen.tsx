import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
  Alert,
} from "react-native";

export default function SettingsScreen() {
  const [weatherAlerts, setWeatherAlerts] = useState(true);
  const [speedUnit, setSpeedUnit] = useState<"kmh" | "mph">("kmh");
  const [distanceUnit, setDistanceUnit] = useState<"km" | "miles">("km");

  return (
    <View style={styles.container}>
      <Text style={styles.pageTitle}>Settings</Text>

      <Text style={styles.sectionTitle}>Safety</Text>
      <View style={styles.card}>
        <View style={styles.row}>
          <View>
            <Text style={styles.label}>Weather Alerts</Text>
            <Text style={styles.sublabel}>
              Warn when conditions exceed thresholds
            </Text>
          </View>
          <Switch
            value={weatherAlerts}
            onValueChange={setWeatherAlerts}
            trackColor={{ true: "#000" }}
          />
        </View>
      </View>

      <Text style={styles.sectionTitle}>Units</Text>
      <View style={styles.card}>
        <Text style={styles.label}>Speed</Text>
        <View style={styles.segmentRow}>
          <TouchableOpacity
            style={[
              styles.segment,
              speedUnit === "kmh" && styles.segmentActive,
            ]}
            onPress={() => setSpeedUnit("kmh")}
          >
            <Text
              style={[
                styles.segmentText,
                speedUnit === "kmh" && styles.segmentTextActive,
              ]}
            >
              km/h
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.segment,
              speedUnit === "mph" && styles.segmentActive,
            ]}
            onPress={() => setSpeedUnit("mph")}
          >
            <Text
              style={[
                styles.segmentText,
                speedUnit === "mph" && styles.segmentTextActive,
              ]}
            >
              mph
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={[styles.label, { marginTop: 16 }]}>Distance</Text>
        <View style={styles.segmentRow}>
          <TouchableOpacity
            style={[
              styles.segment,
              distanceUnit === "km" && styles.segmentActive,
            ]}
            onPress={() => setDistanceUnit("km")}
          >
            <Text
              style={[
                styles.segmentText,
                distanceUnit === "km" && styles.segmentTextActive,
              ]}
            >
              km
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.segment,
              distanceUnit === "miles" && styles.segmentActive,
            ]}
            onPress={() => setDistanceUnit("miles")}
          >
            <Text
              style={[
                styles.segmentText,
                distanceUnit === "miles" && styles.segmentTextActive,
              ]}
            >
              miles
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.sectionTitle}>About</Text>
      <View style={styles.card}>
        <View style={styles.aboutRow}>
          <Text style={styles.label}>App Version</Text>
          <Text style={styles.value}>1.0.0</Text>
        </View>
        <View
          style={[
            styles.aboutRow,
            {
              borderTopWidth: 1,
              borderColor: "#eee",
              marginTop: 8,
              paddingTop: 8,
            },
          ]}
        >
          <Text style={styles.label}>Platform</Text>
          <Text style={styles.value}>Android</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#f0f0f0" },
  pageTitle: { fontSize: 24, fontWeight: "bold", marginBottom: 24 },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#999",
    marginBottom: 8,
    textTransform: "uppercase",
  },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 24,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  label: { fontSize: 16, fontWeight: "600", color: "#000" },
  sublabel: { fontSize: 12, color: "#999", marginTop: 2 },
  value: { fontSize: 16, color: "#666" },
  segmentRow: {
    flexDirection: "row",
    marginTop: 8,
    borderRadius: 8,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  segment: {
    flex: 1,
    padding: 10,
    alignItems: "center",
    backgroundColor: "#fff",
  },
  segmentActive: { backgroundColor: "#000" },
  segmentText: { color: "#000", fontWeight: "600" },
  segmentTextActive: { color: "#fff" },
  aboutRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
