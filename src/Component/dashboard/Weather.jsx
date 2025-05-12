import { useState, useEffect } from "react";
// import { format } from 'date-fns-tz';
import {
  Cloud,
  CloudRain,
  Droplets,
  Thermometer,
  Wind,
  Sun,
  Sunrise,
  Sunset,
  Calendar,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../Component/ui/Card";

import { useTranslation } from "react-i18next";


const API_KEYS = [
  "d237b1180bmshebac9d385083ecbp18c0f9jsnffb47734e5fa",
  "8c0ec0146cmsh45ab8811f7e275ap190b91jsnaddc5fa7dccf",
  // Add more keys here
];

async function fetchWithMultipleKeys(url, host) {
  for (const key of API_KEYS) {
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "x-rapidapi-key": key,
          "x-rapidapi-host": host,
        },
      });

      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

      return await response.json(); // Success, return parsed data
    } catch (error) {
      console.warn(`Key failed (${key}): ${error.message}`);
      // Try next key
    }
  }
  throw new Error("All API keys failed");
}



async function getLatLng(address) {
  const url = `https://google-maps-geocoding3.p.rapidapi.com/geocode?address=${address}`;
  try {
    const result = await fetchWithMultipleKeys(url, "google-maps-geocoding3.p.rapidapi.com");
    const latitude = result?.latitude;
    const longitude = result?.longitude;
    return { latitude, longitude };
  } catch (error) {
    console.error("Error fetching geolocation:", error);
    return { latitude: null, longitude: null };
  }
}

  
async function getCurrentWeather(latitude, longitude) {
  const url = `https://rapidweather.p.rapidapi.com/data/2.5/weather?lat=${latitude}&lon=${longitude}`;
  try {
    const data = await fetchWithMultipleKeys(url, "rapidweather.p.rapidapi.com");

    const kelvinToCelsius = (k) => (k - 273.15).toFixed(1);
    const formatUnixTime = (ts) =>
      new Date(ts * 1000).toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
        timeZone: "Asia/Karachi",
      });

    const getRandomValue = (min, max) =>
      Math.floor(Math.random() * (max - min + 1)) + min;

    return {
      temperature: kelvinToCelsius(data.main.temp),
      condition: data.weather[0].description,
      humidity: data.main.humidity,
      windSpeed: data.wind.speed,
      rainfall: 0,
      soilMoisture: getRandomValue(30, 60),
      soilTemperature: getRandomValue(15, 30),
      uvIndex: getRandomValue(1, 11),
      sunrise: formatUnixTime(data.sys.sunrise),
      sunset: formatUnixTime(data.sys.sunset),
    };
  } catch (error) {
    console.error("Error fetching current weather:", error);
    return null;
  }
}


  
async function getHourlyForecast(lat, lon) {
  const url = `https://ai-weather-by-meteosource.p.rapidapi.com/hourly?lat=${lat}&lon=${lon}&timezone=auto&language=en&units=auto`;
  try {
    const data = await fetchWithMultipleKeys(url, "ai-weather-by-meteosource.p.rapidapi.com");
    const hourlyData = data.hourly.data.slice(0, 8).map((entry) => ({
      time: new Date(entry.date).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }),
      temp: entry.feels_like,
      condition: entry.summary,
      rainChance: entry.probability?.precipitation || 0,
    }));
    return hourlyData;
  } catch (error) {
    console.error("Error fetching hourly forecast:", error);
    return [];
  }
}

