import React, { useEffect, useState, useRef } from "react";
import "./Weather.css";

const Weather = () => {
    const [weatherData, setWeatherData] = useState(false);
  const [forecastData, setForecastData] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("today");
  const inputRef = useRef(null);

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);

  const getWeatherData = async (city) => {
    if (city == "") {
      setWeatherData(false);
      alert("Please enter a city name");
      return;
    }

    setLoading(true);
    try {
      const url = `https://api.weatherapi.com/v1/forecast.json?key=${
        import.meta.env.VITE_APP_ID
      }&q=${city}&days=7`;
      const response = await fetch(url);
      const data = await response.json();

      if (data.error) {
        setError(data.error.message);
        setWeatherData(false);
        setForecastData([]);
      } else {
        setWeatherData({
          humidity: data.current.humidity,
          wind: data.current.wind_kph,
          location: data.location.name,
          country: data.location.country,
          condition: data.current.condition.text,
          condition_icon: data.current.condition.icon,
          temperature: data.current.temp_c,
          feels_like: data.current.feelslike_c,
          uv: data.current.uv,
          pressure: data.current.pressure_mb,
          visibility: data.current.vis_km,
          sunrise: data.forecast.forecastday[0].astro.sunrise,
          sunset: data.forecast.forecastday[0].astro.sunset,
          local_time: data.location.localtime,
        });

        setForecastData(data.forecast.forecastday);
        setError(null);
      }
    } catch (error) {
      console.log(error);
      setError("Failed to fetch weather data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getWeatherData("Dhaka");
  }, []);

  // Format time to 12-hour format with AM/PM
  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  // Format date to day of week and date
  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric'
    });
  };

  // Get animation class based on weather condition
  const getAnimationClass = (condition) => {
    condition = condition.toLowerCase();
    
    if (condition.includes('sunny') || condition.includes('clear')) {
      return 'animate-sun';
    } else if (condition.includes('cloud')) {
      return 'animate-cloud';
    } else if (condition.includes('rain') || condition.includes('drizzle')) {
      return 'animate-rain';
    } else if (condition.includes('snow') || condition.includes('sleet')) {
      return 'animate-snow';
    } else if (condition.includes('wind')) {
      return 'animate-wind';
    } else if (condition.includes('thunder') || condition.includes('storm')) {
      return 'animate-storm';
    }
    
    return '';
  };

  return (
    <div className="min-w-screen min-h-screen bg-gradient-to-br from-blue-700 via-gray-400 to-blue-700 flex items-center justify-center p-4 font-sans">
      {/* Add CSS animations */}
      

      {/* Main Container */}
      <div className="w-full max-w-4xl bg-white/5 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/10">
        
        {/* Header with Time and Search */}
        <div className="p-6 bg-gradient-to-r from-blue-800/30 to-indigo-800/30 border-b border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="text-white">
              <h2 className="text-3xl font-light">{formatTime(currentTime)}</h2>
              <p className="text-white/80 text-sm">{formatDate(currentTime)}</p>
            </div>
            
            <div className="flex items-center gap-3 w-full md:w-auto">
              <input
                ref={inputRef}
                className="flex-1 bg-white/15 text-white px-4 py-3 rounded-xl shadow-sm outline-none placeholder:text-white/70 border border-white/20 focus:border-white/50 transition-all"
                type="text"
                placeholder="Search city..."
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    getWeatherData(inputRef.current.value);
                  }
                }}
              />
              <button
                className="w-12 h-12 bg-white/15 rounded-xl flex items-center justify-center shadow cursor-pointer hover:bg-white/25 transition-all"
                onClick={() => {
                  getWeatherData(inputRef.current.value);
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="p-10 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
          </div>
        ) : error ? (
          <div className="p-8 text-center text-white/80">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="mt-4 text-lg">{error}</p>
          </div>
        ) : weatherData ? (
          <>
            {/* Current Weather Section */}
            <div className="p-8">
              <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                <div className="text-center md:text-left">
                  <h1 className="text-5xl font-light text-white">{weatherData.location}, {weatherData.country}</h1>
                  <p className="text-white/80 mt-2">{weatherData.condition}</p>
                </div>
                
                <div className="text-center">
                  <div className="flex items-center justify-center">
                    <div className={`relative ${getAnimationClass(weatherData.condition)}`}>
                      <img
                        src={weatherData.condition_icon}
                        alt="Condition"
                        className="w-28 h-28"
                      />
                    </div>
                    <span className="text-7xl font-light text-white">{Math.round(weatherData.temperature)}°</span>
                  </div>
                  <p className="text-white/80 mt-2">Feels like {Math.round(weatherData.feels_like)}°</p>
                </div>
              </div>
            </div>

            {/* Weather Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-white/5 border-y border-white/10">
              <div className="bg-white/5 rounded-xl p-4 text-center backdrop-blur-sm border border-white/10">
                <div className="animate-pulse">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mx-auto text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                  </svg>
                </div>
                <p className="text-white/80 mt-2">Humidity</p>
                <p className="text-xl font-semibold text-white">{weatherData.humidity}%</p>
              </div>
              
              <div className="bg-white/5 rounded-xl p-4 text-center backdrop-blur-sm border border-white/10">
                <div className="animate-wind">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mx-auto text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <p className="text-white/80 mt-2">Wind Speed</p>
                <p className="text-xl font-semibold text-white">{weatherData.wind} km/h</p>
              </div>
              
              <div className="bg-white/5 rounded-xl p-4 text-center backdrop-blur-sm border border-white/10">
                <div className="animate-pulse">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mx-auto text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <p className="text-white/80 mt-2">UV Index</p>
                <p className="text-xl font-semibold text-white">{weatherData.uv}</p>
              </div>
              
              <div className="bg-white/5 rounded-xl p-4 text-center backdrop-blur-sm border border-white/10">
                <div className="animate-pulse">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mx-auto text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <p className="text-white/80 mt-2">Pressure</p>
                <p className="text-xl font-semibold text-white">{weatherData.pressure} hPa</p>
              </div>
            </div>

            {/* Forecast Tabs */}
            <div className="p-6">
              <div className="flex border-b border-white/10">
                <button
                  className={`px-4 py-2 font-medium text-sm ${activeTab === "today" ? "text-white border-b-2 border-white" : "text-white/60"}`}
                  onClick={() => setActiveTab("today")}
                >
                  Today
                </button>
                <button
                  className={`px-4 py-2 font-medium text-sm ${activeTab === "week" ? "text-white border-b-2 border-white" : "text-white/60"}`}
                  onClick={() => setActiveTab("week")}
                >
                  7-Day Forecast
                </button>
              </div>

              {activeTab === "today" ? (
                <div className="mt-6">
                  <h3 className="text-xl font-medium text-white mb-4">Today's Overview</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white/5 rounded-xl p-5 backdrop-blur-sm border border-white/10">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="animate-pulse">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                          </svg>
                        </div>
                        <h4 className="text-white font-medium">Sunrise & Sunset</h4>
                      </div>
                      <div className="flex justify-between">
                        <div>
                          <p className="text-white/70">Sunrise</p>
                          <p className="text-white font-medium">{weatherData.sunrise}</p>
                        </div>
                        <div>
                          <p className="text-white/70">Sunset</p>
                          <p className="text-white font-medium">{weatherData.sunset}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-white/5 rounded-xl p-5 backdrop-blur-sm border border-white/10">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="animate-pulse">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                          </svg>
                        </div>
                        <h4 className="text-white font-medium">Precipitation</h4>
                      </div>
                      <div className="flex justify-between">
                        <div>
                          <p className="text-white/70">Chance of Rain</p>
                          <p className="text-white font-medium">10%</p>
                        </div>
                        <div>
                          <p className="text-white/70">Visibility</p>
                          <p className="text-white font-medium">{weatherData.visibility} km</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mt-6">
                  <h3 className="text-xl font-medium text-white mb-4">7-Day Forecast</h3>
                  <div className="grid grid-cols-2 md:grid-cols-7 gap-3">
                    {forecastData.map((day, index) => (
                      <div
                        key={index}
                        className="bg-white/5 rounded-xl p-4 text-center backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all"
                      >
                        <p className="text-white font-medium">
                          {new Date(day.date).toLocaleDateString("en-US", {
                            weekday: "short",
                          })}
                        </p>
                        <div className={`relative ${getAnimationClass(day.day.condition.text)}`}>
                          <img
                            src={day.day.condition.icon}
                            alt={day.day.condition.text}
                            className="w-12 h-12 mx-auto my-2"
                          />
                        </div>
                        <p className="text-xs text-white/70 mb-1">
                          {day.day.condition.text}
                        </p>
                        <div className="flex justify-center gap-2">
                          <span className="text-white font-medium">
                            {Math.round(day.day.maxtemp_c)}°
                          </span>
                          <span className="text-white/60">
                            {Math.round(day.day.mintemp_c)}°
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="p-8 text-center text-white/80">
            <p>Search for a city to see weather information</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Weather;