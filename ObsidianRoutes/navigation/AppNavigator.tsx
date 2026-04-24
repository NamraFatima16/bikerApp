import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { Ionicons } from "@expo/vector-icons";
import MapScreen from "../screens/main/MapScreen";
import PlannerScreen from "../screens/main/PlannerScreen";
import EmergencyScreen from "../screens/main/EmergencyScreen";
import ProfileScreen from "../screens/main/ProfileScreen";
import GarageScreen from "../screens/main/GarageScreen";
import SettingsScreen from "../screens/main/SettingsScreen";
import HistoryScreen from "../screens/main/HistoryScreen";

const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

function BottomTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#0a0a0a",
          borderTopColor: "#222",
        },
        tabBarActiveTintColor: "#cc0000",
        tabBarInactiveTintColor: "#666",
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = "map";

          if (route.name === "Map") {
            iconName = focused ? "navigate" : "navigate-outline";
          } else if (route.name === "Planner") {
            iconName = focused ? "map" : "map-outline";
          } else if (route.name === "Emergency") {
            iconName = focused ? "alert-circle" : "alert-circle-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Map" component={MapScreen} />
      <Tab.Screen name="Planner" component={PlannerScreen} />
      <Tab.Screen name="Emergency" component={EmergencyScreen} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <Drawer.Navigator
      screenOptions={{
        drawerStyle: {
          backgroundColor: "#0a0a0a",
        },
        drawerActiveTintColor: "#cc0000",
        drawerInactiveTintColor: "#ccc",
        headerStyle: {
          backgroundColor: "#0a0a0a",
        },
        headerTintColor: "#fff",
      }}
    >
      <Drawer.Screen
        name="Home"
        component={BottomTabs}
        options={{
          drawerIcon: ({ color }) => (
            <Ionicons name="home-outline" size={22} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          drawerIcon: ({ color }) => (
            <Ionicons name="person-outline" size={22} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Garage"
        component={GarageScreen}
        options={{
          drawerIcon: ({ color }) => (
            <Ionicons name="construct-outline" size={22} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          drawerIcon: ({ color }) => (
            <Ionicons name="settings-outline" size={22} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="History"
        component={HistoryScreen}
        options={{
          drawerIcon: ({ color }) => (
            <Ionicons name="time-outline" size={22} color={color} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
}
