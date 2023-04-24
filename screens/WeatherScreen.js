import React, { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { MaterialCommunityIcons, Ionicons } from "react-native-vector-icons";

import { useState } from "react";

import Constants from "expo-constants";
const { weatherApiKey } = Constants.manifest.extra;

import * as Animatable from "react-native-animatable";

function WeatherScreen({ navigation, route }) {
  // const location = { latitude: 40.7128, longitude: -74.006 };

  const [weatherData, setWeatherData] = useState(null);

  useEffect(() => {
    // const weatherApiKey = "236eed17eb341207b664828244145866";

    // const { latitude, longitude } = location;

    const latitude = route.params.lat;
    const longitude = route.params.lon;

    const weatherApiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${weatherApiKey}&units=metric`; // Added: weather API URL

    fetch(weatherApiUrl)
      .then((response) => response.json())
      .then((dt) => {
        setWeatherData(dt);
      });
  }, []);

  const renderWeatherIcon = () => {
    const description = weatherData.weather[0].main.toLowerCase();

    if (description.includes("cloud")) {
      return (
        <Animatable.View
          style={styles.animationContainer}
          // animation="rotate"
          animation={{
            0: { translateX: -50 },
            0.5: { translateX: 50 },
            1: { translateX: -50 },
          }}
          duration={2000}
          iterationCount="infinite"
        >
          <MaterialCommunityIcons
            name="weather-cloudy"
            size={100}
            color="gray"
          />
        </Animatable.View>
      );
    } else if (description.includes("rain")) {
      return (
        <MaterialCommunityIcons
          name="weather-pouring"
          size={100}
          color="blue"
        />
      );
    } else if (description.includes("clear") || description.includes("sunny")) {
      return (
        <MaterialCommunityIcons name="weather-sunny" size={100} color="blue" />
      );
    } else if (description.includes("mist")) {
      return (
        <MaterialCommunityIcons
          name="weather-cloudy-alert"
          size={100}
          color="blue"
        />
      );
    } else {
      return null;
    }
  };

  if (!weatherData) {
    return <Text>Loading weather data...</Text>;
  } else {
    const weather = weatherData.weather;
    const main = weatherData.main;
    const location = weatherData.name;
    const temperature = main.temp;
    const weatherDescription = weather[0].description;
    const feelsLike = main.feels_like;
    const humidity = 40;
    const temp_min = main.temp_min;
    const temp_max = main.temp_max;
    const wind_speed = weatherData.wind.speed;
    const sunsetTime = new Date(
      (weatherData.sys.sunset + weatherData.sys.timezone) * 1000
    );
    // const location = "New York";

    return (
      <View style={styles.container}>
        {renderWeatherIcon()}

        <Text style={styles.title}>Weather for: {location}</Text>
        <Text style={styles.temperature}>Temperature: {temperature}°C</Text>
        <View>
          <View style={styles.weatherVariationBox}>
            <View style={styles.weatherVariationContainer}>
              <Ionicons name="md-arrow-down" size={32} color="red" />
              <Text>{temp_min}</Text>
            </View>

            <View style={styles.weatherVariationContainer}>
              <Ionicons name="md-arrow-up" size={32} color="green" />
              <Text>{temp_max}</Text>
            </View>
          </View>
        </View>
        <Text style={{ fontWeight: "bold", fontSize: 26 }}>
          Weather Description: {weatherDescription}
        </Text>
        <Text style={styles.weatherDetails}>Feels like: {feelsLike}°C</Text>
        <View style={{ flexDirection: "row" }}>
          <Text style={styles.weatherDetails}>Humidity: {humidity}%</Text>

          <Text style={[styles.weatherDetails, { marginLeft: 10 }]}>
            Wind: {wind_speed} m/s
          </Text>
        </View>

        <Text style={styles.weatherDetails}>
          Sunset: {sunsetTime.toLocaleTimeString()}
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: 15,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },

  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },

  temperature: {
    fontSize: 40,
    marginBottom: 15,
  },

  weatherDetails: {
    fontSize: 20,
    marginTop: 8,
  },

  weatherVariationContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 3,
  },

  weatherVariationBox: {
    flexDirection: "row",
    alignItems: "center",
    alignContent: "center",
  },

  animationContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
});

export default WeatherScreen;
