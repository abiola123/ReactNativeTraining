import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
} from "react-native";

import { Ionicons } from "react-native-vector-icons";

import Constants from "expo-constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
const { weatherApiKey } = Constants.manifest.extra;

import { useNavigation } from "@react-navigation/native";

const LocationsListScreen = ({ navigation }) => {
  const [locations, setLocations] = useState([]);

  // const navigation = useNavigation()

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      fetchLocations();
    });

    return unsubscribe;
  }, []);

  async function fetchLocations() {
    const locs = await AsyncStorage.getItem("locations");

    if (locs && locs.length > 0) {
      setLocations(JSON.parse(locs));

      fetchAllWeather(JSON.parse(locs));
    }
  }

  const fetchAllWeather = async (locationsToFetch) => {
    const updatedLocations = await Promise.all(
      locationsToFetch.map(async (element) => {
        const weatherData = await fetchWeather(element);

        return {
          ...element,
          temperature: weatherData.main.temp,
        };
      })
    );

    setLocations(updatedLocations);
  };

  const fetchWeather = async ({ latitude, longitude }) => {
    const weatherApiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${weatherApiKey}&units=metric`;

    const response = await fetch(weatherApiUrl);
    const data = await response.json();
    return data;
  };
  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() => {
          navigation.navigate("Weather", {
            lat: item.latitude,
            lon: item.longitude,
            name: item.humanReadableLocation,
          });
        }}
      >
        <View style={styles.itemContainer}>
          <Text style={styles.itemText}>{item.humanReadableLocation}</Text>
          {item.temperature && (
            <Text style={styles.itemText}>{item.temperature}° C</Text>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {locations.length == 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyStateText}>
            Looks empty here, click the + button to add a location
          </Text>
        </View>
      ) : (
        <FlatList
          data={locations}
          renderItem={renderItem}
          keyExtractor={(item) =>
            JSON.stringify({ lat: item.latitude, lon: item.longitude })
          }
        />
      )}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => {
          navigation.navigate("Location");
        }}
      >
        <Ionicons name="add" size={32} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ecf0f1",
    marginTop: Constants.statusBarHeight + 10,
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyStateText: {
    fontSize: 18,
    textAlign: "center",
  },
  addButton: {
    backgroundColor: "#3498db",
    position: "absolute",
    right: 20,
    bottom: 20,
    borderRadius: 30,
    height: 60,
    width: 60,
    alignItems: "center",
    justifyContent: "center",
    elevation: 10,
  },

  itemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#c0c0c0",
  },

  itemText: {
    fontSize: 16,
  },
});

export default LocationsListScreen;
