/* ============================================================
   CONFIGURACIÓN DE TAILWIND — usada solo para compilar css/tailwind.css
   ------------------------------------------------------------
   Antes, cada página cargaba el "Play CDN" de Tailwind
   (cdn.tailwindcss.com), que compila los estilos EN EL NAVEGADOR
   de quien visita la web, cada vez que el contenido de la página
   cambia (por ejemplo, al abrir un modal o repintar la galería).
   Eso es cómodo para probar cosas rápido, pero Tailwind mismo
   avisa que no está pensado para producción — y en un sitio como
   este, que repinta la galería y el carrusel todo el tiempo, hacía
   que el celular tuviera que recompilar CSS constantemente. Por
   eso ahora el CSS se compila UNA VEZ acá (con este archivo) y la
   web solo carga el resultado ya listo (css/tailwind.css) — el
   navegador de quien la visita no tiene que compilar nada.

   El tema (colores, tipografías, medidas) es el mismo que antes
   vivía en js/theme.js — ese archivo ya no se carga en la web,
   queda como referencia. Si algún día cambiás un color o tamaño,
   cambialo ACÁ y volvé a correr `npm run build:css` (ver README).
   ============================================================ */

module.exports = {
  darkMode: 'class',
  content: ['./*.html', './js/*.js'],

  // Estas clases se arman con JavaScript pegando texto (por ejemplo
  // `bg-${item.acento}/20`, donde `acento` puede ser 'primary',
  // 'secondary' o 'tertiary' — ver recuerdos.html, tiempo.html y
  // carta.html). Como Tailwind compila leyendo los archivos de texto
  // y no sabe qué va a valer esa variable en el navegador, hay que
  // decirle a mano cuáles existen para que no las borre pensando que
  // no se usan. Si agregás un color nuevo a esas listas en config.js
  // (fuera de primary/secondary/tertiary), agregalo también acá.
  safelist: [
    'text-primary', 'text-secondary', 'text-tertiary',
    'text-primary/40', 'text-secondary/40', 'text-tertiary/40',
    'bg-primary/15', 'bg-secondary/15', 'bg-tertiary/15',
    'bg-primary/20', 'bg-secondary/20', 'bg-tertiary/20',
    'border-primary/20', 'border-secondary/20', 'border-tertiary/20',
    'border-primary/30', 'border-secondary/30', 'border-tertiary/30',
    'hover:border-primary/30', 'hover:border-secondary/30', 'hover:border-tertiary/30',
    'md:group-hover:text-primary', 'md:group-hover:text-secondary', 'md:group-hover:text-tertiary',
  ],

  theme: {
    extend: {
      colors: {
        'surface-variant': '#363340',
        'secondary-fixed': '#f0dbff',
        'on-secondary': '#490081',
        'on-tertiary': '#00354a',
        'on-surface-variant': '#dac0c9',
        'on-primary-fixed': '#3d0026',
        'on-primary': '#620040',
        'on-tertiary-container': '#003a51',
        'surface-container-lowest': '#0f0d18',
        'background': '#14121d',
        'on-tertiary-fixed': '#001e2c',
        'secondary': '#ddb8ff',
        'outline': '#a28a93',
        'inverse-primary': '#a43073',
        'on-secondary-fixed-variant': '#62259b',
        'surface-container-highest': '#363340',
        'surface-container': '#201e2a',
        'on-surface': '#e6e0f1',
        'error': '#ffb4ab',
        'surface-container-high': '#2b2835',
        'outline-variant': '#544249',
        'error-container': '#93000a',
        'secondary-container': '#62259b',
        'primary-container': '#f472b6',
        'tertiary-fixed-dim': '#7bd0ff',
        'on-background': '#e6e0f1',
        'on-primary-fixed-variant': '#85145a',
        'primary': '#ffafd3',
        'surface-container-low': '#1c1a26',
        'on-primary-container': '#6d0047',
        'primary-fixed': '#ffd8e7',
        'on-secondary-container': '#d1a1ff',
        'inverse-surface': '#e6e0f1',
        'secondary-fixed-dim': '#ddb8ff',
        'surface-bright': '#3a3744',
        'tertiary-fixed': '#c4e7ff',
        'tertiary': '#7bd0ff',
        'surface-dim': '#14121d',
        'primary-fixed-dim': '#ffafd3',
        'on-secondary-fixed': '#2c0051',
        'tertiary-container': '#0aaae4',
        'on-error': '#690005',
        'on-tertiary-fixed-variant': '#004c69',
        'surface': '#14121d',
        'inverse-on-surface': '#312f3b',
        'on-error-container': '#ffdad6',
        'surface-tint': '#ffafd3',
      },
      borderRadius: {
        DEFAULT: '0.25rem',
        lg: '0.5rem',
        xl: '0.75rem',
        full: '9999px',
      },
      spacing: {
        'space-2xs': '0.25rem',
        'space-xs': '0.5rem',
        'space-sm': '0.75rem',
        'space-md': '1rem',
        'space-lg': '1.5rem',
        'space-xl': '2rem',
        'space-2xl': '3rem',
        'space-3xl': '4rem',
        'gutter-mobile': '1rem',
        'gutter-desktop': '2rem',
        'container-max': '72rem',
      },
      fontFamily: {
        'display': ['Playfair Display', 'serif'],
        'display-mobile': ['Playfair Display', 'serif'],
        'headline-lg': ['Playfair Display', 'serif'],
        'headline-lg-mobile': ['Playfair Display', 'serif'],
        'headline-md': ['Playfair Display', 'serif'],
        'title-lg': ['Plus Jakarta Sans', 'sans-serif'],
        'body-lg': ['Plus Jakarta Sans', 'sans-serif'],
        'body-md': ['Plus Jakarta Sans', 'sans-serif'],
        'label-md': ['Plus Jakarta Sans', 'sans-serif'],
        'label-sm': ['Plus Jakarta Sans', 'sans-serif'],
      },
      fontSize: {
        'display': ['56px', { lineHeight: '68px', letterSpacing: '-0.02em', fontWeight: '600' }],
        'display-mobile': ['36px', { lineHeight: '44px', letterSpacing: '-0.01em', fontWeight: '600' }],
        'headline-lg': ['36px', { lineHeight: '46px', fontWeight: '500' }],
        'headline-lg-mobile': ['28px', { lineHeight: '36px', fontWeight: '500' }],
        'headline-md': ['24px', { lineHeight: '32px', fontWeight: '500' }],
        'title-lg': ['20px', { lineHeight: '28px', letterSpacing: '-0.01em', fontWeight: '600' }],
        'body-lg': ['16px', { lineHeight: '26px', fontWeight: '400' }],
        'body-md': ['14px', { lineHeight: '22px', fontWeight: '400' }],
        'label-md': ['13px', { lineHeight: '18px', letterSpacing: '0.04em', fontWeight: '600' }],
        'label-sm': ['11px', { lineHeight: '16px', letterSpacing: '0.08em', fontWeight: '500' }],
      },
    },
  },

  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/container-queries'),
  ],
};
