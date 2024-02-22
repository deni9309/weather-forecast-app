import { useEffect, useState } from 'react';
import axios from 'axios';
//import weatherInfo from './data'; //mock data for dev. and testing
import './weather.css';

const apiKey = import.meta.env.VITE_API_KEY;
const baseUrl = import.meta.env.VITE_BASE_API_URL;

const LocationSearch = ({ locationChange }) => {
   const [location, setLocation] = useState('');

   const handleSubmit = (e) => {    //we have to notify the 'weather' component that the form's been submitted
      e.preventDefault();

      locationChange(location);     //so using this function that we have as a prop, we pass the new 'location' value to the 'weather' component
      setLocation('');    //then reset location's value to initial (to clear form input)
   };

   return (
      <form className="location-search" onSubmit={handleSubmit}>
         <input type="text"
            value={location}
            onChange={(event) => setLocation(event.target.value)}
            placeholder="City, Country"
            className="location-search-input"
         />
      </form>
   );
}

const WeatherInfo = ({ weatherInfo }) => {
   console.log(weatherInfo);
   const celsiusTemperature = Math.floor(weatherInfo.main.temp - 273);
   const celsiusFeelsLikeTemperature = Math.floor(weatherInfo.main.feels_like - 273);

   return (
      <div className='weather-info'>
         <img src={`${weatherInfo.weather[0].icon}.png`}
            className='weather-info-image'
         />
         <div className='weather-info-temp'>{celsiusTemperature} &#8451;</div>
         <div className='weather-info-name'>{weatherInfo.name}</div>

         <div className='weather-info-details'>
            <div className='weather-info-detail'>
               <b>Feels like:</b> {celsiusFeelsLikeTemperature} &#8451;
            </div>
            <div className='weather-info-detail'>
               <b>Humidity:</b> {weatherInfo.main.humidity} %
            </div>
            <div className='weather-info-detail'>
               <b>Wind speed:</b> {weatherInfo.wind.speed} km/h
            </div>
            <div className='weather-info-detail'>
               <b>Pressure:</b> {weatherInfo.main.pressure} hPa
            </div>
         </div>
      </div>
   );
};

const Weather = () => {
   const [location, setLocation] = useState(null);
   const [weatherInfo, setWeatherInfo] = useState(null);

   useEffect(() => {
      if (!location) return;

      const url = `${baseUrl}?q=${location}&appid=${apiKey}`;

      axios.get(url).then(response => {
         setWeatherInfo(response.data);
      })
         .catch(res => {
            setLocation(null);
            setWeatherInfo(null);
         });
   }, [location]);

   return (
      <div className='weather-block'>
         <LocationSearch locationChange={(location) => setLocation(location)} />
         
         {weatherInfo &&
            <WeatherInfo weatherInfo={weatherInfo} />
         }
      </div>
   );
}

export default Weather;
