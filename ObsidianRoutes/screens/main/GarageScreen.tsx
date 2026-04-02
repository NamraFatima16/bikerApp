import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  ActivityIndicator,
} from "react-native";

import { getBikes, createBike, deleteBike, Bike } from "../../lib/api/bikes";

export default function GarageScreen() {
  const [bikes, setBikes] = useState<Bike[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [engineSize, setEngineSize] = useState("");
  const [licensePlate, setLicensePlate] = useState("");

  useEffect(() => {
    loadBikes();
  }, []);

  const loadBikes = async () => {
    try {
      const data = await getBikes();
      setBikes(data);
    } catch (error) {
      Alert.alert("Error", "Failed to load bikes");
    } finally {
      setLoading(false);
    }
  };

  const handleAddBike = async () => {
    if (!make || !model || !year) {
      Alert.alert("Error", "Make, model and year are required");
      return;
    }
    try {
      await createBike({
        make,
        model,
        year: parseInt(year),
        engine_size: engineSize ? parseInt(engineSize) : undefined,
        license_plate: licensePlate || undefined,
        odometer: 0,
      });
      setModalVisible(false);
      setMake("");
      setModel("");
      setYear("");
      setEngineSize("");
      setLicensePlate("");
      loadBikes();
    } catch (error) {
      Alert.alert("Error", "Failed to add bike");
    }
  };
  const handleDeleteBike = (id: string) => {
    Alert.alert("Delete Bike", "Are you sure?", [
      { text: "Cacel", style: "cancel" },

      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          await deleteBike(id);
          loadBikes();
        },
      },
    ]);
  };

  if (loading) return <ActivityIndicator style={styles.loader} />;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Garage</Text>
      <FlatList
        data={bikes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.bikeCard}>
            <View>
              <Text style={styles.bikeName}>
                {item.year} {item.make} {item.model}
              </Text>
              {item.license_plate && (
                <Text style={styles.bikeDetail}>
                  Plate: {item.license_plate}
                </Text>
              )}
              <Text style={styles.bikeDetail}>
                Odometer: {item.odometer} km
              </Text>
            </View>
            <TouchableOpacity onPress={() => handleDeleteBike(item.id)}>
              <Text style={styles.deleteBtn}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>No bikes yet. Add one!</Text>
        }
      />
      <TouchableOpacity
        style={styles.addBtn}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.addBtnText}>+ Add Bike</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} animationType="slide">
        <View style={styles.modal}>
          <Text style={styles.title}>Add Bike</Text>
          <TextInput
            style={styles.input}
            placeholder="Make *"
            placeholderTextColor="#999"
            value={make}
            onChangeText={setMake}
          />
          <TextInput
            style={styles.input}
            placeholder="Model *"
            placeholderTextColor="#999"
            value={model}
            onChangeText={setModel}
          />
          <TextInput
            style={styles.input}
            placeholder="Year *"
            placeholderTextColor="#999"
            value={year}
            onChangeText={setYear}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            placeholder="Engine Size (cc)"
            placeholderTextColor="#999"
            value={engineSize}
            onChangeText={setEngineSize}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            placeholder="License Plate"
            placeholderTextColor="#999"
            value={licensePlate}
            onChangeText={setLicensePlate}
          />
          <TextInput
            style={styles.input}
            placeholder="Make *"
            placeholderTextColor="#999"
            value={make}
            onChangeText={setMake}
          />
          <TouchableOpacity style={styles.addBtn} onPress={handleAddBike}>
            <Text style={styles.addBtnText}>Save</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setModalVisible(false)}>
            <Text style={styles.cancel}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#f0f0f0" },
  loader: { flex: 1 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 16 },
  bikeCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    marginBottom: 8,
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  bikeName: { fontSize: 16, fontWeight: "bold" },
  bikeDetail: { fontSize: 14, color: "#666" },
  deleteBtn: { color: "red" },
  empty: { textAlign: "center", color: "#666", marginTop: 32 },
  addBtn: {
    backgroundColor: "#000",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 16,
  },
  addBtnText: { color: "#fff", fontWeight: "bold" },
  modal: {
    flex: 1,
    padding: 24,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#999",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    backgroundColor: "#fff",
    color: "#000",
  },
  cancel: { textAlign: "center", color: "#666", marginTop: 16 },
});