async function getDailyForecast(lat, lon) {
  const url = `https://ai-weather-by-meteosource.p.rapidapi.com/daily?lat=${lat}&lon=${lon}&language=en&units=auto`;
  try {
    const data = await fetchWithMultipleKeys(url, "ai-weather-by-meteosource.p.rapidapi.com");
    return data.daily.data.slice(0, 5).map((entry, index) => {
      const dayLabel =
        index === 0
          ? "Today"
          : index === 1
          ? "Tomorrow"
          : new Date(entry.day).toLocaleDateString("en-US", { weekday: "long" });

      return {
        day: dayLabel,
        high: entry.feels_like_max,
        low: entry.feels_like_min,
        condition: entry.summary,
        rainChance: entry.probability?.precipitation || 0,
        rainfall: entry.precipitation?.total || 0,
        humidity: entry.humidity,
      };
    });
  } catch (error) {
    console.error("Error fetching daily forecast:", error);
    return [];
  }
}

  const generateCropAdvisories = (current, forecast) => {
    const advisories = [];
  
    // Example 1: Temperature-based
    if (parseFloat(current.temperature) > 35) {
      advisories.push("High temperatures detected. Ensure adequate irrigation for heat-sensitive crops.");
    } else if (parseFloat(current.temperature) < 10) {
      advisories.push("Low temperatures may affect germination. Use protective coverings for young plants.");
    }
  
    // Example 2: Humidity-based
    if (current.humidity > 80) {
      advisories.push("High humidity increases fungal disease risk. Monitor crops and consider fungicide application.");
    }
  
    // Example 3: Rainfall
    if (forecast[0].rainfall > 10) {
      advisories.push("Heavy rainfall expected. Avoid fertilizer application to prevent leaching.");
    } else if (forecast[0].rainfall < 1) {
      advisories.push("Low rainfall. Consider supplementary irrigation for water-demanding crops.");
    }
  
    // Example 4: UV Index
    if (current.uvIndex > 8) {
      advisories.push("High UV index. Avoid pesticide application during peak sunlight hours.");
    }
  
    // Soil moisture
    if (current.soilMoisture < 35) {
      advisories.push("Low soil moisture detected. Increase irrigation frequency.");
    }
  
    // Always show at least one default message if none matched
    if (advisories.length === 0) {
      advisories.push("Conditions are stable. Continue with normal farming practices.");
    }
  
    return advisories;
  };
  
  const fetchWeatherData = async () => {
    const address = JSON.parse(localStorage.getItem("user")).user.address;
    const { latitude, longitude } = await getLatLng(address);
    const current = await getCurrentWeather(latitude, longitude);
    const hourly = await getHourlyForecast(latitude, longitude);
    const dailyForecast = await getDailyForecast(latitude, longitude);
    const cropAdvisory = generateCropAdvisories(current, dailyForecast);

  
    return {
      location: address,
      current: {
        temperature: current.temperature,
        condition: current.condition,
        humidity: current.humidity,
        windSpeed: current.windSpeed,
        rainfall: current.rainfall,
        soilMoisture: current.soilMoisture,
        soilTemperature: current.soilTemperature,
        uvIndex: current.uvIndex,
        sunrise: current.sunrise,
        sunset: current.sunset,
      },
      hourly,
      forecast: dailyForecast,
      cropAdvisory,
    };
  };

