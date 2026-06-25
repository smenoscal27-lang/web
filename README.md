# DesignHub 🎨✨

**DesignHub** es una plataforma web moderna, interactiva y responsiva diseñada exclusivamente para creativos, programadores front-end y diseñadores de interfaces. El sistema combina visualización climática interactiva (que adapta la estética del sitio), un buscador de inspiración visual con grillas de estilo Pinterest (conectado a Unsplash) y un generador de armonías de color matemático y remoto (conectado a The Color API).

La aplicación está diseñada como una **Single Page Application (SPA)** nativa, sin dependencias complejas ni frameworks pesados de compilación, lo que permite su despliegue inmediato en servidores estáticos como **GitHub Pages**.

---

## 🚀 Características Principales

1. **Módulo de Clima Adaptativo (Open-Meteo, Nominatim & Geolocation - Sin Clave)**
   - Detecta la ubicación geográfica del usuario mediante la API de Geolocalización del navegador.
   - Consulta el clima en tiempo real (temperatura, humedad, velocidad del viento y estado) a través de la API pública global **Open-Meteo**, y traduce las coordenadas a nombres de ciudades mediante **OpenStreetMap Nominatim** sin necesidad de API Keys.
   - **Interfaz Adaptativa**: Cambia la paleta de colores de acento, gradientes decorativos y sombras del sitio completo de acuerdo a las condiciones climáticas del usuario (Soleado, Nublado, Lluvioso, Nevado o Tormentoso).
   - Incluye un panel de pruebas para simular climas específicos bajo demanda.

2. **Buscador de Inspiración Visual (Unsplash API)**
   - Buscador de imágenes de alta resolución mediante palabras clave.
   - Presentación de imágenes en una grilla dinámica auto-ajustable tipo Pinterest.
   - Lightbox modal con detalles del autor, enlace a su perfil, opción de copiado del link y sistema de descarga forzada directa.

3. **Generador de Paletas Armónicas (The Color API & Algoritmo HSL Local)**
   - Selector interactivo de color semilla (color picker nativo con input HEX sincronizado).
   - Múltiples armonías disponibles: *Monocromática, Analógica, Complementaria, Tríada y Tétrada*.
   - Muestra de códigos HEX y RGB con cálculo dinámico de contraste (YIQ) para adaptar la legibilidad del texto en pantalla.
   - Copiado rápido de códigos individuales o de la paleta completa al portapapeles.
   - Exportador dedicado que genera y descarga archivos CSS con las variables configuradas de la paleta.

4. **Robustez y Modo de Respaldo (Demo Mode)**
   - Si no se proveen API Keys, la plataforma entra automáticamente en **Modo Demo**, inyectando datos simulados realistas y permitiendo que todas las secciones funcionen de forma impecable sin interrumpir la experiencia.
   - Cuenta con un algoritmo de cálculo HSL puro en JavaScript para generar paletas de colores en caso de estar sin conexión o si el servidor de *The Color API* presenta fallas.

---

## 📁 Estructura del Proyecto

El proyecto mantiene una arquitectura limpia, modular y estructurada:

```
/
├── index.html         # Archivo estructural HTML5 semántico
├── README.md          # Guía del proyecto e instrucciones
├── .gitignore         # Configuración de exclusión para Git
├── css/
│   └── styles.css     # Estilos responsivos, variables CSS, temas y animaciones
└── js/
    ├── app.js         # Orquestador del sistema, rutas de pestañas y modales
    ├── weather.js     # Lógica climática, geolocalización y lógica temática
    ├── gallery.js     # Buscador e interfaz de Unsplash, lightbox y descargas
    └── colors.js      # Generador cromático, fórmulas HSL locales y exportación
```

---

## 🔑 Cómo Obtener la API Key de Unsplash

El **Módulo de Clima** y el **Generador de Paletas** funcionan de forma **gratuita, automática y sin claves** a nivel mundial de manera nativa.

Para conectar el buscador del **Módulo de Inspiración** con datos reales de la comunidad de Unsplash, necesitas obtener una llave e ingresarla en el panel de **Ajustes** (icono de engranaje) de la barra lateral. La llave se guardará de forma segura en el `localStorage` de tu navegador.

### Obtener Unsplash Access Key:
1. Ingresa a [unsplash.com/developers](https://unsplash.com/developers).
2. Haz clic en **Register as a Developer** e inicia sesión.
3. Presiona el botón **New Application**, acepta los términos de uso y ponle nombre a tu proyecto (ej: "DesignHub").
4. En el panel de control de tu aplicación recién creada, desplázate hacia abajo hasta la sección **Keys** y copia el **Access Key** generado.

---

## 💻 Despliegue en GitHub Pages

Al tratarse de una aplicación basada puramente en el lado del cliente (HTML, CSS y JS nativo), subirla y alojarla de forma gratuita en GitHub Pages es sumamente fácil.

### Requisitos Previos
Tener instalado Git y poseer una cuenta activa en [GitHub](https://github.com/).

### Pasos para Subir y Desplegar:

1. **Inicializar el repositorio local y confirmar los archivos:**
   Abre tu terminal en el directorio raíz de DesignHub y ejecuta:
   ```bash
   git init
   git add .
   git commit -m "feat: initial commit DesignHub project"
   ```

2. **Crear un repositorio vacío en GitHub:**
   - Ve a GitHub y haz clic en **New Repository**.
   - Nómbralo `DesignHub`. Deja las opciones de inicialización (README, gitignore, licencia) sin marcar.
   - Copia la URL del repositorio remoto (ej. `https://github.com/tu-usuario/DesignHub.git`).

3. **Vincular y subir el código:**
   En tu terminal, introduce los siguientes comandos (reemplazando la URL por la tuya):
   ```bash
   git branch -M main
   git remote add origin https://github.com/tu-usuario/DesignHub.git
   git push -u origin main
   ```

4. **Configurar GitHub Pages:**
   - Ve a la página de tu repositorio en GitHub.
   - Entra en la pestaña **Settings** (Configuración) en la barra de herramientas del proyecto.
   - En el menú lateral izquierdo, haz clic en **Pages**.
   - Bajo la sección **Build and deployment**, en el menú desplegable **Source**, selecciona **Deploy from a branch**.
   - En el selector de rama, escoge `main` (o la rama principal) y en el selector de carpeta escoge `/ (root)`.
   - Haz clic en **Save** (Guardar).

¡Listo! En unos segundos GitHub procesará el proyecto y te proporcionará una URL pública (ej: `https://tu-usuario.github.io/DesignHub/`) para que puedas acceder a la plataforma desde cualquier dispositivo móvil o de escritorio.
