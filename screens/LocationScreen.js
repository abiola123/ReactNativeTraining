import React, { useState } from "react";
import {
  Text,
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import * as Location from "expo-location";
import AsyncStorage from "@react-native-async-storage/async-storage";

import Constants from "expo-constants";
const { googleMapApiKey } = Constants.manifest.extra;

const LocationScreen = ({ navigation }) => {
  const [location, setLocation] = useState(null);
  const [humanReadableLocation, setHumanReadableLocation] = useState(null);

  const getCurrentLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== "granted") {
      console.log("Permission for location was denied");
      return;
    }

    const loc = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Highest,
      maximumAge: 10000,
    });

    const latitude = loc.coords.latitude;
    const longitude = loc.coords.longitude;

    const geocoded_response = await Location.reverseGeocodeAsync({
      latitude: latitude,
      longitude: longitude,
    });

    if (geocoded_response.length > 0) {
      const humanReadableLocation = `${geocoded_response[0].city}, ${geocoded_response[0].region}, ${geocoded_response[0].country}`;

      setHumanReadableLocation(humanReadableLocation);

      setLocation({
        latitude: latitude,
        longitude: longitude,
      });
    }
  };

  const handleDoneButton = async () => {
    if (humanReadableLocation) {
      const locationObject = {
        latitude: location.latitude,
        longitude: location.longitude,
        humanReadableLocation: humanReadableLocation,
      };

      const previousElements = await AsyncStorage.getItem("locations");

      const newElements = previousElements ? JSON.parse(previousElements) : [];

      newElements.push(locationObject);

      await AsyncStorage.setItem("locations", JSON.stringify(newElements));

      navigation.navigate("LocationsList");

      const after = await AsyncStorage.getItem("locations");
    }
  };

  return (
    <View style={styles.container}>
      <Text
        style={{
          fontSize: 18,
          marginBottom: 10,
          textAlign: "center",
        }}
      >
        Choose a new location for the weather prediction:
      </Text>

      <ScrollView keyboardShouldPersistTaps={"always"}>
        <GooglePlacesAutocomplete
          placeholder="Search"
          styles={{
            textInputContainer: {
              width: "98%",
              marginLeft: "1%",
            },
            textInput: {
              width: "98%",
              borderWidth: 1,
              borderRadius: 8,
              borderColor: "#4285F4",
            },
          }}
          query={{
            key: googleMapApiKey,
            language: "en",
          }}
          fetchDetails={true}
          onPress={(data, details) => {
            const loc = details.geometry.location;
            const readable = data.description;

            setLocation({ latitude: loc.lat, longitude: loc.lng });
            setHumanReadableLocation(readable);
          }}
        />
      </ScrollView>

      {humanReadableLocation && (
        <Text style={styles.selectedLocation}>
          Selected location: {humanReadableLocation}
        </Text>
      )}

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={getCurrentLocation}>
          <Text style={styles.buttonText}>Use Current Location</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleDoneButton}>
          <Text style={styles.buttonText}>Done</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: Constants.statusBarHeight + 10,
    flex: 1,
  },

  selectedLocation: {
    fontSize: 16,
    backgroundColor: "#F5F5F5",
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },

  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    marginBottom: 10,
  },

  button: {
    backgroundColor: "#4285F4",
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginHorizontal: 5,
  },

  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default LocationScreen;
