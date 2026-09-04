# Nuestro Tiempo

Web construida a partir del proyecto de Google Stitch
*Regalo Digital Violeta* (ID `3079186228867308853`),
siguiendo tanto los diseños móviles como los de escritorio.

HTML estático + Tailwind por CDN. **No necesita build ni `npm install`.**

## Responsive: tres tamaños

| Ancho | Navegación | Disposición |
|---|---|---|
| `< 768px` — móvil | Barra inferior de 4 pestañas | Una columna, tarjetas compactas |
| `768–1023px` — tablet | Barra inferior (los 4 enlaces no caben arriba) | Dos columnas, tarjetas amplias |
| `≥ 1024px` — escritorio | Enlaces en la barra superior + pie de página | Rejillas completas: contador de 6, bento 7/5, carta 8/4 |

Cada página lleva ambas versiones en el mismo HTML y alterna con las clases
`md:` / `lg:` de Tailwind. No hay archivos separados por dispositivo.

---

## Cómo verla

Abrir `index.html` directamente funciona, pero para que el guardián de
acceso y las rutas se comporten como en producción conviene servirla:

```bash
python -m http.server 5500
```

Y entrar en `http://localhost:5500`.

---

## Personalizar

**Todo se edita en un único archivo: [`js/config.js`](js/config.js).**

| Quiero cambiar… | Dónde |
|---|---|
| La fecha de aniversario (mueve TODOS los contadores) | `fechaInicio` |
| La clave de acceso | `acceso.pin` (`null` = se genera como DDMMAA desde la fecha) |
| La canción | `musica.src` → un mp3 en `assets/audio/` |
| Las razones (y desde cuándo se desbloquean) | `razones.lista` y `razones.fechaInicio` |
| Las fotos y sus textos | `recuerdos.destacados` y `recuerdos.galeria` |
| El texto de la carta | `carta.parrafos` |

> Con la fecha actual del archivo (`2026-07-04`) la clave por defecto es **040726**.
> Es un placeholder elegido para que la web se vea igual que el diseño original.

### Fotos

Copia las imágenes en `assets/fotos/` y apunta a ellas desde `config.js`.
Mientras un archivo no exista se muestra un marcador gris en su lugar —
la web nunca se rompe por una foto que falta.

### Videos en el carrusel

El carrusel de "Momentos Destacados" (en Recuerdos) también acepta
videos, mezclados con las fotos en el mismo carrusel — no es algo aparte.

En `recuerdos.destacados`, cambia `foto: '...'` por `video: '...'`
apuntando a un mp4 en `assets/videos/`. El video se reproduce solo,
en bucle, sin sonido y sin ningún control: nadie puede pausarlo,
buscar en él ni activarle el audio — es completamente automático.
Ya hay un elemento de ejemplo en `config.js` para copiar y editar.

---

## Estructura

```
index.html        Portal de acceso (PIN)
tiempo.html       Contador en vivo, hitos y meta
razones.html      Razones con desbloqueo diario y favoritas
recuerdos.html    Destacados, galería y visor a pantalla completa
carta.html        Carta, reproductor y panel de acciones

js/config.js      ← EL ÚNICO ARCHIVO QUE NECESITAS TOCAR
js/theme.js       Paleta y tipografía del design system de Stitch
js/common.js      Fondo, barra superior, navegación, pie, acceso, audio
css/cosmic.css    Animaciones y superficies de cristal

assets/fotos/     Tus imágenes
assets/videos/    Tus videos (para el carrusel de destacados)
assets/audio/     Tu canción

stitch/html/               Diseños móviles originales (referencia)
stitch/html-desktop/       Diseños de escritorio originales (referencia)
stitch/screenshots*/       Capturas de ambos (referencia)
```

---

## Cómo funciona por dentro

- **Todo deriva de `fechaInicio`.** Los títulos ("2 Meses Juntos"), el
  cronómetro, el progreso, el número de capítulo de la carta y la clave
  se recalculan solos. No hay cifras escritas a mano.
- **Desbloqueo diario de razones, con calendario propio.** Se revela una
  razón por cada día transcurrido desde `razones.fechaInicio` (independiente
  de la `fechaInicio` general de arriba). Si escribes 100 razones, tardarán
  100 días en verse todas. Antes de esa fecha no se ve ninguna todavía.
  Desactívalo con `razones.desbloqueoDiario: false`.
- **Acceso por sesión.** La clave se pide una vez por pestaña
  (`sessionStorage`). Al cerrarla vuelve a pedirse.
- **Favoritas persistentes.** Se guardan en `localStorage` del dispositivo.

---

## Publicar

Al ser estática, se sube arrastrando la carpeta a Netlify Drop, Vercel,
GitHub Pages o cualquier hosting. No hace falta configurar nada.

Antes de enviarla como regalo, recuerda:

1. Poner la `fechaInicio` real.
2. Añadir las fotos y la canción.
