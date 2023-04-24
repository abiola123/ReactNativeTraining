import "dotenv/config";

export default {
  expo: {
    extra: {
      weatherApiKey: process.env.WEATHER_API_KEY,
      googleMapApiKey: process.env.GOOGLE_MAPS_KEY,
    },
  },
};
