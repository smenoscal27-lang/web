/**
 * DesignHub - Weather Module (weather.js)
 * Manages weather API calls via Open-Meteo (keyless) and geocoding services.
 */

(function () {
  const WeatherModule = {
    // Current state
    currentWeather: null,
    activeTheme: 'neutral',

    // WMO Weather interpretation codes mapping to our themes
    // https://open-meteo.com/en/docs
    wmoCodes: {
      sunny: [0], // Clear sky
      cloudy: [1, 2, 3, 45, 48], // Mainly clear, partly cloudy, overcast, fog
      rainy: [51, 53, 55, 61, 63, 65, 80, 81, 82], // Drizzle, rain, rain showers
      snowy: [56, 57, 66, 67, 71, 73, 75, 77, 85, 86], // Freezing rain, snow fall, snow showers
      stormy: [95, 96, 99] // Thunderstorms
    },

    // Detailed WMO description in Spanish
    wmoDescriptions: {
      0: 'cielo despejado',
      1: 'principalmente despejado',
      2: 'nubosidad parcial',
      3: 'totalmente nublado',
      45: 'niebla',
      48: 'niebla con escarcha',
      51: 'llovizna ligera',
      53: 'llovizna moderada',
      55: 'llovizna intensa',
      56: 'llovizna helada ligera',
      57: 'llovizna helada intensa',
      61: 'lluvia ligera',
      63: 'lluvia moderada',
      65: 'lluvia intensa',
      66: 'lluvia helada ligera',
      67: 'lluvia helada fuerte',
      71: 'nevada ligera',
      73: 'nevada moderada',
      75: 'nevada fuerte',
      77: 'granos de nieve',
      80: 'chubascos de lluvia ligeros',
      81: 'chubascos de lluvia moderados',
      82: 'chubascos de lluvia violentos',
      85: 'chubascos de nieve ligeros',
      86: 'chubascos de nieve fuertes',
      95: 'tormenta eléctrica',
      96: 'tormenta con granizo ligero',
      99: 'tormenta con granizo fuerte'
    },

    /**
     * Determines simplified weather theme based on WMO code
     */
    getThemeByWmoCode(code) {
      for (const [theme, codes] of Object.entries(this.wmoCodes)) {
        if (codes.includes(code)) {
          return theme;
        }
      }
      return 'sunny'; // fallback
    },

    /**
     * Fetches weather data using Open-Meteo API
     * @param {number} lat 
     * @param {number} lon 
     */
    async fetchWeatherByCoords(lat, lon) {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&timezone=auto`;
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Open-Meteo retornó estado: ${response.status}`);
        }
        return await response.json();
      } catch (error) {
        console.error('Error fetching weather from Open-Meteo:', error);
        throw error;
      }
    },

    /**
     * Resolves coordinates by city name using Open-Meteo Geocoding API
     * @param {string} city 
     */
    async fetchCoordsByCity(city) {
      const encodedCity = encodeURIComponent(city);
      const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodedCity}&count=1&language=es&format=json`;
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Geocoding API retornó estado: ${response.status}`);
        }
        const data = await response.json();
        if (!data.results || data.results.length === 0) {
          throw new Error('Ciudad no encontrada');
        }
        return data.results[0]; // Returns { name, latitude, longitude, country }
      } catch (error) {
        console.error('Error resolving city coordinates:', error);
        throw error;
      }
    },

    /**
     * Resolves city name from coordinates using OpenStreetMap Nominatim
     * @param {number} lat 
     * @param {number} lon 
     */
    async reverseGeocode(lat, lon) {
      const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`;
      try {
        const response = await fetch(url, {
          headers: {
            'Accept-Language': 'es'
          }
        });
        if (!response.ok) {
          throw new Error('Nominatim returned error');
        }
        const data = await response.json();
        const address = data.address || {};
        const cityName = address.city || address.town || address.village || address.suburb || address.county || 'Tu Ubicación';
        const countryName = address.country || '';
        return countryName ? `${cityName}, ${countryName}` : cityName;
      } catch (error) {
        console.warn('Reverse geocoding failed or rate-limited. Using generic title.', error);
        return 'Ubicación Geográfica';
      }
    },

    /**
     * Generates realistic mockup data for Demo Mode
     */
    getMockWeather(customType = null) {
      const types = ['sunny', 'cloudy', 'rainy', 'snowy', 'stormy'];
      const activeType = customType || types[Math.floor(Math.random() * types.length)];
      
      const mockTemplates = {
        sunny: {
          name: 'Madrid (Demo)',
          latitude: 40.4168,
          longitude: -3.7038,
          current: { temperature_2m: 28.5, relative_humidity_2m: 35, apparent_temperature: 29.0, weather_code: 0, wind_speed_10m: 8.4 }
        },
        cloudy: {
          name: 'Londres (Demo)',
          latitude: 51.5074,
          longitude: -0.1278,
          current: { temperature_2m: 16.2, relative_humidity_2m: 75, apparent_temperature: 15.5, weather_code: 3, wind_speed_10m: 14.5 }
        },
        rainy: {
          name: 'Ámsterdam (Demo)',
          latitude: 52.3676,
          longitude: 4.9041,
          current: { temperature_2m: 13.0, relative_humidity_2m: 90, apparent_temperature: 12.1, weather_code: 63, wind_speed_10m: 22.1 }
        },
        snowy: {
          name: 'Oslo (Demo)',
          latitude: 59.9139,
          longitude: 10.7522,
          current: { temperature_2m: -2.4, relative_humidity_2m: 82, apparent_temperature: -6.0, weather_code: 73, wind_speed_10m: 11.2 }
        },
        stormy: {
          name: 'Miami (Demo)',
          latitude: 25.7617,
          longitude: -80.1918,
          current: { temperature_2m: 26.8, relative_humidity_2m: 88, apparent_temperature: 30.1, weather_code: 95, wind_speed_10m: 38.6 }
        }
      };

      return mockTemplates[activeType];
    },

    /**
     * Applies weather theme classes to the HTML body
     */
    applyThemeClass(theme) {
      this.activeTheme = theme;
      
      document.body.classList.remove(
        'weather-sunny', 
        'weather-cloudy', 
        'weather-rainy', 
        'weather-snowy', 
        'weather-stormy'
      );
      
      document.body.classList.add(`weather-${theme}`);
      
      const event = new CustomEvent('weatherChanged', { detail: { theme } });
      document.dispatchEvent(event);
    },

    /**
     * Map a weather type to a user-friendly UI Spanish string
     */
    getThemeMoodText(theme) {
      const moods = {
        sunny: 'Tema Soleado — Paleta Cálida Activa',
        cloudy: 'Tema Nublado — Paleta Neutra y Calma Activa',
        rainy: 'Tema Lluvioso — Paleta Azul y Fresca Activa',
        snowy: 'Tema Nieve — Paleta Fría y Nórdica Activa',
        stormy: 'Tema Tormentoso — Paleta Eléctrica y Oscura Activa'
      };
      return moods[theme] || 'Tema Neutro Activo';
    },

    /**
     * Returns appropriate Lucide icon name for weather state
     */
    getWeatherIconName(theme) {
      const icons = {
        sunny: 'sun',
        cloudy: 'cloud',
        rainy: 'cloud-rain',
        snowy: 'snowflake',
        stormy: 'cloud-lightning'
      };
      return icons[theme] || 'cloud-sun';
    },

    /**
     * Updates the HTML elements showing weather status
     */
    renderWeather(data) {
      this.currentWeather = data;
      const code = data.current.weather_code;
      const theme = this.getThemeByWmoCode(code);
      
      const temp = Math.round(data.current.temperature_2m);
      const humidity = data.current.relative_humidity_2m;
      const windSpeed = Math.round(data.current.wind_speed_10m); 
      const desc = this.wmoDescriptions[code] || 'condiciones variables';
      const city = data.name;
      const lat = data.latitude.toFixed(2);
      const lon = data.longitude.toFixed(2);
      const feelsLike = Math.round(data.current.apparent_temperature);

      const badgeEl = document.getElementById('weatherBadge');
      const widgetTempEl = document.getElementById('widgetTemp');
      const widgetCityEl = document.getElementById('widgetCity');
      const widgetIconEl = document.getElementById('widgetWeatherIcon');
      
      if (widgetTempEl) widgetTempEl.textContent = `${temp}°C`;
      if (widgetCityEl) widgetCityEl.textContent = city;
      
      if (badgeEl) {
        badgeEl.textContent = city.includes('(Demo)') ? 'Demo' : 'Real-Time';
        badgeEl.style.opacity = '1';
      }

      if (widgetIconEl) {
        widgetIconEl.setAttribute('data-lucide', this.getWeatherIconName(theme));
      }

      const dashCityEl = document.getElementById('dashWeatherCity');
      const dashTempEl = document.getElementById('dashWeatherTemp');
      const dashDescEl = document.getElementById('dashWeatherDesc');
      const dashHumEl = document.getElementById('dashWeatherHum');
      const dashWindEl = document.getElementById('dashWeatherWind');
      const dashIconContainer = document.getElementById('dashWeatherAnimIcon');
      const dashMoodTag = document.getElementById('dashThemeMoodTag');

      if (dashCityEl) dashCityEl.textContent = city;
      if (dashTempEl) dashTempEl.textContent = `${temp}°C`;
      if (dashDescEl) dashDescEl.textContent = desc;
      if (dashHumEl) dashHumEl.innerHTML = `Humedad: <strong>${humidity}%</strong>`;
      if (dashWindEl) dashWindEl.innerHTML = `Viento: <strong>${windSpeed} km/h</strong>`;
      if (dashMoodTag) dashMoodTag.textContent = this.getThemeMoodText(theme);

      if (dashIconContainer) {
        dashIconContainer.innerHTML = `<i data-lucide="${this.getWeatherIconName(theme)}" class="weather-giant-icon animate-pulse"></i>`;
      }

      const detCityEl = document.getElementById('detCityName');
      const detCoordsEl = document.getElementById('detCoordinates');
      const detStatusEl = document.getElementById('detStatusBadge');
      const detTempEl = document.getElementById('detTemp');
      const detDescEl = document.getElementById('detWeatherDesc');
      const detHumEl = document.getElementById('detHumidity');
      const detWindEl = document.getElementById('detWind');
      const detFeelsEl = document.getElementById('detFeelsLike');
      const detPressEl = document.getElementById('detPressure');
      const detIconContainer = document.getElementById('detWeatherIconContainer');

      if (detCityEl) detCityEl.textContent = city;
      if (detCoordsEl) detCoordsEl.textContent = `Lat: ${lat} | Lon: ${lon}`;
      if (detStatusEl) {
        detStatusEl.textContent = desc;
        detStatusEl.style.textTransform = 'uppercase';
      }
      if (detTempEl) detTempEl.textContent = temp;
      if (detDescEl) {
        detDescEl.textContent = `Las condiciones climáticas actuales muestran ${desc} con una temperatura ambiental de ${temp}°C.`;
      }
      if (detHumEl) detHumEl.textContent = `${humidity}%`;
      if (detWindEl) detWindEl.textContent = `${windSpeed} km/h`;
      if (detFeelsEl) detFeelsEl.textContent = `${feelsLike}°C`;
      if (detPressEl) detPressEl.textContent = '1013 hPa';
      
      if (detIconContainer) {
        detIconContainer.innerHTML = `<i data-lucide="${this.getWeatherIconName(theme)}" class="weather-giant-icon"></i>`;
      }

      this.applyThemeClass(theme);

      if (window.lucide) {
        window.lucide.createIcons();
      }
    }
  };

  window.DesignHubWeather = WeatherModule;
})();
