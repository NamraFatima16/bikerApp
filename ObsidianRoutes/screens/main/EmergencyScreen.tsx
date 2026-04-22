import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
  ActivityIndicator,
  Modal,
  TextInput,
  Switch,
} from "react-native";
import {
  getEmergencyContacts,
  createEmergencyContact,
  deleteEmergencyContact,
  sendSOS,
  EmergencyContact,
} from "../../lib/api/emergency";
import * as Location from "expo-location";

export default function EmergencyScreen() {
  const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [relationship, setRelationship] = useState("");
  const [isPrimary, setIsPrimary] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = async () => {
    try {
      const data = await getEmergencyContacts();
      setContacts(data);
    } catch (error) {
      Alert.alert("Error", "Failed to load emergency contacts");
    } finally {
      setLoading(false);
    }
  };

  const handleSOS = async () => {
    if (contacts.length === 0) {
      Alert.alert(
        "No Contacts",
        "Please add at least one emergency contact before sending SOS.",
      );
      return;
    }
    Alert.alert(
      "Send SOS",
      "This will send your GPS location to all your emergency contacts. Continue?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Send SOS",
          style: "destructive",
          onPress: async () => {
            setSending(true);
            try {
              const { status } =
                await Location.requestForegroundPermissionsAsync();
              if (status !== "granted") {
                Alert.alert("Error", "Location permission required for SOS");
                return;
              }
              const location = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.High,
              });
              await sendSOS(
                location.coords.latitude,
                location.coords.longitude,
              );
              Alert.alert(
                "SOS Sent",
                "Your location has been sent to your emergency contacts.",
              );
            } catch (error) {
              Alert.alert("Error", "Failed to send SOS. Please try again.");
            } finally {
              setSending(false);
            }
          },
        },
      ],
    );
  };

  const handleAddContact = async () => {
    if (!name || !phone) {
      Alert.alert("Error", "Name and phone number are required");
      return;
    }
    setSaving(true);
    try {
      await createEmergencyContact({
        name,
        phone,
        relationship: relationship || undefined,
        is_primary: isPrimary,
      });
      setModalVisible(false);
      setName("");
      setPhone("");
      setRelationship("");
      setIsPrimary(false);
      loadContacts();
    } catch (error) {
      Alert.alert("Error", "Failed to add contact");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (id: string) => {
    Alert.alert("Delete Contact", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteEmergencyContact(id);
            loadContacts();
          } catch (error) {
            Alert.alert("Error", "Failed to delete contact");
          }
        },
      },
    ]);
  };

  if (loading) return <ActivityIndicator style={styles.loader} />;

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.sosButton}
        onPress={handleSOS}
        disabled={sending}
      >
        {sending ? (
          <ActivityIndicator color="#fff" size="large" />
        ) : (
          <>
            <Text style={styles.sosText}>SOS</Text>
            <Text style={styles.sosSubText}>Tap to send location</Text>
          </>
        )}
      </TouchableOpacity>

      <View style={styles.headerRow}>
        <Text style={styles.sectionTitle}>Emergency Contacts</Text>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.addBtnText}>+ Add</Text>
        </TouchableOpacity>
      </View>

      {contacts.length === 0 ? (
        <Text style={styles.empty}>
          No emergency contacts added yet. Add one so SOS can reach someone.
        </Text>
      ) : (
        <FlatList
          data={contacts}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.contactCard}>
              <View>
                <Text style={styles.contactName}>
                  {item.name}
                  {item.is_primary && (
                    <Text style={styles.primaryBadge}> PRIMARY</Text>
                  )}
                </Text>
                <Text style={styles.contactPhone}>{item.phone}</Text>
                {item.relationship && (
                  <Text style={styles.contactRelationship}>
                    {item.relationship}
                  </Text>
                )}
              </View>
              <TouchableOpacity onPress={() => handleDelete(item.id)}>
                <Text style={styles.deleteBtn}>Delete</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}

      <Modal visible={modalVisible} animationType="slide">
        <View style={styles.modal}>
          <Text style={styles.modalTitle}>Add Emergency Contact</Text>
          <TextInput
            style={styles.input}
            placeholder="Full Name *"
            placeholderTextColor="#999"
            value={name}
            onChangeText={setName}
          />
          <TextInput
            style={styles.input}
            placeholder="Phone Number *"
            placeholderTextColor="#999"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />
          <TextInput
            style={styles.input}
            placeholder="Relationship (e.g. Partner, Parent)"
            placeholderTextColor="#999"
            value={relationship}
            onChangeText={setRelationship}
          />
          <View style={styles.switchRow}>
            <Text style={styles.switchLabel}>Primary Contact</Text>
            <Switch
              value={isPrimary}
              onValueChange={setIsPrimary}
              trackColor={{ true: "#cc0000" }}
            />
          </View>
          <TouchableOpacity
            style={styles.saveBtn}
            onPress={handleAddContact}
            disabled={saving}
          >
            {saving ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.saveBtnText}>Save Contact</Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setModalVisible(false)}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#f0f0f0" },
  loader: { flex: 1 },
  sosButton: {
    backgroundColor: "#cc0000",
    borderRadius: 100,
    width: 180,
    height: 180,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 32,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  sosText: { color: "#fff", fontSize: 48, fontWeight: "bold" },
  sosSubText: { color: "#fff", fontSize: 12, marginTop: 4 },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: { fontSize: 18, fontWeight: "bold" },
  addBtn: {
    backgroundColor: "#000",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addBtnText: { color: "#fff", fontWeight: "bold" },
  empty: { textAlign: "center", color: "#666", marginTop: 16 },
  contactCard: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  contactName: { fontSize: 16, fontWeight: "bold" },
  primaryBadge: { color: "#cc0000", fontSize: 12, fontWeight: "bold" },
  contactPhone: { color: "#666", marginTop: 2 },
  contactRelationship: { color: "#999", fontSize: 12, marginTop: 2 },
  deleteBtn: { color: "red" },
  modal: {
    flex: 1,
    padding: 24,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
  },
  modalTitle: { fontSize: 24, fontWeight: "bold", marginBottom: 24 },
  input: {
    borderWidth: 1,
    borderColor: "#999",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    backgroundColor: "#fff",
    color: "#000",
  },
  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  switchLabel: { fontSize: 16 },
  saveBtn: {
    backgroundColor: "#000",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 16,
  },
  saveBtnText: { color: "#fff", fontWeight: "bold" },
  cancelText: { textAlign: "center", color: "#666" },
});
