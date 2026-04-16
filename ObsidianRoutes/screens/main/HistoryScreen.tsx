import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useRideHistory } from "../../lib/hooks/useRideHistory";
import RideDetailModal from "./RideDetailModal";
import { deleteRide, Ride } from "../../lib/api/rides";
import { getBikes, Bike } from "../../lib/api/bikes";

export default function HistoryScreen() {
  const [filters, setFilters] = useState<any>({ filterType: "all" });
  const [selectedRide, setSelectedRide] = useState<Ride | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const { data: rides, isLoading, refetch } = useRideHistory(filters);
  const [bikes, setBikes] = useState<Bike[]>([]);
  const [loadingBikes, setLoadingBikes] = useState(true);

  React.useEffect(() => {
    (async () => {
      try {
        const b = await getBikes();
        setBikes(b);
      } catch (e) {
        // ignore
      } finally {
        setLoadingBikes(false);
      }
    })();
  }, []);

  const openRide = (ride: Ride) => {
    setSelectedRide(ride);
    setModalVisible(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteRide(id);
      setModalVisible(false);
      setSelectedRide(null);
      refetch();
    } catch (e) {
      Alert.alert("Error", "Failed to delete ride");
    }
  };

  const renderItem = ({ item }: { item: Ride }) => (
    <TouchableOpacity style={styles.card} onPress={() => openRide(item)}>
      <View>
        <Text style={styles.date}>
          {new Date(item.start_time).toLocaleString()}
        </Text>
        <Text style={styles.detail}>
          Distance: {item.distance.toFixed(1)} km
        </Text>
      </View>
      <TouchableOpacity
        onPress={() => {
          Alert.alert("Delete Ride", "This cannot be undone. Delete?", [
            { text: "Cancel", style: "cancel" },
            {
              text: "Delete",
              style: "destructive",
              onPress: async () => {
                await deleteRide(item.id);
                refetch();
              },
            },
          ]);
        }}
      >
        <Text style={styles.delete}>Delete</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  if (isLoading) return <ActivityIndicator style={{ flex: 1 }} />;

  if (!rides || (rides && rides.length === 0)) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.empty}>
          No rides yet. Get on the road to create your first ride!
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.filterBar}>
        <TouchableOpacity onPress={() => setFilters({ filterType: "all" })}>
          <Text
            style={
              filters.filterType === "all" ? styles.filterActive : styles.filter
            }
          >
            All
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() =>
            setFilters({
              filterType: "month",
              month: new Date().toISOString().slice(0, 7),
            })
          }
        >
          <Text
            style={
              filters.filterType === "month"
                ? styles.filterActive
                : styles.filter
            }
          >
            This Month
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() =>
            setFilters({
              filterType: "year",
              year: new Date().getFullYear().toString(),
            })
          }
        >
          <Text
            style={
              filters.filterType === "year"
                ? styles.filterActive
                : styles.filter
            }
          >
            This Year
          </Text>
        </TouchableOpacity>
        {!loadingBikes && (
          <TouchableOpacity
            onPress={() =>
              setFilters({ filterType: "bike", bikeId: bikes[0]?.id })
            }
          >
            <Text
              style={
                filters.filterType === "bike"
                  ? styles.filterActive
                  : styles.filter
              }
            >
              Bike
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={rides || []}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
      />

      <RideDetailModal
        visible={modalVisible}
        ride={selectedRide}
        onClose={() => setModalVisible(false)}
        onDelete={handleDelete}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    marginBottom: 8,
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  date: { fontWeight: "bold" },
  detail: { color: "#666" },
  delete: { color: "red" },
  emptyContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  empty: { color: "#666" },
  filterBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 8,
  },
  filter: { color: "#666" },
  filterActive: { color: "#116682", fontWeight: "bold" },
});
