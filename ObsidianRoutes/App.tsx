import { NavigationContainer } from "@react-navigation/native";
import LoginScreen from "./screens/auth/LoginScreen";
import SignupScreen from "./screens/auth/SignupScreen";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AppNavigator from "./navigation/AppNavigator";
import * as Sentry from "@sentry/react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import OfflineBanner from "./components/OfflineBanner";

Sentry.init({
  dsn: "https://be4aac2db75666082e782a5361dbfbd4@o4511111990411264.ingest.de.sentry.io/4511113762439248",
  sendDefaultPii: true,
  enableLogs: true,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1,
  integrations: [
    Sentry.mobileReplayIntegration(),
    Sentry.feedbackIntegration(),
  ],
});

const Stack = createNativeStackNavigator();
const queryClient = new QueryClient();

export default Sentry.wrap(function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <NavigationContainer>
        <OfflineBanner />
        <Stack.Navigator
          initialRouteName="Login"
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Signup" component={SignupScreen} />
          <Stack.Screen name="App" component={AppNavigator} />
        </Stack.Navigator>
      </NavigationContainer>
    </QueryClientProvider>
  );
});