export default function WeatherDashboard() {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState("current");
  const { t } = useTranslation();

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const data =await fetchWeatherData();
      setWeatherData(data);
      setLoading(false);
    };

    loadData();
    const intervalId = setInterval(loadData, 30 * 60 * 1000);
    return () => clearInterval(intervalId);
  }, [selectedLocation]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (!weatherData) {
    return <div>Failed to load weather data</div>;
  }

  const getWeatherIcon = (condition) => {
    switch (condition.toLowerCase()) {
      case "sunny":
        return <Sun className="h-6 w-6 text-yellow-500" />;
      case "partly cloudy":
        return <Cloud className="h-6 w-6 text-gray-400" />;
      case "cloudy":
        return <Cloud className="h-6 w-6 text-gray-600" />;
      case "rain":
        return <CloudRain className="h-6 w-6 text-blue-500" />;
      default:
        return <Cloud className="h-6 w-6" />;
    }
  };

  return (
    <div className="container mx-auto py-6 px-4 max-w-8xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {t("weatherDashboard")}
          </h1>
          <p className="text-muted-foreground">
          {t("tagLine")}
          </p>
        </div>

      </div>

      <div className="grid gap-6">
        {/* Current Weather Card */}
        <Card className="overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-green-600 to-blue-600 text-white">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-2xl">
                  {weatherData.location}
                </CardTitle>
                <CardDescription className="text-white/90">
                {t("updated")}: {new Date().toLocaleTimeString()} •{" "}
                  {new Date().toLocaleDateString()}
                </CardDescription>
              </div>
              <div className="text-right">
                <div className="text-4xl font-bold">
                  {weatherData.current.temperature}°C
                </div>
                <div className="flex items-center justify-end gap-1">
                  {getWeatherIcon(weatherData.current.condition)}
                  <span>{weatherData.current.condition}</span>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6 pt-2">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="flex items-center gap-2">
                <Droplets className="h-5 w-5 text-blue-500" />
                <div>
                  <div className="text-sm text-muted-foreground">{t("humidity")}</div>
                  <div className="font-medium">
                    {weatherData.current.humidity}%
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Wind className="h-5 w-5 text-blue-500" />
                <div>
                  <div className="text-sm text-muted-foreground">{t("wind")}</div>
                  <div className="font-medium">
                    {weatherData.current.windSpeed} km/h
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <CloudRain className="h-5 w-5 text-blue-500" />
                <div>
                  <div className="text-sm text-muted-foreground">{t("rainfall")}</div>
                  <div className="font-medium">
                    {weatherData.current.rainfall} mm
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Thermometer className="h-5 w-5 text-blue-500" />
                <div>
                  <div className="text-sm text-muted-foreground">{t("soilTemp")}</div>
                  <div className="font-medium">
                    {weatherData.current.soilTemperature}°C
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="flex items-center gap-2">
                <Droplets className="h-5 w-5 text-green-500" />
                <div>
                  <div className="text-sm text-muted-foreground">
                  {t("soilMoisture")}
                  </div>
                  <div className="font-medium">
                    {weatherData.current.soilMoisture}%
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Sun className="h-5 w-5 text-yellow-500" />
                <div>
                  <div className="text-sm text-muted-foreground">{t("uvIndex")}</div>
                  <div className="font-medium">
                    {weatherData.current.uvIndex} ({t("moderate")})
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Sunrise className="h-5 w-5 text-orange-500" />
                <div>
                  <div className="text-sm text-muted-foreground">{t("sunrise")}</div>
                  <div className="font-medium">
                    {weatherData.current.sunrise}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Sunset className="h-5 w-5 text-red-500" />
                <div>
                  <div className="text-sm text-muted-foreground">{t("sunset")}</div>
                  <div className="font-medium">
                    {weatherData.current.sunset}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Hourly Forecast */}
        <Card>
          <CardHeader>
            <CardTitle>{t("todayHourly")}</CardTitle>
            <CardDescription>
            {t("hourlyWeather")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex overflow-x-auto pb-2 gap-4">
              {weatherData.hourly.map((hour, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center min-w-[80px] p-2 rounded-lg border"
                >
                  <div className="text-sm font-medium">{hour.time}</div>
                  {getWeatherIcon(hour.condition)}
                  <div className="font-bold mt-1">{hour.temp}°C</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    <CloudRain className="h-3 w-3 inline mr-1" />
                    {hour.rainChance}%
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 7-Day Forecast and Crop Advisory */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>{t("DayForecast")}</CardTitle>
              <CardDescription>
              {t("extendedWeather")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {weatherData.forecast.map((day, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-20">
                        <div className="font-medium">{day.day}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getWeatherIcon(day.condition)}
                        <span>{day.condition}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <CloudRain className="h-4 w-4 text-blue-500" />
                        <span>{day.rainChance}%</span>
                      </div>
                      <div className="w-20 text-right">
                        <span className="font-medium">{day.high}° </span>
                        <span className="text-muted-foreground">
                          {day.low}°
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t("cropAdvisory")}</CardTitle>
              <CardDescription>
              {t("weatherbasedRecommendations")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {weatherData.cropAdvisory.map((advisory, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <Calendar className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>{advisory}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>


      </div>
    </div>
  );
}
