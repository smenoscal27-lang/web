/**
 * DesignHub - Master Orchestrator (app.js)
 * Manages global app state, navigation, settings modal, theme toggles, and boots modules.
 */

(function () {
  const App = {
    // Current active tab
    activeTab: 'dashboard',

    // Designer Quotes List
    quotes: [
      { text: '"El diseño no es solo lo que se ve y lo que se siente. El diseño es cómo funciona."', author: 'Steve Jobs' },
      { text: '"La simplicidad es la máxima sofisticación."', author: 'Leonardo da Vinci' },
      { text: '"El diseño es el embajador silencioso de tu marca."', author: 'Paul Rand' },
      { text: '"Menos es más."', author: 'Ludwig Mies van der Rohe' },
      { text: '"La gente ignora el diseño que ignora a la gente."', author: 'Frank Chimero' },
      { text: '"El buen diseño es tan poco diseño como sea posible."', author: 'Dieter Rams' },
      { text: '"El diseño gráfico salvará al mundo justo después de que lo haga la tipografía."', author: 'David Carson' }
    ],

    /**
     * Bootstraps the application on page load
     */
    init() {
      console.log('DesignHub: Inicializando plataforma...');
      
      this.createMobileOverlay();

      this.bindNavigation();
      this.bindThemeToggle();
      this.bindSettingsModal();
      this.bindBanner();
      this.bindWeatherTester();
      this.bindWeatherSearch();

      if (window.DesignHubWeather) {
        document.addEventListener('weatherChanged', (e) => {
          const theme = e.detail.theme;
          console.log(`Clima cambió a: ${theme}. Sincronizando interfaz...`);
          
          if (window.DesignHubGallery) {
            window.DesignHubGallery.renderDashboardInspirations(theme);
          }
          
          const picker = document.getElementById('baseColorPicker');
          const hexInput = document.getElementById('baseColorHex');
          const weatherAccents = {
            sunny: '#F59E0B',
            cloudy: '#14B8A6',
            rainy: '#3B82F6',
            snowy: '#06B6D4',
            stormy: '#A855F7'
          };
          
          if (picker && hexInput && weatherAccents[theme]) {
            picker.value = weatherAccents[theme];
            hexInput.value = weatherAccents[theme];
          }
        });
      }

      if (window.DesignHubGallery) window.DesignHubGallery.init();
      if (window.DesignHubColors) {
        window.DesignHubColors.init();
        window.DesignHubColors.generateDashboardPalette();
        window.DesignHubColors.generatePalette();
      }

      this.checkApiKeys();
      this.displayQuote();
      this.loadWeatherModule();
      this.setupGreeting();

      if (window.lucide) {
        window.lucide.createIcons();
      }
    },

    /**
     * Configures greeting based on client time of day
     */
    setupGreeting() {
      const greetEl = document.getElementById('dashboardGreeting');
      const dateEl = document.getElementById('currentDate');
      if (!greetEl) return;

      const hour = new Date().getHours();
      let greeting = 'Buenos días';
      if (hour >= 12 && hour < 20) greeting = 'Buenas tardes';
      if (hour >= 20 || hour < 6) greeting = 'Buenas noches';

      greetEl.textContent = `${greeting}, diseñador. El diseño se nutre de la inspiración diaria.`;

      if (dateEl) {
        const options = { weekday: 'long', day: 'numeric', month: 'long' };
        dateEl.textContent = new Date().toLocaleDateString('es-ES', options);
      }
    },

    /**
     * Load random quote
     */
    displayQuote() {
      const textEl = document.getElementById('quoteText');
      const authorEl = document.getElementById('quoteAuthor');
      if (!textEl || !authorEl) return;

      const randomQuote = this.quotes[Math.floor(Math.random() * this.quotes.length)];
      textEl.textContent = randomQuote.text;
      authorEl.textContent = `— ${randomQuote.author}`;
    },

    /**
     * Binds click events to Tab triggers
     */
    bindNavigation() {
      const navButtons = document.querySelectorAll('.nav-item');
      
      const switchTab = (targetTabId) => {
        document.querySelectorAll('.content-page').forEach(page => {
          page.classList.remove('active');
        });
        
        const targetPage = document.getElementById(`page-${targetTabId}`);
        if (targetPage) {
          targetPage.classList.add('active');
          targetPage.style.opacity = '0';
          setTimeout(() => {
            targetPage.style.opacity = '1';
          }, 50);
        }

        document.querySelectorAll('.nav-item').forEach(btn => {
          btn.classList.remove('active');
          if (btn.getAttribute('data-target') === targetTabId) {
            btn.classList.add('active');
          }
        });

        this.activeTab = targetTabId;

        const sidebar = document.getElementById('appSidebar');
        const overlay = document.querySelector('.sidebar-overlay');
        if (sidebar && sidebar.classList.contains('mobile-open')) {
          sidebar.classList.remove('mobile-open');
          if (overlay) overlay.classList.remove('active');
        }

        if (targetTabId === 'inspiration' && window.DesignHubGallery) {
          const grid = document.getElementById('pinterestGrid');
          if (grid && grid.children.length === 0) {
            window.DesignHubGallery.searchPhotos('architecture');
          }
        }

        if (window.lucide) {
          window.lucide.createIcons();
        }
      };

      navButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
          const target = btn.getAttribute('data-target');
          switchTab(target);
        });
      });

      const goToPalettes = document.getElementById('goToPalettesBtn');
      const goToGallery = document.getElementById('goToGalleryBtn');

      if (goToPalettes) {
        goToPalettes.addEventListener('click', () => switchTab('palettes'));
      }
      if (goToGallery) {
        goToGallery.addEventListener('click', () => switchTab('inspiration'));
      }

      const menuToggle = document.getElementById('menuToggleBtn');
      const sidebar = document.getElementById('appSidebar');
      const overlay = document.querySelector('.sidebar-overlay');

      if (menuToggle && sidebar) {
        menuToggle.addEventListener('click', () => {
          sidebar.classList.add('mobile-open');
          if (overlay) overlay.classList.add('active');
        });
      }
    },

    createMobileOverlay() {
      const overlay = document.createElement('div');
      overlay.className = 'sidebar-overlay';
      document.body.appendChild(overlay);
      
      overlay.addEventListener('click', () => {
        const sidebar = document.getElementById('appSidebar');
        sidebar.classList.remove('mobile-open');
        overlay.classList.remove('active');
      });
    },

    /**
     * Binds light / dark theme toggle
     */
    bindThemeToggle() {
      const toggleBtns = [
        document.getElementById('themeToggleBtn'),
        document.getElementById('themeToggleBtnMobile')
      ];

      const savedTheme = localStorage.getItem('dh_theme') || 'dark';
      document.body.className = savedTheme === 'dark' ? 'dark-theme' : 'light-theme';

      toggleBtns.forEach(btn => {
        if (!btn) return;
        btn.addEventListener('click', () => {
          const isDark = document.body.classList.contains('dark-theme');
          if (isDark) {
            document.body.classList.remove('dark-theme');
            document.body.classList.add('light-theme');
            localStorage.setItem('dh_theme', 'light');
            this.showToast('Modo claro activado');
          } else {
            document.body.classList.remove('light-theme');
            document.body.classList.add('dark-theme');
            localStorage.setItem('dh_theme', 'dark');
            this.showToast('Modo oscuro activado');
          }
          
          if (window.DesignHubWeather && window.DesignHubWeather.activeTheme) {
            document.body.classList.remove(
              'weather-sunny', 'weather-cloudy', 'weather-rainy', 'weather-snowy', 'weather-stormy'
            );
            document.body.classList.add(`weather-${window.DesignHubWeather.activeTheme}`);
          }
        });
      });
    },

    /**
     * Binds Settings Form controls and keys saving
     */
    bindSettingsModal() {
      const modal = document.getElementById('settingsModal');
      const openBtns = [
        document.getElementById('openSettingsBtn'),
        document.getElementById('openSettingsBtnMobile')
      ];
      const closeBtn = modal.querySelector('.close-modal-btn');
      const cancelBtn = document.getElementById('cancelSettingsBtn');
      const form = document.getElementById('settingsForm');
      const clearBtn = document.getElementById('clearKeysBtn');

      const openModal = () => {
        document.getElementById('unsplashKeyInput').value = localStorage.getItem('dh_unsplash_key') || '';
        modal.classList.add('active');
      };

      const closeModal = () => {
        modal.classList.remove('active');
      };

      openBtns.forEach(btn => {
        if (btn) btn.addEventListener('click', openModal);
      });
      
      if (closeBtn) closeBtn.addEventListener('click', closeModal);
      if (cancelBtn) cancelBtn.addEventListener('click', closeModal);

      if (clearBtn) {
        clearBtn.addEventListener('click', () => {
          localStorage.removeItem('dh_unsplash_key');
          document.getElementById('unsplashKeyInput').value = '';
          this.showToast('Llaves de Unsplash eliminadas.');
        });
      }

      if (form) {
        form.addEventListener('submit', (e) => {
          e.preventDefault();
          const unsplashKey = document.getElementById('unsplashKeyInput').value.trim();

          if (unsplashKey) localStorage.setItem('dh_unsplash_key', unsplashKey);
          else localStorage.removeItem('dh_unsplash_key');

          closeModal();
          this.checkApiKeys();
          this.showToast('Ajustes guardados correctamente.');
          
          if (this.activeTab === 'inspiration' && window.DesignHubGallery) {
            const query = document.getElementById('gallerySearchInput').value || 'architecture';
            window.DesignHubGallery.searchPhotos(query);
          }
        });
      }
    },

    /**
     * Toggles top notifications banner based on presence of API keys
     */
    checkApiKeys() {
      const banner = document.getElementById('demoBanner');
      if (!banner) return;

      const hasUnsplash = !!localStorage.getItem('dh_unsplash_key');

      if (hasUnsplash) {
        banner.classList.add('hidden');
      } else {
        banner.classList.remove('hidden');
      }
    },

    bindBanner() {
      const closeBtn = document.getElementById('closeBannerBtn');
      const link = document.getElementById('bannerSettingsLink');
      const banner = document.getElementById('demoBanner');

      if (closeBtn && banner) {
        closeBtn.addEventListener('click', () => banner.classList.add('hidden'));
      }

      if (link) {
        link.addEventListener('click', (e) => {
          e.preventDefault();
          const openSettings = document.getElementById('openSettingsBtn');
          if (openSettings) openSettings.click();
        });
      }
    },

    /**
     * Binds forces weather theme controls in detailed weather page
     */
    bindWeatherTester() {
      const buttons = document.querySelectorAll('.theme-test-btn');
      
      buttons.forEach(btn => {
        btn.addEventListener('click', () => {
          const type = btn.getAttribute('data-weather');
          
          buttons.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');

          if (type === 'reset') {
            this.showToast('Restableciendo clima en tiempo real...');
            this.loadWeatherModule();
            return;
          }

          if (window.DesignHubWeather) {
            const mockData = window.DesignHubWeather.getMockWeather(type);
            window.DesignHubWeather.renderWeather(mockData);
            this.showToast(`Forzado clima: ${type.toUpperCase()}`);
          }
        });
      });
    },

    /**
     * Binds search submission inside the weather detail tab
     */
    bindWeatherSearch() {
      const form = document.getElementById('weatherSearchForm');
      const input = document.getElementById('weatherSearchInput');

      if (form && input) {
        form.addEventListener('submit', (e) => {
          e.preventDefault();
          const query = input.value.trim();
          if (query) {
            this.showToast(`Buscando clima en: ${query}...`);
            this.loadDefaultCityWeather(query);
          }
        });
      }
    },

    /**
     * Requests user coordinates and queries weather from Open-Meteo (keyless)
     */
    loadWeatherModule() {
      if (!window.DesignHubWeather) return;

      const success = async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const weatherData = await window.DesignHubWeather.fetchWeatherByCoords(latitude, longitude);
          const cityName = await window.DesignHubWeather.reverseGeocode(latitude, longitude);
          weatherData.name = cityName;
          
          window.DesignHubWeather.renderWeather(weatherData);
        } catch (err) {
          console.error(err);
          this.showToast('Error al conectar con el servidor de clima local.');
          this.loadDefaultCityWeather('Madrid');
        }
      };

      const error = async () => {
        console.warn('Geolocation access denied. Loading default city (Madrid)...');
        this.loadDefaultCityWeather('Madrid');
      };

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(success, error, { timeout: 7000 });
      } else {
        error();
      }
    },

    /**
     * Fallback resolver: loads weather for a default city name using geocoding
     */
    async loadDefaultCityWeather(city) {
      if (!window.DesignHubWeather) return;

      try {
        const geoInfo = await window.DesignHubWeather.fetchCoordsByCity(city);
        const weatherData = await window.DesignHubWeather.fetchWeatherByCoords(geoInfo.latitude, geoInfo.longitude);
        weatherData.name = `${geoInfo.name}, ${geoInfo.country}`;
        
        window.DesignHubWeather.renderWeather(weatherData);
      } catch (err) {
        console.warn('Geocoding API or Open-Meteo failed. Loading mock template.', err);
        const fallbackMock = window.DesignHubWeather.getMockWeather();
        window.DesignHubWeather.renderWeather(fallbackMock);
      }
    },

    /**
     * Triggers dynamic Toast notifications
     */
    showToast(message) {
      const container = document.getElementById('toastContainer');
      if (!container) return;

      const toast = document.createElement('div');
      toast.className = 'toast';
      toast.innerHTML = `
        <i data-lucide="check-circle-2"></i>
        <span>${message}</span>
      `;

      container.appendChild(toast);
      
      if (window.lucide) {
        window.lucide.createIcons();
      }

      setTimeout(() => {
        toast.classList.add('removing');
        toast.addEventListener('animationend', () => {
          toast.remove();
        });
      }, 3500);
    }
  };

  window.DesignHubApp = App;

  document.addEventListener('DOMContentLoaded', () => {
    App.init();
  });
})();
