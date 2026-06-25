/**
 * DesignHub - Gallery Module (gallery.js)
 * Manages Unsplash integration, keyword search, Pinterest grids, and lightboxes.
 */

(function () {
  const GalleryModule = {
    // Current query results
    photos: [],

    // Curated high-fidelity mock photos for Demo Mode (diverse design subjects)
    mockPhotos: [
      {
        id: 'mock1',
        urls: {
          regular: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
          full: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80'
        },
        description: 'Modern minimalist villa exterior',
        user: {
          name: 'Jared Rice',
          username: 'jaredrice',
          profile_image: { small: 'https://images.unsplash.com/profile-1600585154340-be6161a56a0c?auto=format&fit=crop&w=64&q=80' }
        },
        aspect_ratio: 0.75
      },
      {
        id: 'mock2',
        urls: {
          regular: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80',
          full: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1600&q=80'
        },
        description: 'Mid-century modern yellow chair',
        user: {
          name: 'Kam Idrees',
          username: 'kamidrees',
          profile_image: { small: 'https://images.unsplash.com/profile-1563823485489-399fb1b423c7?auto=format&fit=crop&w=64&q=80' }
        },
        aspect_ratio: 0.8
      },
      {
        id: 'mock3',
        urls: {
          regular: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80',
          full: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1600&q=80'
        },
        description: 'Sunlit design workshop workspace',
        user: {
          name: 'Sarah Dorweiler',
          username: 'sarahdorweiler',
          profile_image: { small: 'https://images.unsplash.com/profile-1498801931326-cdff0ee4b54e?auto=format&fit=crop&w=64&q=80' }
        },
        aspect_ratio: 1.2
      },
      {
        id: 'mock4',
        urls: {
          regular: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80',
          full: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1600&q=80'
        },
        description: 'Web developer coding UI layout',
        user: {
          name: 'Christopher Gower',
          username: 'cgower',
          profile_image: { small: 'https://images.unsplash.com/profile-1473264475470-ee7bd5ccf3a1?auto=format&fit=crop&w=64&q=80' }
        },
        aspect_ratio: 0.7
      },
      {
        id: 'mock5',
        urls: {
          regular: 'https://images.unsplash.com/photo-1519782708149-7f54611402c9?auto=format&fit=crop&w=800&q=80',
          full: 'https://images.unsplash.com/photo-1519782708149-7f54611402c9?auto=format&fit=crop&w=1600&q=80'
        },
        description: 'Brutalist concrete museum interior',
        user: {
          name: 'Samuel Clara',
          username: 'samuelclara',
          profile_image: { small: 'https://images.unsplash.com/profile-fb-1516053351-a9b0c72ca8e4.jpg?auto=format&fit=crop&w=64&q=80' }
        },
        aspect_ratio: 1.5
      },
      {
        id: 'mock6',
        urls: {
          regular: 'https://images.unsplash.com/photo-1549490349-8643362247b5?auto=format&fit=crop&w=800&q=80',
          full: 'https://images.unsplash.com/photo-1549490349-8643362247b5?auto=format&fit=crop&w=1600&q=80'
        },
        description: 'Elegant architectural curves and shadows',
        user: {
          name: 'Joel Filipe',
          username: 'joelfilipe',
          profile_image: { small: 'https://images.unsplash.com/profile-1502447926127-d3db9f75ec5f?auto=format&fit=crop&w=64&q=80' }
        },
        aspect_ratio: 0.67
      },
      {
        id: 'mock7',
        urls: {
          regular: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
          full: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1600&q=80'
        },
        description: 'Fluid 3D abstract digital art background',
        user: {
          name: 'Milad Fakurian',
          username: 'fakurian',
          profile_image: { small: 'https://images.unsplash.com/profile-1612448332997-7629fc30c0ccimage?auto=format&fit=crop&w=64&q=80' }
        },
        aspect_ratio: 0.8
      },
      {
        id: 'mock8',
        urls: {
          regular: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=800&q=80',
          full: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=1600&q=80'
        },
        description: 'Vibrant neon waves graphics',
        user: {
          name: 'Richard Horvath',
          username: 'richardhorvath',
          profile_image: { small: 'https://images.unsplash.com/profile-1510408546571-fb4ff54c1f96?auto=format&fit=crop&w=64&q=80' }
        },
        aspect_ratio: 1.3
      },
      {
        id: 'mock9',
        urls: {
          regular: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=800&q=80',
          full: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=1600&q=80'
        },
        description: 'Geometric abstract black and gold texture',
        user: {
          name: 'Fakurian Design',
          username: 'fakurian',
          profile_image: { small: 'https://images.unsplash.com/profile-1612448332997-7629fc30c0ccimage?auto=format&fit=crop&w=64&q=80' }
        },
        aspect_ratio: 0.75
      }
    ],

    /**
     * Initializes elements and event listeners
     */
    init() {
      const searchForm = document.getElementById('gallerySearchForm');
      const tagChips = document.getElementById('tagChips');

      if (searchForm) {
        searchForm.addEventListener('submit', (e) => {
          e.preventDefault();
          const query = document.getElementById('gallerySearchInput').value.trim();
          if (query) {
            this.searchPhotos(query);
            document.querySelectorAll('#tagChips .chip').forEach(c => c.classList.remove('active'));
          }
        });
      }

      if (tagChips) {
        tagChips.addEventListener('click', (e) => {
          const chip = e.target.closest('.chip');
          if (chip) {
            document.querySelectorAll('#tagChips .chip').forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
            
            const query = chip.getAttribute('data-tag');
            document.getElementById('gallerySearchInput').value = chip.textContent;
            this.searchPhotos(query);
          }
        });
      }

      this.initLightbox();
    },

    /**
     * Searches images on Unsplash or falls back to local mocks
     * @param {string} query 
     */
    async searchPhotos(query) {
      const apiKey = localStorage.getItem('dh_unsplash_key');
      const grid = document.getElementById('pinterestGrid');
      const loader = document.getElementById('galleryLoading');
      const emptyState = document.getElementById('galleryEmptyState');

      if (grid) grid.innerHTML = '';
      if (emptyState) emptyState.classList.add('hidden');
      if (loader) loader.classList.remove('hidden');

      if (!apiKey) {
        console.log(`Demo Mode: Buscando imágenes para "${query}"`);
        setTimeout(() => {
          if (loader) loader.classList.add('hidden');
          
          const results = this.filterMocksByQuery(query);
          this.photos = results;
          
          if (results.length === 0) {
            if (emptyState) emptyState.classList.remove('hidden');
          } else {
            this.renderGrid(results);
          }
        }, 800);
        return;
      }

      const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=20&client_id=${apiKey}`;
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Error API Unsplash: ${response.status}`);
        }
        const data = await response.json();
        this.photos = data.results;

        if (loader) loader.classList.add('hidden');

        if (data.results.length === 0) {
          if (emptyState) emptyState.classList.remove('hidden');
        } else {
          this.renderGrid(data.results);
        }
      } catch (error) {
        console.error('Error fetching from Unsplash:', error);
        if (loader) loader.classList.add('hidden');
        
        if (window.DesignHubApp) {
          window.DesignHubApp.showToast('Error de API Unsplash. Entrando en modo de respaldo.');
        }
        
        const results = this.filterMocksByQuery(query);
        this.photos = results;
        this.renderGrid(results);
      }
    },

    /**
     * Filters mock images based on user queries, or generates mockups using Lorem Picsum
     */
    filterMocksByQuery(query) {
      const q = query.toLowerCase();
      
      let matches = this.mockPhotos.filter(photo => 
        photo.description.toLowerCase().includes(q) || 
        photo.user.name.toLowerCase().includes(q)
      );

      if (matches.length === 0) {
        const photographerNames = ['Alex Rivera', 'Lucia Sanz', 'Marcus Vane', 'Elena Rostova', 'Kenji Sato', 'Emma Watson'];
        const subjects = ['design', 'minimal', 'interior', 'space', 'retro', 'modern', 'architect'];
        
        for (let i = 0; i < 12; i++) {
          const randomId = Math.floor(Math.random() * 1000) + 10;
          const randomHeight = Math.floor(Math.random() * 300) + 600;
          const randomWidth = 600;
          const photographer = photographerNames[i % photographerNames.length];
          const username = photographer.toLowerCase().replace(' ', '');
          
          matches.push({
            id: `lorem-${randomId}-${i}`,
            urls: {
              regular: `https://picsum.photos/id/${randomId}/${randomWidth}/${randomHeight}`,
              full: `https://picsum.photos/id/${randomId}/${randomWidth * 2}/${randomHeight * 2}`
            },
            description: `Diseño de ${subjects[i % subjects.length]} por ${photographer}`,
            user: {
              name: photographer,
              username: username,
              profile_image: { small: `https://picsum.photos/id/${randomId % 100}/64/64` }
            },
            aspect_ratio: randomWidth / randomHeight
          });
        }
      }

      return matches;
    },

    /**
     * Renders Unsplash / Mock images in a Pinterest layout
     */
    renderGrid(items) {
      const grid = document.getElementById('pinterestGrid');
      if (!grid) return;

      grid.innerHTML = '';

      items.forEach(photo => {
        const item = document.createElement('article');
        item.className = 'gallery-item';
        item.setAttribute('data-id', photo.id);

        const avatar = photo.user.profile_image ? photo.user.profile_image.small : 'https://picsum.photos/64/64';
        const description = photo.description || photo.alt_description || 'Sin título';

        item.innerHTML = `
          <div class="gallery-img-wrapper">
            <img src="${photo.urls.regular}" alt="${description}" class="gallery-img" loading="lazy">
            <div class="gallery-overlay">
              <div class="gallery-info-meta">
                <div class="photographer-info">
                  <img src="${avatar}" alt="${photo.user.name}" class="photographer-avatar">
                  <span class="photographer-name">${photo.user.name}</span>
                </div>
                <div class="gallery-btn-actions">
                  <button class="gallery-act-btn zoom-btn" title="Visualizar">
                    <i data-lucide="maximize-2"></i>
                  </button>
                  <button class="gallery-act-btn download-btn" title="Descargar">
                    <i data-lucide="download"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        `;

        item.querySelector('.zoom-btn').addEventListener('click', (e) => {
          e.stopPropagation();
          this.openLightbox(photo);
        });

        item.addEventListener('click', () => {
          this.openLightbox(photo);
        });

        item.querySelector('.download-btn').addEventListener('click', (e) => {
          e.stopPropagation();
          this.downloadImage(photo.urls.full, `designhub-${photo.id}.jpg`);
        });

        grid.appendChild(item);
      });

      if (window.lucide) {
        window.lucide.createIcons();
      }
    },

    /**
     * Render a smaller version of weather visual inspirations on the dashboard
     */
    renderDashboardInspirations(theme) {
      const dashGrid = document.getElementById('dashGalleryGrid');
      const searchTermEl = document.getElementById('dashWeatherSearchTerm');
      if (!dashGrid) return;

      const weatherTerms = {
        sunny: 'desierto',
        cloudy: 'minimalismo',
        rainy: 'neblina',
        snowy: 'nieve',
        stormy: 'luces nocturnas'
      };

      const query = weatherTerms[theme] || 'decoración';
      if (searchTermEl) searchTermEl.textContent = query;

      const apiKey = localStorage.getItem('dh_unsplash_key');
      
      dashGrid.innerHTML = `
        <div class="skeleton-img"></div>
        <div class="skeleton-img"></div>
        <div class="skeleton-img"></div>
      `;

      if (!apiKey) {
        setTimeout(() => {
          const list = this.mockPhotos.slice(0, 3);
          this.populateMiniGrid(list);
        }, 500);
        return;
      }

      const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=3&client_id=${apiKey}`;
      fetch(url)
        .then(res => res.json())
        .then(data => {
          if (data.results && data.results.length >= 3) {
            this.populateMiniGrid(data.results);
          } else {
            this.populateMiniGrid(this.mockPhotos.slice(0, 3));
          }
        })
        .catch(() => {
          this.populateMiniGrid(this.mockPhotos.slice(0, 3));
        });
    },

    populateMiniGrid(items) {
      const dashGrid = document.getElementById('dashGalleryGrid');
      if (!dashGrid) return;

      dashGrid.innerHTML = '';
      items.forEach(photo => {
        const img = document.createElement('img');
        img.src = photo.urls.regular;
        img.alt = photo.description || 'Inspiración';
        img.className = 'mini-gallery-img';
        img.addEventListener('click', () => {
          const navItem = document.querySelector('[data-target="inspiration"]');
          if (navItem) navItem.click();
          this.openLightbox(photo);
        });
        dashGrid.appendChild(img);
      });
    },

    /**
     * Lightbox Modal Methods
     */
    initLightbox() {
      const lightbox = document.getElementById('lightboxModal');
      const closeBtn = document.getElementById('closeLightboxBtn');
      const copyBtn = document.getElementById('lightboxCopyLinkBtn');

      if (closeBtn && lightbox) {
        closeBtn.addEventListener('click', () => {
          lightbox.classList.remove('active');
        });
        lightbox.addEventListener('click', (e) => {
          if (e.target === lightbox) {
            lightbox.classList.remove('active');
          }
        });
      }

      if (copyBtn) {
        copyBtn.addEventListener('click', () => {
          const imgUrl = document.getElementById('lightboxImg').src;
          navigator.clipboard.writeText(imgUrl).then(() => {
            if (window.DesignHubApp) {
              window.DesignHubApp.showToast('¡Enlace de imagen copiado al portapapeles!');
            }
          });
        });
      }
    },

    openLightbox(photo) {
      const lightbox = document.getElementById('lightboxModal');
      const img = document.getElementById('lightboxImg');
      const avatar = document.getElementById('lightboxAuthorAvatar');
      const name = document.getElementById('lightboxAuthorName');
      const link = document.getElementById('lightboxAuthorLink');
      const downloadBtn = document.getElementById('lightboxDownloadBtn');

      if (!lightbox || !img) return;

      const description = photo.description || photo.alt_description || 'Inspiración Visual';
      
      img.src = photo.urls.full;
      img.alt = description;

      if (avatar) {
        avatar.src = photo.user.profile_image ? photo.user.profile_image.small : 'https://picsum.photos/64/64';
      }
      if (name) name.textContent = photo.user.name;
      if (link) {
        link.textContent = `@${photo.user.username}`;
        link.href = `https://unsplash.com/@${photo.user.username}?utm_source=DesignHub&utm_medium=referral`;
      }

      if (downloadBtn) {
        downloadBtn.href = photo.urls.full;
        downloadBtn.onclick = (e) => {
          e.preventDefault();
          this.downloadImage(photo.urls.full, `designhub-${photo.id}.jpg`);
        };
      }

      lightbox.classList.add('active');
    },

    /**
     * Downloads an image URL by creating an ephemeral link
     */
    downloadImage(url, filename) {
      if (window.DesignHubApp) {
        window.DesignHubApp.showToast('Descargando imagen de alta resolución...');
      }

      fetch(url, { mode: 'cors' })
        .then(response => {
          if (!response.ok) throw new Error('CORS download failed');
          return response.blob();
        })
        .then(blob => {
          const blobUrl = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = blobUrl;
          link.download = filename;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(blobUrl);
        })
        .catch(() => {
          window.open(url, '_blank');
        });
    }
  };

  window.DesignHubGallery = GalleryModule;
})();
