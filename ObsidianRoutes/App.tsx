import { NavigationContainer } from "@react-navigation/native";
import LoginScreen from './screens/auth/LoginScreen';
import SignupScreen from "./screens/auth/SignupScreen";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AppNavigator from './navigation/AppNavigator';

const Stack = createNativeStackNavigator();

export default function App(){
  return(
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen}/>
        <Stack.Screen name="Signup" component={SignupScreen}/>
        <Stack.Screen name="App" component={AppNavigator}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}