import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
  ActivityIndicator,
} from "react-native";
import {
  getEmergencyContacts,
  deleteEmergencyContact,
  sendSOS,
  EmergencyContact,
} from "../../lib/api/emergency";
import * as Location from "expo-location";

export default function EmergencyScreen() {
  const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

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

      <Text style={styles.sectionTitle}>Emergency Contacts</Text>

      {contacts.length === 0 ? (
        <Text style={styles.empty}>No emergency contacts added yet.</Text>
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
  sosText: {
    color: "#fff",
    fontSize: 48,
    fontWeight: "bold",
  },
  sosSubText: {
    color: "#fff",
    fontSize: 12,
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  empty: {
    textAlign: "center",
    color: "#666",
    marginTop: 16,
  },
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
  contactName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  primaryBadge: {
    color: "#cc0000",
    fontSize: 12,
    fontWeight: "bold",
  },
  contactPhone: {
    color: "#666",
    marginTop: 2,
  },
  contactRelationship: {
    color: "#999",
    fontSize: 12,
    marginTop: 2,
  },
  deleteBtn: {
    color: "red",
  },
});
