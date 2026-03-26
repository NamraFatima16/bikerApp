import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import MapScreen from '../screens/main/MapScreen';
import PlannerScreen from '../screens/main/PlannerScreen';
import EmergencyScreen from '../screens/main/EmergencyScreen';
import ProfileScreen from '../screens/main/ProfileScreen';
import GarageScreen from '../screens/main/GarageScreen';
import SettingsScreen from '../screens/main/SettingsScreen';
import HistoryScreen from '../screens/main/HistoryScreen';


const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

function BottomTabs(){
    return (
        <Tab.Navigator>
            <Tab.Screen name='Map' component={MapScreen} />
            <Tab.Screen name='Planner' component={PlannerScreen}/>
            <Tab.Screen name='Emergency' component={EmergencyScreen}/>
        </Tab.Navigator>
    );
    
}
    
export default function AppNavigator(){
        return (
            <Drawer.Navigator>
            <Drawer.Screen name='Home' component={BottomTabs} />
            <Drawer.Screen name='Profile' component={ProfileScreen} />
            <Drawer.Screen name="Garage" component={GarageScreen} />
            <Drawer.Screen name="Settings" component={SettingsScreen} />
            <Drawer.Screen name="History" component={HistoryScreen} />
            </Drawer.Navigator>
        );
}


