import WeatherScreen from "./screens/WeatherScreen";
import LocationScreen from "./screens/LocationScreen";
import LocationsListScreen from "./screens/LocationsListScreen";

import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen
          name="LocationsList"
          component={LocationsListScreen}
          options={{ title: "Locations List", headerShown: false }}
        />
        <Stack.Screen
          name="Location"
          component={LocationScreen}
          options={{ title: "Add Location" }}
        />
        <Stack.Screen
          name="Weather"
          component={WeatherScreen}
          options={{ title: "Weather" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
