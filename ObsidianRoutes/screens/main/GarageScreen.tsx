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
import {
  getBikes,
  createBike,
  updateBike,
  deleteBike,
  Bike,
} from "../../lib/api/bikes";

export default function GarageScreen() {
  const [bikes, setBikes] = useState<Bike[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingBike, setEditingBike] = useState<Bike | null>(null);
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [engineSize, setEngineSize] = useState("");
  const [licensePlate, setLicensePlate] = useState("");
  const [odometer, setOdometer] = useState("");

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

  const openAddModal = () => {
    setEditingBike(null);
    setMake("");
    setModel("");
    setYear("");
    setEngineSize("");
    setLicensePlate("");
    setOdometer("");
    setModalVisible(true);
  };

  const openEditModal = (bike: Bike) => {
    setEditingBike(bike);
    setMake(bike.make);
    setModel(bike.model);
    setYear(bike.year.toString());
    setEngineSize(bike.engine_size?.toString() || "");
    setLicensePlate(bike.license_plate || "");
    setOdometer(bike.odometer.toString());
    setModalVisible(true);
  };

  const handleSave = async () => {
    if (!make || !model || !year) {
      Alert.alert("Error", "Make, model and year are required");
      return;
    }
    try {
      if (editingBike) {
        await updateBike(editingBike.id, {
          make,
          model,
          year: parseInt(year),
          engine_size: engineSize ? parseInt(engineSize) : undefined,
          license_plate: licensePlate || undefined,
          odometer: odometer ? parseInt(odometer) : 0,
        });
      } else {
        await createBike({
          make,
          model,
          year: parseInt(year),
          engine_size: engineSize ? parseInt(engineSize) : undefined,
          license_plate: licensePlate || undefined,
          odometer: odometer ? parseInt(odometer) : 0,
        });
      }
      setModalVisible(false);
      loadBikes();
    } catch (error) {
      Alert.alert("Error", "Failed to save bike");
    }
  };

  const handleDeleteBike = (id: string) => {
    Alert.alert("Delete Bike", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteBike(id);
            loadBikes();
          } catch (error) {
            Alert.alert("Error", "Failed to delete bike");
          }
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
            <View style={styles.bikeInfo}>
              <Text style={styles.bikeName}>
                {item.year} {item.make} {item.model}
              </Text>
              {item.license_plate && (
                <Text style={styles.bikeDetail}>
                  Plate: {item.license_plate}
                </Text>
              )}
              {item.engine_size && (
                <Text style={styles.bikeDetail}>
                  Engine: {item.engine_size}cc
                </Text>
              )}
              <Text style={styles.bikeDetail}>
                Odometer: {item.odometer} km
              </Text>
            </View>
            <View style={styles.bikeActions}>
              <TouchableOpacity
                style={styles.editBtn}
                onPress={() => openEditModal(item)}
              >
                <Text style={styles.editBtnText}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDeleteBike(item.id)}>
                <Text style={styles.deleteBtn}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>No bikes yet. Add one!</Text>
        }
      />
      <TouchableOpacity style={styles.addBtn} onPress={openAddModal}>
        <Text style={styles.addBtnText}>+ Add Bike</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} animationType="slide">
        <View style={styles.modal}>
          <Text style={styles.title}>
            {editingBike ? "Edit Bike" : "Add Bike"}
          </Text>
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
            placeholder="Odometer (km)"
            placeholderTextColor="#999"
            value={odometer}
            onChangeText={setOdometer}
            keyboardType="numeric"
          />
          <TouchableOpacity style={styles.addBtn} onPress={handleSave}>
            <Text style={styles.addBtnText}>
              {editingBike ? "Save Changes" : "Add Bike"}
            </Text>
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
  bikeInfo: { flex: 1 },
  bikeActions: { alignItems: "flex-end", gap: 8 },
  bikeName: { fontSize: 16, fontWeight: "bold" },
  bikeDetail: { fontSize: 14, color: "#666", marginTop: 2 },
  editBtn: {
    backgroundColor: "#000",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  editBtnText: { color: "#fff", fontSize: 12, fontWeight: "bold" },
  deleteBtn: { color: "red", fontSize: 12 },
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
