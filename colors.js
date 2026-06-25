/**
 * DesignHub - Color Palette Generator Module (colors.js)
 * Manages color picked schemes, calculations, clipboard copy, and CSS variable downloads.
 */

(function () {
  const ColorsModule = {
    // Active palette state
    currentPalette: [],

    /**
     * Initializes DOM bindings
     */
    init() {
      const picker = document.getElementById('baseColorPicker');
      const hexInput = document.getElementById('baseColorHex');
      const countInput = document.getElementById('colorCount');
      const countVal = document.getElementById('colorCountVal');
      const generateBtn = document.getElementById('generatePaletteBtn');
      const copyAllBtn = document.getElementById('copyPaletteHexesBtn');
      const exportCssBtn = document.getElementById('exportPaletteCssBtn');
      const dashGenBtn = document.getElementById('dashGenPaletteBtn');

      if (picker && hexInput) {
        picker.addEventListener('input', (e) => {
          hexInput.value = e.target.value.toUpperCase();
        });

        hexInput.addEventListener('change', (e) => {
          let val = e.target.value.trim();
          if (!val.startsWith('#')) val = '#' + val;
          if (/^#[0-9A-F]{6}$/i.test(val)) {
            picker.value = val;
            hexInput.value = val.toUpperCase();
          } else {
            hexInput.value = picker.value.toUpperCase();
          }
        });
      }

      if (countInput && countVal) {
        countInput.addEventListener('input', (e) => {
          countVal.textContent = e.target.value;
        });
      }

      if (generateBtn) {
        generateBtn.addEventListener('click', () => {
          this.generatePalette();
        });
      }

      if (copyAllBtn) {
        copyAllBtn.addEventListener('click', () => {
          this.copyAllToClipboard();
        });
      }

      if (exportCssBtn) {
        exportCssBtn.addEventListener('click', () => {
          this.exportPaletteAsCSS();
        });
      }

      if (dashGenBtn) {
        dashGenBtn.addEventListener('click', () => {
          this.generateDashboardPalette();
        });
      }
    },

    /**
     * Fetches color palette from The Color API, falling back to local formulas if offline
     */
    async generatePalette() {
      const picker = document.getElementById('baseColorPicker');
      const modeSelect = document.getElementById('schemeMode');
      const countInput = document.getElementById('colorCount');

      if (!picker || !modeSelect || !countInput) return;

      const hex = picker.value.replace('#', '');
      const mode = modeSelect.value;
      const count = countInput.value;

      const resultsGrid = document.getElementById('paletteResultGrid');
      const loader = document.getElementById('paletteLoader');

      if (resultsGrid) resultsGrid.innerHTML = '';
      if (loader) loader.classList.remove('hidden');

      const apiUrl = `https://www.thecolorapi.com/scheme?hex=${hex}&mode=${mode}&count=${count}`;

      try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error('API server returned error');
        }
        const data = await response.json();
        
        const colors = data.colors.map(c => ({
          hex: c.hex.value,
          rgb: c.rgb.value,
          name: c.name.value
        }));

        this.currentPalette = colors;
        
        if (loader) loader.classList.add('hidden');
        this.renderPalette(colors);

      } catch (error) {
        console.warn('API error or offline, triggering local mathematical color wheel generator.', error);
        
        setTimeout(() => {
          const colors = this.calculateLocalHarmony(`#${hex}`, mode, parseInt(count));
          this.currentPalette = colors;
          
          if (loader) loader.classList.add('hidden');
          this.renderPalette(colors);
          
          if (window.DesignHubApp) {
            window.DesignHubApp.showToast('Generada con algoritmo local (Offline mode).');
          }
        }, 300);
      }
    },

    /**
     * Generates a palette for the quick access card in the dashboard
     */
    generateDashboardPalette() {
      const dashGrid = document.getElementById('dashPaletteGrid');
      if (!dashGrid) return;

      dashGrid.innerHTML = `
        <div class="palette-loading-skeleton">
          <div class="sk-bar"></div>
          <div class="sk-bar"></div>
          <div class="sk-bar"></div>
          <div class="sk-bar"></div>
          <div class="sk-bar"></div>
        </div>
      `;

      const hexChars = '0123456789ABCDEF';
      let randomColor = '#';
      for (let i = 0; i < 6; i++) {
        randomColor += hexChars[Math.floor(Math.random() * 16)];
      }

      const modes = ['monochrome', 'analogic', 'complement', 'triad'];
      const randomMode = modes[Math.floor(Math.random() * modes.length)];

      setTimeout(() => {
        const colors = this.calculateLocalHarmony(randomColor, randomMode, 5);
        
        dashGrid.innerHTML = '';
        colors.forEach(col => {
          const div = document.createElement('div');
          div.className = 'mini-color-col';
          div.style.backgroundColor = col.hex;
          div.setAttribute('data-hex', col.hex);
          
          div.addEventListener('click', () => {
            navigator.clipboard.writeText(col.hex).then(() => {
              if (window.DesignHubApp) {
                window.DesignHubApp.showToast(`¡Color ${col.hex} copiado!`);
              }
            });
          });
          dashGrid.appendChild(div);
        });
      }, 400);
    },

    /**
     * Renders palette columns in the UI
     */
    renderPalette(colors) {
      const container = document.getElementById('paletteResultGrid');
      if (!container) return;

      container.innerHTML = '';

      colors.forEach(color => {
        const col = document.createElement('div');
        col.className = 'color-column';
        
        const textIsLight = this.isLightColor(color.hex);
        const iconColor = textIsLight ? '#000000' : '#ffffff';

        col.innerHTML = `
          <div class="color-preview" style="background-color: ${color.hex};">
            <button class="color-column-copy-btn" style="color: ${iconColor};" title="Copiar HEX">
              <i data-lucide="copy"></i>
            </button>
          </div>
          <div class="color-info">
            <span class="color-hex">${color.hex}</span>
            <span class="color-rgb">${color.rgb}</span>
          </div>
        `;

        const triggerCopy = () => {
          navigator.clipboard.writeText(color.hex).then(() => {
            if (window.DesignHubApp) {
              window.DesignHubApp.showToast(`Copiado: ${color.hex}`);
            }
          });
        };

        col.addEventListener('click', triggerCopy);
        col.querySelector('.color-column-copy-btn').addEventListener('click', (e) => {
          e.stopPropagation();
          triggerCopy();
        });

        container.appendChild(col);
      });

      if (window.lucide) {
        window.lucide.createIcons();
      }
    },

    /**
     * Copies all HEX codes separated by commas
     */
    copyAllToClipboard() {
      if (this.currentPalette.length === 0) {
        if (window.DesignHubApp) window.DesignHubApp.showToast('Genera una paleta primero.');
        return;
      }

      const hexes = this.currentPalette.map(c => c.hex).join(', ');
      navigator.clipboard.writeText(hexes).then(() => {
        if (window.DesignHubApp) {
          window.DesignHubApp.showToast('¡Todos los HEX copiados al portapapeles!');
        }
      });
    },

    /**
     * Exports CSS custom properties file containing the colors
     */
    exportPaletteAsCSS() {
      if (this.currentPalette.length === 0) {
        if (window.DesignHubApp) window.DesignHubApp.showToast('Genera una paleta primero.');
        return;
      }

      let cssContent = `/* DesignHub Color Palette Export */\n:root {\n`;
      this.currentPalette.forEach((c, idx) => {
        cssContent += `  --color-${idx + 1}: ${c.hex}; /* ${c.name || 'Color ' + (idx + 1)} */\n`;
      });
      cssContent += `}\n`;

      const blob = new Blob([cssContent], { type: 'text/css' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'designhub-palette.css';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      if (window.DesignHubApp) {
        window.DesignHubApp.showToast('Archivo CSS descargado.');
      }
    },

    /**
     * Determines if a HEX color is light or dark using YIQ formula (luminance)
     */
    isLightColor(hex) {
      const cleanHex = hex.replace('#', '');
      const r = parseInt(cleanHex.substring(0, 2), 16);
      const g = parseInt(cleanHex.substring(2, 4), 16);
      const b = parseInt(cleanHex.substring(4, 6), 16);
      
      const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
      return yiq >= 128;
    },

    /* ==========================================================================
       LOCAL MATHEMATICAL HARMONY GENERATOR ENGINE
       ========================================================================== */

    /**
     * Calculates color schemes manually using HSL wheel
     */
    calculateLocalHarmony(seedHex, mode, count) {
      const hsl = this.hexToHsl(seedHex);
      const colors = [];

      switch (mode) {
        case 'monochrome':
        case 'monochrome-dark':
        case 'monochrome-light': {
          let minL = 15;
          let maxL = 85;
          if (mode === 'monochrome-dark') maxL = 50;
          if (mode === 'monochrome-light') minL = 50;
          
          const step = (maxL - minL) / (count - 1);
          for (let i = 0; i < count; i++) {
            const l = minL + (step * i);
            colors.push(this.hslToColorObject(hsl.h, hsl.s, l));
          }
          break;
        }

        case 'analogic': {
          const stepHue = 15;
          const startHue = (hsl.h - (stepHue * Math.floor(count / 2)) + 360) % 360;
          for (let i = 0; i < count; i++) {
            const h = (startHue + (stepHue * i)) % 360;
            const l = Math.max(20, Math.min(80, hsl.l + (i % 2 === 0 ? 5 : -5)));
            colors.push(this.hslToColorObject(h, hsl.s, l));
          }
          break;
        }

        case 'complement': {
          const countHalf = Math.ceil(count / 2);
          const baseStep = 15;
          
          for (let i = 0; i < countHalf; i++) {
            const l = Math.max(15, hsl.l - 20 + (i * baseStep));
            colors.push(this.hslToColorObject(hsl.h, hsl.s, l));
          }
          
          const compHue = (hsl.h + 180) % 360;
          const compCount = count - countHalf;
          for (let i = 0; i < compCount; i++) {
            const l = Math.max(25, hsl.l - 10 + (i * baseStep));
            colors.push(this.hslToColorObject(compHue, hsl.s, l));
          }
          break;
        }

        case 'analogic-complement': {
          const compHue = (hsl.h + 180) % 360;
          colors.push(this.hslToColorObject(hsl.h, hsl.s, hsl.l));
          
          const nextHues = [
            (hsl.h + 30) % 360,
            (hsl.h - 30 + 360) % 360,
            compHue,
            (compHue + 30) % 360,
            (compHue - 30 + 360) % 360,
            (hsl.h + 60) % 360,
            (compHue + 60) % 360
          ];

          for (let i = 1; i < count; i++) {
            colors.push(this.hslToColorObject(nextHues[i - 1], hsl.s, hsl.l));
          }
          break;
        }

        case 'triad': {
          const spokes = [hsl.h, (hsl.h + 120) % 360, (hsl.h + 240) % 360];
          for (let i = 0; i < count; i++) {
            const h = spokes[i % 3];
            const l = Math.max(20, Math.min(80, hsl.l + (Math.floor(i / 3) * -15)));
            colors.push(this.hslToColorObject(h, hsl.s, l));
          }
          break;
        }

        case 'quad': {
          const spokes = [hsl.h, (hsl.h + 90) % 360, (hsl.h + 180) % 360, (hsl.h + 270) % 360];
          for (let i = 0; i < count; i++) {
            const h = spokes[i % 4];
            const l = Math.max(20, Math.min(80, hsl.l + (Math.floor(i / 4) * -15)));
            colors.push(this.hslToColorObject(h, hsl.s, l));
          }
          break;
        }

        default: {
          for (let i = 0; i < count; i++) {
            colors.push(this.hslToColorObject(hsl.h, hsl.s, hsl.l));
          }
        }
      }

      return colors;
    },

    /**
     * Hex to HSL utility
     */
    hexToHsl(hex) {
      let r = parseInt(hex.substring(1, 3), 16) / 255;
      let g = parseInt(hex.substring(3, 5), 16) / 255;
      let b = parseInt(hex.substring(5, 7), 16) / 255;

      let max = Math.max(r, g, b), min = Math.min(r, g, b);
      let h, s, l = (max + min) / 2;

      if (max === min) {
        h = s = 0;
      } else {
        let d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
          case r: h = (g - b) / d + (g < b ? 6 : 0); break;
          case g: h = (b - r) / d + 2; break;
          case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
      }

      return {
        h: Math.round(h * 360),
        s: Math.round(s * 100),
        l: Math.round(l * 100)
      };
    },

    /**
     * Creates HEX/RGB wrapper from single HSL values
     */
    hslToColorObject(h, s, l) {
      const hex = this.hslToHex(h, s, l);
      const rgb = this.hexToRgb(hex);
      return {
        hex: hex,
        rgb: rgb,
        name: `H${h} S${s}% L${l}%`
      };
    },

    /**
     * HSL to Hex utility
     */
    hslToHex(h, s, l) {
      l /= 100;
      const a = s * Math.min(l, 1 - l) / 100;
      const f = n => {
        const k = (n + h / 30) % 12;
        const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
        return Math.round(255 * color).toString(16).padStart(2, '0');
      };
      return `#${f(0)}${f(8)}${f(4)}`.toUpperCase();
    },

    /**
     * Hex to RGB clean text representation
     */
    hexToRgb(hex) {
      const cleanHex = hex.replace('#', '');
      const r = parseInt(cleanHex.substring(0, 2), 16);
      const g = parseInt(cleanHex.substring(2, 4), 16);
      const b = parseInt(cleanHex.substring(4, 6), 16);
      return `rgb(${r}, ${g}, ${b})`;
    }
  };

  window.DesignHubColors = ColorsModule;
})();
