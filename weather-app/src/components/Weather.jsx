import React, { useEffect, useRef, useState } from 'react'
import './Weather.css'
import search_icon from '../assets/search.png'
import clear_icon from '../assets/clear.png'
import clouds_icon from '../assets/clouds.png'
import drizzle_icon from '../assets/drizzle.png'
import rain_icon from '../assets/rain.png'
import snow_icon from '../assets/snow.png'
import wind_icon from '../assets/wind.png'
import humidity_icon from '../assets/humidity.png'



const Weather = () => {

  const inputRef = useRef()
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);
  const [loading, setLoading] = useState(false);

  const allIcons = {
    "01d":clear_icon,
    "01n":clear_icon,
    "02d": clouds_icon,
    "02n": clouds_icon,
    "03d": clouds_icon,
    "03n": clouds_icon,
    "04d":drizzle_icon,
    "04n":drizzle_icon,
    "09d":rain_icon,
    "09n":rain_icon,
    "10d":rain_icon,
    "10n":rain_icon,
    "13d":snow_icon,
    "13n":snow_icon,
  }

  const cardColors = [
    'linear-gradient(135deg, #4a90e2 0%, #357abd 100%)',
    'linear-gradient(135deg, #a855f7 0%, #7c3aed 100%)',
    'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
    'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
  ];

  const fetchWeatherData = async (city) => {
    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${import.meta.env.VITE_APP_ID}`;
      const response = await fetch(url);
      const data = await response.json();

      if(!response.ok){
        alert(data.message);
        return null;
      }

      const icon = allIcons[data.weather[0].icon] || clear_icon;
      return {
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
        windDeg: data.wind.deg,
        temperature: Math.floor(data.main.temp),
        tempMin: Math.floor(data.main.temp_min),
        tempMax: Math.floor(data.main.temp_max),
        location: data.name,
        country: data.sys.country,
        icon: icon,
        description: data.weather[0].description,
        pressure: data.main.pressure,
        visibility: (data.visibility / 1000).toFixed(1),
        sunrise: new Date(data.sys.sunrise * 1000).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
        sunset: new Date(data.sys.sunset * 1000).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
        date: new Date().toLocaleString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true, month: 'short', day: 'numeric' })
      };
    } catch (error) {
      console.error("Error in fetching weather data");
      return null;
    }
  }

  const addCity = async () => {
    const cityName = inputRef.current.value.trim();
    if(cityName === ""){
      alert("Enter City Name");
      return;
    }

    // Check if city already exists
    if(cities.some(city => city.location.toLowerCase() === cityName.toLowerCase())){
      alert("City already added!");
      inputRef.current.value = "";
      return;
    }

    setLoading(true);
    const weatherData = await fetchWeatherData(cityName);
    setLoading(false);

    if(weatherData){
      setCities([...cities, weatherData]);
      inputRef.current.value = "";
    }
  }

  const removeCity = (cityName) => {
    setCities(cities.filter(city => city.location !== cityName));
    if(selectedCity?.location === cityName){
      setSelectedCity(null);
    }
  }

  const viewCityDetails = (city) => {
    setSelectedCity(city);
  }

  const backToDashboard = () => {
    setSelectedCity(null);
  }

  useEffect(() => {
    // Load default cities
    const defaultCities = ["Colombo", "Tokyo", "Liverpool", "Sydney", "Boston"];
    const loadCities = async () => {
      const citiesData = [];
      for(let city of defaultCities){
        const data = await fetchWeatherData(city);
        if(data) citiesData.push(data);
      }
      setCities(citiesData);
    }
    loadCities();
  },[])


  return (
    <div className='weather'>
      <div className="header">
        <img src={clouds_icon} alt="" className='header-icon'/>
        <h1>Weather App</h1>
      </div>

      {selectedCity ? (
        // Detail View
        <div className='weather-card'>
          <div className="top-section">
            <button className='back-btn' onClick={backToDashboard}>←</button>
            <div className='main-weather'>
              <h2 className='location'>{selectedCity.location}, {selectedCity.country}</h2>
              <p className='date'>{selectedCity.date}</p>
              
              <div className='weather-main-info'>
                <div className='weather-icon-desc'>
                  <img src={selectedCity.icon} alt="" className='weather-icon'/>
                  <p className='description'>{selectedCity.description.charAt(0).toUpperCase() + selectedCity.description.slice(1)}</p>
                </div>
                <div className='temp-info'>
                  <p className='temperature'>{selectedCity.temperature}°c</p>
                  <div className='temp-range'>
                    <p>Temp Min: {selectedCity.tempMin}°c</p>
                    <p>Temp Max: {selectedCity.tempMax}°c</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className='bottom-section'>
            <div className='weather-details'>
              <div className='detail-item'>
                <p className='detail-label'>Pressure:</p>
                <p className='detail-value'>{selectedCity.pressure}hPa</p>
              </div>
              <div className='detail-item'>
                <p className='detail-label'>Humidity:</p>
                <p className='detail-value'>{selectedCity.humidity}%</p>
              </div>
              <div className='detail-item'>
                <p className='detail-label'>Visibility:</p>
                <p className='detail-value'>{selectedCity.visibility}km</p>
              </div>
            </div>

            <div className='weather-details center'>
              <div className='detail-item wind'>
                <svg className='wind-icon' viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L15 8L12 14L9 8L12 2Z" fill="currentColor"/>
                </svg>
                <p className='detail-value'>{selectedCity.windSpeed}m/s {selectedCity.windDeg} Degree</p>
              </div>
            </div>

            <div className='weather-details'>
              <div className='detail-item'>
                <p className='detail-label'>Sunrise:</p>
                <p className='detail-value'>{selectedCity.sunrise}</p>
              </div>
              <div className='detail-item'>
                <p className='detail-label'>Sunset:</p>
                <p className='detail-value'>{selectedCity.sunset}</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        // Dashboard View
        <>
          <div className='search-container'>
            <input 
              type="text" 
              placeholder='Enter a city' 
              ref={inputRef}
              onKeyPress={(e) => e.key === 'Enter' && addCity()}
            />
            <button onClick={addCity} disabled={loading}>
              {loading ? 'Loading...' : 'Add City'}
            </button>
          </div>

          <div className='dashboard-grid'>
            {cities.map((city, index) => (
              <div 
                key={city.location} 
                className='city-card'
                style={{ background: cardColors[index % cardColors.length] }}
              >
                <button className='close-btn' onClick={() => removeCity(city.location)}>×</button>
                <div className='city-card-top' onClick={() => viewCityDetails(city)}>
                  <div className='city-header'>
                    <h3>{city.location}, {city.country}</h3>
                    <p className='city-date'>{city.date}</p>
                  </div>
                  <div className='city-temp-section'>
                    <div className='city-weather-desc'>
                      <img src={city.icon} alt="" className='city-icon'/>
                      <p>{city.description.charAt(0).toUpperCase() + city.description.slice(1)}</p>
                    </div>
                    <div className='city-temp'>
                      <h2>{city.temperature}°c</h2>
                      <div className='city-temp-range'>
                        <p>Temp Min: {city.tempMin}°c</p>
                        <p>Temp Max: {city.tempMax}°c</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='city-card-bottom'>
                  <div className='city-detail'>
                    <p className='city-detail-label'>Pressure:</p>
                    <p className='city-detail-value'>{city.pressure}hPa</p>
                  </div>
                  <div className='city-detail'>
                    <p className='city-detail-label'>Humidity:</p>
                    <p className='city-detail-value'>{city.humidity}%</p>
                  </div>
                  <div className='city-detail'>
                    <p className='city-detail-label'>Visibility:</p>
                    <p className='city-detail-value'>{city.visibility}km</p>
                  </div>
                  <div className='city-detail center-detail'>
                    <svg className='city-wind-icon' viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2L15 8L12 14L9 8L12 2Z" fill="currentColor"/>
                    </svg>
                    <p className='city-detail-value'>{city.windSpeed}m/s {city.windDeg} Degree</p>
                  </div>
                  <div className='city-detail'>
                    <p className='city-detail-label'>Sunrise:</p>
                    <p className='city-detail-value'>{city.sunrise}</p>
                  </div>
                  <div className='city-detail'>
                    <p className='city-detail-label'>Sunset:</p>
                    <p className='city-detail-value'>{city.sunset}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
      
      <footer className='footer'>2021 Fidenz Technologies</footer>
    </div>
  )
}

export default Weather
