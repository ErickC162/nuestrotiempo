/* ============================================================
   NUESTRO TIEMPO — Núcleo compartido
   Cálculo de tiempo, plantillas comunes (fondo, barra superior,
   navegación inferior), control de acceso y reproductor.
   No necesitas editar este archivo: todo sale de config.js.
   ============================================================ */

(function () {
  'use strict';

  const cfg = window.COSMIC;
  const CLAVE_SESION = 'cosmic:acceso';

  /* ── Tiempo ───────────────────────────────────────────── */

  const inicio = new Date(cfg.fechaInicio + 'T00:00:00');

  function calcularTiempo(ahora = new Date()) {
    const ms = Math.max(0, ahora - inicio);

    // Meses y años de calendario reales (no aproximados por 30 días)
    let años = ahora.getFullYear() - inicio.getFullYear();
    let meses = ahora.getMonth() - inicio.getMonth();
    let diasDelMes = ahora.getDate() - inicio.getDate();

    if (diasDelMes < 0) {
      meses--;
      const finMesAnterior = new Date(ahora.getFullYear(), ahora.getMonth(), 0).getDate();
      diasDelMes += finMesAnterior;
    }
    if (meses < 0) { años--; meses += 12; }

    const totalSegundos = Math.floor(ms / 1000);

    return {
      años,
      meses,                                   // meses dentro del año en curso
      mesesTotales: años * 12 + meses,         // meses acumulados desde el inicio
      diasDelMes,
      diasTotales: Math.floor(ms / 86400000),
      horasTotales: Math.floor(ms / 3600000),
      horas: Math.floor(totalSegundos / 3600) % 24,
      minutos: Math.floor(totalSegundos / 60) % 60,
      segundos: totalSegundos % 60,
    };
  }

  const pad = (n) => String(n).padStart(2, '0');
  const miles = (n) => n.toLocaleString('es-ES');

  /** "2 Meses" o, si aún no se cumple 1 mes, "45 Días" (sin la palabra "Juntos").
   *  Pensado para insertarse dentro de una frase: "Feliz {hito}, mi cielo". */
  function hito() {
    const t = calcularTiempo();
    if (t.mesesTotales) return t.mesesTotales === 1 ? '1 Mes' : `${t.mesesTotales} Meses`;
    return t.diasTotales === 1 ? '1 Día' : `${miles(t.diasTotales)} Días`;
  }

  /** Sustituye {dias}, {horas}, {meses}, {años}, {hito} y {nombre} en un texto. */
  function texto(plantilla) {
    const t = calcularTiempo();
    return String(plantilla)
      .replace(/\{dias\}/g, miles(t.diasTotales))
      .replace(/\{horas\}/g, miles(t.horasTotales))
      .replace(/\{meses\}/g, t.mesesTotales)
      .replace(/\{a[nñ]os\}/g, t.años)
      .replace(/\{hito\}/g, hito())
      .replace(/\{nombre\}/g, cfg.app.para);
  }

  /** "2 Meses Juntos" / "1 Año y 3 Meses Juntos" */
  function tituloHito() {
    const t = calcularTiempo();
    const partes = [];
    if (t.años) partes.push(t.años === 1 ? '1 Año' : `${t.años} Años`);
    if (t.meses) partes.push(t.meses === 1 ? '1 Mes' : `${t.meses} Meses`);
    if (!partes.length) partes.push(t.diasTotales === 1 ? '1 Día' : `${t.diasTotales} Días`);
    return partes.join(' y ') + ' Juntos';
  }

  /** "2 Meses • 60 Días Juntos" */
  function etiquetaHito() {
    const t = calcularTiempo();
    const m = t.mesesTotales;
    const cabeza = m ? (m === 1 ? '1 Mes' : `${m} Meses`) : null;
    const cola = `${miles(t.diasTotales)} Días Juntos`;
    return cabeza ? `${cabeza} • ${cola}` : cola;
  }

  function fechaLarga(d = inicio) {
    return d.toLocaleDateString('es-ES', { day: 'numeric', month: 'long' });
  }

  /** Convierte 'AAAA-MM-DD' en algo corto para mostrar, ej. "12 May".
   *  Acepta también un objeto Date directamente.                       */
  function fechaCorta(fecha) {
    const d = fecha instanceof Date ? fecha : new Date(`${fecha}T00:00:00`);
    if (isNaN(d)) return '';
    const texto = d.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' });
    // Pone en mayúscula la primera LETRA (no el día, que también es \w)
    return texto.replace(/[a-záéíóúñ]/i, (l) => l.toUpperCase()).replace(/\.$/, '');
  }

  /** ¿En qué "mes de relación" (1, 2, 3…) cae una fecha, contando desde
   *  `cfg.fechaInicio`? Usa el mismo cálculo de meses de calendario que
   *  el resto del sitio (calcularTiempo). Si la fecha es anterior al
   *  inicio de la relación, devuelve 0 — significa "todavía no éramos
   *  nosotros", y quien llama debe tratarlo aparte (ver recuerdos.html). */
  function mesDeRelacion(fecha) {
    const d = fecha instanceof Date ? fecha : new Date(`${fecha}T00:00:00`);
    if (isNaN(d) || d < inicio) return 0;
    return calcularTiempo(d).mesesTotales + 1;
  }

  /* ── Acceso (PIN) ─────────────────────────────────────── */

  /** PIN efectivo: el de config, o DDMMAA derivado de fechaInicio. */
  function pinEsperado() {
    if (cfg.acceso.pin) return String(cfg.acceso.pin);
    return pad(inicio.getDate()) + pad(inicio.getMonth() + 1) + String(inicio.getFullYear()).slice(-2);
  }

  const acceso = {
    concedido: () => sessionStorage.getItem(CLAVE_SESION) === '1',
    conceder: () => { try { sessionStorage.setItem(CLAVE_SESION, '1'); } catch (e) {} },
    revocar: () => { try { sessionStorage.removeItem(CLAVE_SESION); } catch (e) {} },
    /** Redirige al portal si aún no se ha entrado. */
    exigir() {
      if (!this.concedido()) location.replace('index.html');
    },
  };

  /* ── Plantillas compartidas ───────────────────────────── */

  /** Capa atmosférica: nebulosas difusas + polvo de estrellas. */
  function fondoCosmico() {
    return `
      <div class="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
        <div class="cosmic-halo absolute -top-32 md:-top-40 left-1/2 md:left-1/4 -translate-x-1/2 w-[420px] h-[420px] md:w-[600px] md:h-[600px] rounded-full bg-secondary-container/20 blur-[110px] md:blur-[130px]"></div>
        <div class="cosmic-halo absolute top-[38%] md:top-1/3 -right-28 md:-right-20 w-[320px] h-[320px] md:w-[500px] md:h-[500px] rounded-full bg-primary-container/15 blur-[120px] md:blur-[140px]" style="animation-delay:-4s"></div>
        <div class="cosmic-halo absolute bottom-16 md:-bottom-32 -left-24 md:left-10 w-[340px] h-[340px] md:w-[700px] md:h-[700px] rounded-full bg-surface-variant/30 md:bg-tertiary/10 blur-[100px] md:blur-[150px]" style="animation-delay:-7s"></div>
        <div class="absolute inset-0 stardust-bg opacity-20"></div>
        <div class="absolute top-24 left-8 md:left-[8%] w-1 h-1 rounded-full bg-secondary-fixed twinkle-1"></div>
        <div class="absolute top-36 right-12 w-1.5 h-1.5 rounded-full bg-primary-fixed twinkle-2"></div>
        <div class="absolute top-2/3 left-1/4 w-1 h-1 rounded-full bg-tertiary-fixed twinkle-3"></div>
        <div class="absolute top-1/2 right-1/4 w-1 h-1 rounded-full bg-secondary twinkle-1"></div>
        <div class="absolute bottom-36 left-12 md:left-1/3 w-1.5 h-1.5 rounded-full bg-primary twinkle-2"></div>
        <div class="hidden md:block absolute top-96 right-1/4 w-1 h-1 rounded-full bg-white/50"></div>
        <div class="hidden md:block absolute bottom-96 right-[20%] w-1.5 h-1.5 rounded-full bg-primary/50 blur-[0.5px]"></div>
        <div class="hidden md:block absolute top-48 left-[16%] w-1.5 h-1.5 rounded-full bg-primary/40 blur-[0.5px]"></div>
      </div>`;
  }

  /** Barra superior.
   *  <1024px: alto 56px, marca + cápsula de música (la navegación va abajo).
   *  ≥1024px: alto 80px, marca + enlaces + iconos.
   *  El corte es `lg` y no `md` porque a 768–1023px los cuatro enlaces
   *  no caben junto a la marca sin apelotonarse.                        */
  function barraSuperior(activa) {
    const enlaces = cfg.nav.map((item) => {
      const esActiva = item.id === activa;
      const clases = esActiva
        ? 'text-primary font-semibold border-b-2 border-primary'
        : 'text-on-surface-variant hover:text-primary border-b-2 border-transparent';
      return `<a href="${item.href}" class="whitespace-nowrap pb-1 transition-all duration-300 ${clases}">${item.etiquetaLarga || item.etiqueta}</a>`;
    }).join('');

    return `
      <header class="fixed top-0 left-0 right-0 w-full z-50 bg-surface/80 lg:bg-surface-container-lowest/80 backdrop-blur-md border-b border-outline-variant/20 lg:border-b-0 shadow-sm lg:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.7)]">
        <div class="flex justify-between items-center w-full h-14 lg:h-20 px-space-md md:px-8 lg:px-12 max-w-container-max mx-auto">

          <a href="tiempo.html" class="flex items-center gap-2 shrink-0 active:scale-95 transition-transform duration-150">
            <span class="material-symbols-outlined fill-icon text-primary lg:text-2xl">auto_awesome</span>
            <span class="font-display tracking-tight text-primary whitespace-nowrap text-title-lg lg:text-headline-md lg:font-semibold">${cfg.app.marca}</span>
          </a>

          <!-- Enlaces: desde 1024px -->
          <nav class="hidden lg:flex items-center gap-8 text-label-md font-label-md">
            ${enlaces}
          </nav>

          <div class="flex items-center gap-2 lg:gap-3">
            <!-- Control de volumen (solo cuando hay música) -->
            ${cfg.musica.src ? `
            <div class="flex items-center gap-2 hidden lg:flex mr-2">
              <span class="material-symbols-outlined text-on-surface-variant text-[16px]">volume_down</span>
              <input type="range" data-audio-volume min="0" max="1" step="0.01" value="0.25" 
                     class="w-16 lg:w-20 accent-primary cursor-pointer" title="Volumen">
            </div>` : ''}

            <!-- Cápsula de música: hasta 1023px -->
            <button type="button" data-audio-toggle title="${cfg.musica.etiqueta}"
                    class="lg:hidden flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-container-high/60 border border-secondary/20 hover:border-primary-container/40 active:scale-95 transition-all">
              <span class="material-symbols-outlined text-[14px] text-tertiary">music_note</span>
              <span class="text-label-sm font-label-sm tracking-wide text-secondary hidden sm:inline">${cfg.musica.etiqueta}</span>
              <span class="material-symbols-outlined text-[14px] text-primary" data-audio-icon>play_circle</span>
            </button>

            <!-- Botón de música: desde 1024px -->
            <button type="button" data-audio-toggle aria-label="${cfg.musica.etiqueta}"
                    class="hidden lg:flex w-10 h-10 rounded-full items-center justify-center text-on-surface-variant hover:text-primary bg-surface-container-low/60 hover:bg-surface-container-high transition-all duration-300 active:scale-95">
              <span class="material-symbols-outlined text-xl" data-audio-icon data-play="music_note" data-pausa="pause">music_note</span>
            </button>

            <button type="button" data-cerrar-sesion aria-label="Cerrar el portal"
                    class="p-2 lg:p-0 lg:w-10 lg:h-10 rounded-full flex items-center justify-center text-primary lg:text-on-surface-variant hover:text-primary hover:bg-surface-variant/30 lg:bg-surface-container-low/60 lg:hover:bg-surface-container-high transition-all duration-300 active:scale-95">
              <span class="material-symbols-outlined fill-icon lg:text-xl">favorite</span>
            </button>
          </div>
        </div>
      </header>`;
  }

  /** Navegación inferior. Hasta 1023px — desde ahí la sustituyen los enlaces de arriba. */
  function navegacion(activa) {
    const items = cfg.nav.map((item) => {
      const esActiva = item.id === activa;
      const clases = esActiva
        ? 'text-primary font-medium'
        : 'text-on-surface-variant hover:text-primary';
      const icono = esActiva
        ? `<span class="material-symbols-outlined fill-icon text-[22px]">${item.icono}</span>`
        : `<span class="material-symbols-outlined text-[22px]">${item.icono}</span>`;
      const punto = esActiva
        ? '<span class="w-1 h-1 rounded-full bg-primary absolute -bottom-0.5"></span>'
        : '';
      return `
        <a href="${item.href}" class="relative flex flex-col items-center justify-center py-1 transition-colors active:scale-90 duration-150 ${clases}">
          ${icono}
          <span class="text-label-sm font-label-sm mt-0.5 ${esActiva ? 'font-bold' : ''}">${item.etiqueta}</span>
          ${punto}
        </a>`;
    }).join('');

    return `
      <nav class="lg:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-space-xs py-space-2xs pb-safe max-w-container-max mx-auto bg-surface-container-lowest/85 backdrop-blur-lg border-t border-outline-variant/20 shadow-lg">
        ${items}
      </nav>`;
  }

  /** Pie de página. Desde 1024px (por debajo, la barra inferior lo taparía). */
  function piePagina() {
    const t = calcularTiempo();
    const hito = t.mesesTotales
      ? (t.mesesTotales === 1 ? '1 Mes' : `${t.mesesTotales} Meses`)
      : `${miles(t.diasTotales)} Días`;

    return `
      <footer class="hidden lg:block relative z-10 w-full py-8 bg-surface-container-lowest/60 backdrop-blur-sm border-t border-outline-variant/20">
        <div class="flex flex-col sm:flex-row justify-between items-center max-w-container-max mx-auto px-12 gap-4">
          <span class="font-display text-title-lg text-primary flex items-center gap-1.5">
            <span class="material-symbols-outlined fill-icon text-lg">auto_awesome</span>
            ${cfg.app.marca}
          </span>
          <p class="text-label-sm font-label-sm text-on-surface-variant text-center">
            ${cfg.app.marca} • ${hito} Juntos
          </p>
          <nav class="flex items-center gap-6 text-label-sm font-label-sm">
            <a href="tiempo.html" class="text-on-surface-variant hover:text-primary transition-colors duration-200">Nuestra Historia</a>
            <a href="carta.html" class="text-on-surface-variant hover:text-primary transition-colors duration-200">Banda Sonora</a>
            <a href="#" data-cerrar-sesion class="text-on-surface-variant hover:text-primary transition-colors duration-200">Reiniciar Portal</a>
          </nav>
        </div>
      </footer>`;
  }

  /* ── Reproductor de audio ─────────────────────────────── */

  let audio = null;

  function iniciarAudio() {
    const botones = document.querySelectorAll('[data-audio-toggle]');
    if (!botones.length) return;

    if (!cfg.musica.src) {
      // Sin pista configurada: el botón solo alterna el icono (decorativo).
      botones.forEach((b) => b.addEventListener('click', () => alternarIcono()));
      return;
    }

    audio = new Audio(cfg.musica.src);
    audio.loop = true;
    audio.volume = 0.25;

    const controlesVolumen = document.querySelectorAll('[data-audio-volume]');
    controlesVolumen.forEach(slider => {
      slider.addEventListener('input', (e) => {
        if (audio) audio.volume = e.target.value;
      });
    });

    botones.forEach((b) => b.addEventListener('click', () => {
      if (audio.paused) { audio.play().catch(() => {}); } else { audio.pause(); }
      alternarIcono(!audio.paused);
    }));

    if (cfg.musica.autoplay) {
      audio.play().then(() => alternarIcono(true)).catch(() => {});
    }
  }

  let sonando = false;
  function alternarIcono(estado) {
    sonando = estado === undefined ? !sonando : estado;
    document.querySelectorAll('[data-audio-icon]').forEach((i) => {
      i.textContent = sonando
        ? (i.dataset.pausa || 'pause_circle')
        : (i.dataset.play  || 'play_circle');
    });
  }

  /* ── Imágenes con respaldo ────────────────────────────── */

  /** Devuelve el HTML de una foto; si el archivo falta, muestra un marcador.
   *  `alt` va vacío a propósito: el navegador dibujaría el texto alternativo
   *  sobre la tarjeta mientras la imagen falla. El nombre viaja en `title`
   *  y siempre aparece como texto visible junto a la foto.               */
  /** `posicion` (opcional) es un valor CSS `object-position`, ej. '50% 20%':
   *  qué parte de la foto/video se prioriza cuando el recorte automático
   *  (`object-cover`) no deja ver lo importante. Si no se indica, se usa
   *  el centro de siempre — no cambia nada en las fotos que ya tenías.  */
  function foto(src, alt, clases = 'w-full h-full object-cover', posicion) {
    const seguro = String(alt || '').replace(/"/g, '&quot;');
    const estilo = posicion ? ` style="object-position:${String(posicion).replace(/"/g, '')}"` : '';
    return `<img src="${src}" alt="" title="${seguro}" class="${clases}" loading="lazy"${estilo}
                 onerror="Cosmic.fallaFoto(this)">`;
  }

  /** Video de fondo para el carrusel: se reproduce solo, en bucle, sin
   *  sonido y sin ningún control — nadie puede pausarlo, buscar en él
   *  ni verlo a pantalla completa desde el propio reproductor. Si el
   *  archivo falta, usa el mismo marcador gris que las fotos.
   *  `poster` (opcional) es una imagen que se ve mientras carga.
   *  `posicion` (opcional): ver comentario de `foto()` arriba — si no se
   *  indica, se mantiene el encuadre de siempre (50% 15%, algo más arriba
   *  del centro, pensado para bustos/rostros de pie).                   */
  function video(src, alt, clases = 'w-full h-full object-cover', poster, posicion) {
    const seguro = String(alt || '').replace(/"/g, '&quot;');
    const posterAttr = poster ? ` poster="${poster}"` : '';
    const claseObjeto = posicion ? '' : ' object-[50%_15%]';
    const estilo = posicion ? ` style="object-position:${String(posicion).replace(/"/g, '')}"` : '';
    // `src` va directo en <video> (no en un <source> hijo): así el evento
    // `error` se dispara sobre el propio <video> y el marcador de respaldo
    // funciona igual que en las fotos si el archivo no existe.
    return `<video src="${src}" class="${clases}${claseObjeto}" title="${seguro}" aria-label="${seguro}"
                   autoplay muted loop playsinline preload="auto"
                   disablepictureinpicture disableremoteplayback
                   oncontextmenu="return false"
                   onerror="Cosmic.fallaFoto(this)"${posterAttr}${estilo}></video>`;
  }

  /** Foto o video de un recuerdo: usa `item.video` si existe; si no, `item.foto`.
   *  Así un mismo carrusel puede mezclar fotos y videos sin distinción.
   *  Si el recuerdo tiene `item.posicion` (ver `foto()`), se respeta.   */
  function medio(item, clases = 'w-full h-full object-cover') {
    return item.video
      ? video(item.video, item.titulo, clases, item.poster, item.posicion)
      : foto(item.foto, item.titulo, clases, item.posicion);
  }

  function marcadorFoto() {
    const div = document.createElement('div');
    div.className = 'w-full h-full foto-placeholder';
    div.innerHTML = '<span class="material-symbols-outlined text-[28px] opacity-50">image</span>';
    return div;
  }

  function fallaFoto(img) {
    img.replaceWith(marcadorFoto());
  }

  /* ── Montaje automático ───────────────────────────────── */

  function montar() {
    const cuerpo = document.body;
    const pagina = cuerpo.dataset.pagina;

    if (cuerpo.dataset.fondo !== 'no') {
      cuerpo.insertAdjacentHTML('afterbegin', fondoCosmico());
    }
    if (cuerpo.dataset.chrome !== 'no') {
      cuerpo.insertAdjacentHTML('afterbegin', barraSuperior(pagina));
      cuerpo.insertAdjacentHTML('beforeend', piePagina() + navegacion(pagina));
    }
    iniciarAudio();

    // Cerrar el portal: vuelve a pedir la clave.
    document.querySelectorAll('[data-cerrar-sesion]').forEach((b) =>
      b.addEventListener('click', (e) => {
        e.preventDefault();
        acceso.revocar();
        location.href = 'index.html';
      }));
  }

  /* ── API pública ──────────────────────────────────────── */

  window.Cosmic = {
    cfg, inicio,
    tiempo: calcularTiempo,
    texto, tituloHito, etiquetaHito, hito, fechaLarga, fechaCorta, mesDeRelacion,
    pad, miles,
    pinEsperado, acceso,
    fondoCosmico, barraSuperior, navegacion, piePagina,
    foto, video, medio, marcadorFoto, fallaFoto,
    montar,
    /** Elemento <audio> compartido (null si no hay pista en config). */
    audio: () => audio,
  };

  document.addEventListener('DOMContentLoaded', montar);
})();
