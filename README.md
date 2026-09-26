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
| Las fotos y sus textos | `recuerdos.galeria` (una sola lista — ver abajo) |
| Cómo se llama el grupo de fotos previas a la relación | `recuerdos.etiquetaPrevia` |
| El texto de la carta | `carta.parrafos` |

> Con la fecha actual del archivo (`2026-07-04`) la clave por defecto es **040726**.
> Es un placeholder elegido para que la web se vea igual que el diseño original.

### Fotos y videos

`recuerdos.galeria` es la ÚNICA lista de recuerdos — no hay una lista
aparte para "destacados". Copia las imágenes en `assets/fotos/` (o los
videos en `assets/videos/`) y apuntá a ellas desde `config.js` con
`foto: '...'` o `video: '...'`. Mientras un archivo no exista se
muestra un marcador gris en su lugar — la web nunca se rompe por una
foto que falta.

**O más fácil: hacé todo directo desde la web**, sin tocar código —
disponible para cualquiera que entre con el PIN, no solo para quien
armó la web:

- **"Añadir Nuevo Recuerdo"**: elegís una foto o video, la fecha a la
  que corresponde, y arrastrás la previsualización para elegir qué
  parte se prioriza si el recorte automático no la deja ver bien.
- **El lápiz dentro de cualquier recuerdo** (abrilo tocándolo, después
  tocá el lápiz arriba a la izquierda): edita título, nota, fecha,
  encuadre, le cambia la foto/video, o lo elimina.
- **La estrella** en cada foto de la galería la marca (o desmarca) como
  "destacada" — hasta un máximo de 5 a la vez aparecen arriba, en el
  carrusel grande. Marcá otra distinta para "rotar" cuál se destaca.
- **El corazón** la marca como favorita — se ve para los dos, en
  cualquier dispositivo (ver "Favoritos compartidos" más abajo).

Todo esto se sube a Cloudinary (gratis, con compresión automática).
Ver `js/config.js` (bloque `cloudinary`) para los detalles técnicos.

Cada foto/video se agrupa sola por mes de relación ("Mes 1", "Mes
2"...) según su fecha real, contando desde `fechaInicio`. Las que sean
de antes de esa fecha se agrupan aparte, bajo `recuerdos.etiquetaPrevia`.

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
- **Favoritas de "Razones" persistentes.** Se guardan en `localStorage`
  del dispositivo — cada quien ve las suyas en su propio navegador.
- **Cambios de "Recuerdos" compartidos, sin login.** A diferencia de las
  razones, en Recuerdos el corazón (favorito), la estrella (destacado),
  las ediciones y los borrados se guardan para los dos (en cualquier
  dispositivo), no solo en el navegador de quien los tocó. Usa un
  archivo en Cloudinary más una función de Netlify que lo actualiza de
  forma segura (ver "Publicar" abajo) — nadie necesita crear cuenta
  ni ingresar contraseña para que funcione.

---

## Publicar

Al ser estática, se sube arrastrando la carpeta a Netlify, Vercel,
GitHub Pages o cualquier hosting — no hace falta build ni instalar nada.

**Excepción: si querés que los cambios en "Recuerdos" (favoritos,
destacados, ediciones, borrados) se vean iguales para los dos —no solo
en el navegador de quien los hizo—, hace falta desplegar en Netlify**
(por la función en `netlify/functions/recuerdos.js`) y configurar una
única variable de entorno, una sola vez:

1. Dashboard de Netlify → tu sitio → **Site configuration → Environment
   variables** → agregar:
   - Nombre: `CLOUDINARY_URL`
   - Valor: el mismo que tenés en tu `.env` local (`cloudinary://API_KEY:API_SECRET@CLOUD_NAME`)
2. Volver a desplegar el sitio una vez para que la tome.

Sin este paso, la web funciona igual en todo lo demás — subir fotos,
verlas, editarlas, ajustar el encuadre — solo que esos cambios en
"Recuerdos" quedan guardados nada más en el navegador de quien los
hizo, no compartidos.

Antes de enviarla como regalo, recuerda:

1. Poner la `fechaInicio` real.
2. Añadir las fotos y la canción.
