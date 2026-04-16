import React, { useState } from "react";
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { createHazard } from "../../lib/api/hazards";

type Props = {
  visible: boolean;
  onClose: (created?: boolean) => void;
  latitude?: number | null;
  longitude?: number | null;
};

const INCIDENT_TYPES = ["pothole", "road_kill", "near_miss", "other"] as const;

export default function IncidentLogModal({ visible, onClose, latitude, longitude }: Props) {
  const [type, setType] = useState<typeof INCIDENT_TYPES[number]>("pothole");
  const [notes, setNotes] = useState("");

  const submit = async () => {
    if (latitude == null || longitude == null) {
      Alert.alert("Location unavailable", "Cannot log incident: location not available.");
      return;
    }

    try {
      await createHazard({
        latitude,
        longitude,
        hazard_type: type,
        notes: notes || undefined,
      });
      Alert.alert("Saved", "Incident logged successfully.");
      onClose(true);
      setNotes("");
    } catch (err) {
      Alert.alert("Error", "Failed to save incident.");
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.backdrop}>
        <View style={styles.container}>
          <Text style={styles.title}>Log Incident</Text>
          <View style={styles.typeRow}>
            {INCIDENT_TYPES.map((t) => (
              <TouchableOpacity
                key={t}
                style={[styles.typeBtn, type === t && styles.typeBtnActive]}
                onPress={() => setType(t as any)}
              >
                <Text style={styles.typeText}>{t.replace('_', ' ')}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <TextInput
            placeholder="Notes (optional)"
            value={notes}
            onChangeText={setNotes}
            style={styles.input}
            multiline
          />
          <View style={styles.row}>
            <TouchableOpacity style={styles.cancelBtn} onPress={() => onClose(false)}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveBtn} onPress={submit}>
              <Text style={styles.saveText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", alignItems: "center" },
  container: { width: "90%", backgroundColor: "#fff", padding: 16, borderRadius: 8 },
  title: { fontSize: 18, fontWeight: "bold", marginBottom: 8 },
  typeRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 8 },
  typeBtn: { padding: 8, borderRadius: 6, backgroundColor: "#eee" },
  typeBtnActive: { backgroundColor: "#ddd" },
  typeText: { fontSize: 12 },
  input: { height: 80, borderColor: "#ccc", borderWidth: 1, borderRadius: 6, padding: 8, marginBottom: 8 },
  row: { flexDirection: "row", justifyContent: "space-between" },
  cancelBtn: { padding: 12 },
  cancelText: { color: "#666" },
  saveBtn: { backgroundColor: "#000", padding: 12, borderRadius: 6 },
  saveText: { color: "#fff" },
});