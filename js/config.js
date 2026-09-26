/* ============================================================
   NUESTRO TIEMPO — ARCHIVO DE CONFIGURACIÓN
   ------------------------------------------------------------
   Este es el ÚNICO archivo que necesitas tocar para personalizar
   la web. Todo lo demás (páginas, estilos, contadores) se genera
   a partir de aquí.
   ============================================================ */

window.COSMIC = {

  /* ── 1. IDENTIDAD ──────────────────────────────────────── */
  app: {
    marca: 'Nuestro Tiempo',
    para: 'Juli',
    firma: 'Tu estimado novio',
  },

  /* ── 2. LA FECHA (el corazón de todo) ──────────────────────
     Formato AAAA-MM-DD. De aquí salen TODOS los contadores,
     los títulos ("2 Meses Juntos"), el progreso y el PIN.
     ▸ Valor actual = placeholder a ~2 meses atrás, para que la web
       se vea igual que el diseño de Stitch. CÁMBIALO.
     ▸ Con este valor, el PIN por defecto es 040726 (DDMMAA).      */
  fechaInicio: '2026-07-04',

  /* ── 3. PANTALLA DE ACCESO ─────────────────────────────── */
  acceso: {
    // null  → el PIN se genera solo desde fechaInicio como DDMMAA
    // '1234' → o pon aquí la clave que quieras (string de dígitos)
    pin: null,
  },

  /* ── 4. MÚSICA ─────────────────────────────────────────── */
  musica: {
    titulo: 'Mirrors',
    subtitulo: 'Banda sonora de nuestro día',
    etiqueta: 'Nuestra Canción',
    // Pon aquí un mp3 en assets/audio/ y sonará de verdad.
    // Si lo dejas en null, el reproductor es solo decorativo.
    src: 'assets/audio/mirrors.mp3', // ej: 'assets/audio/nuestra-cancion.mp3'
    autoplay: false,
  },

  /* ── 5. PÁGINA "TIEMPO" ────────────────────────────────── */
  tiempo: {
    etiqueta: 'Nuestra Historia de Amor',
    titulo: 'Nuestro Tiempo Juntos',          // móvil
    tituloAmplio: 'Nuestro Tiempo',           // escritorio: título…
    tituloDestacado: 'Juntos',                // …+ palabra en degradado
    // {dias} se sustituye por el número real de días
    subtitulo: '{dias} días construyendo algo nuestro, latido a latido.',
    subtituloAmplio: '{dias} días construyendo algo nuestro, aprendiendo a movernos en sincronía y latiendo al mismo compás entre tantos buenos recuerdos.',

    // Pie de cada tarjeta del cronómetro (solo se ve en escritorio)
    piesContador: {
      años: 'El Comienzo',
      meses: 'Completados',
      dias: 'Juntos',
      horas: 'Compartidas',
      minutos: 'Sincronizados',
      segundos: 'En Vivo',
    },

    // Meta de días a alcanzar (mueve la barra de progreso)
    meta: {
      dias: 100,
      titulo: 'Meta: 100 Días de Amor',
      tituloAmplio: 'Meta: 100 Días de Amor',
      descripcion: 'Cada día nos acerca más a nuestro primer centenario de aventuras, crecimiento y ternura incondicional.',
    },

    /* Las 3 tarjetas de hitos.
       `texto` se ve en móvil; `titulo` + `descripcion`, en escritorio.
       Usa {horas} y {dias} para cifras vivas.                        */
    hitos: [
      {
        icono: 'schedule', color: 'primary',
        valor: '{horas}', texto: 'Horas juntos',
        titulo: '{horas} Horas',
        descripcion: 'De amor ininterrumpido, risas compartidas y llamadas infinitas.',
      },
      {
        icono: 'all_inclusive', color: 'secondary',
        valor: '∞', texto: 'Risas sin parar',
        titulo: 'Infinita Complicidad',
        descripcion: 'Conexión que trasciende distancias, miradas y palabras no dichas.',
      },
      {
        icono: 'stars', color: 'tertiary',
        valor: '01', texto: 'Recuerdo Especial',
        titulo: 'Un Recuerdo que Guardamos',
        descripcion: 'Un momento propio, hecho de todo lo que hemos vivido juntos.',
      },
    ],
  },

  /* ── 6. PÁGINA "RAZONES" ───────────────────────────────── */
  razones: {
    titulo: '100 Razones para Amarte',
    subtitulo: 'Llevamos {dias} días juntos, y cada día suma una razón más a nuestra historia.',

    // Fecha en la que se libera la Razón #1 — independiente de la
    // `fechaInicio` de arriba. Formato AAAA-MM-DD. Antes de esta fecha
    // no se ve ninguna razón todavía.
    fechaInicio: '2026-09-04',

    total: 100,              // meta de razones (coincide con lista.length)
    desbloqueoDiario: true,  // se libera 1 razón por día desde razones.fechaInicio

    /* Escribe aquí tus razones, en orden. La #1 es la primera en salir,
       el día de razones.fechaInicio. El sistema desbloquea una por día
       automáticamente a partir de ahí.                                */
    lista: [
      'Por la manera en que haces que hasta el plan más improvisado y sencillo se sienta especial.',
      'Porque, al final del día, simplemente eres tú.',
      'Por cómo me miras cuando crees que no me doy cuenta.',
      'Porque contigo hasta el silencio es cómodo.',
      'Por tu sentido del humor, incluso cuando el chiste es malo.',
      'Porque sabes exactamente cuándo necesito un abrazo.',
      'Por la forma en que te emocionas con las cosas pequeñas.',
      'Porque eres mi lugar seguro después de un día pesado.',
      'Por cómo defiendes lo que crees.',
      'Porque haces que la rutina se sienta como una aventura.',
      'Por tu capacidad de hacerme reír en los peores momentos.',
      'Porque me inspiras a ser una mejor versión de mí mismo.',
      'Por la manera en que te concentras cuando estás trabajando en algo importante.',
      'Porque respetas mi espacio y yo el tuyo.',
      'Por cómo suena mi nombre cuando lo dices tú.',
      'Porque siempre tienes una perspectiva diferente que aportarme.',
      'Por la paciencia que me tienes cuando me frustro.',
      'Porque compartimos memes y nos reímos de las mismas tonterías.',
      'Por tu honestidad, incluso cuando la verdad es incómoda.',
      'Porque no intentas cambiarme, sino que me aceptas como soy.',
      'Por cómo se siente tomar tu mano caminando por la calle.',
      'Porque contigo puedo ser 100% yo mismo, sin filtros.',
      'Por la forma en que resuelves problemas en lugar de ahogarte en ellos.',
      'Porque apoyas mis proyectos y locuras.',
      'Por tus mensajes que me cambian el ánimo en un segundo.',
      'Porque me escuchas de verdad, no solo por cumplir.',
      'Por tu independencia y lo mucho que admiras la mía.',
      'Porque sabes pedir perdón y sabes perdonar.',
      'Por la cara que haces cuando pruebas tu comida favorita.',
      'Porque somos un equipo en cualquier situación.',
      'Por cómo me motivas cuando dudo de mis capacidades.',
      'Porque construimos confianza todos los días.',
      'Por tu voz; simplemente me da paz.',
      'Porque siempre encuentras la forma de sorprenderme.',
      'Por lo fácil que es hablar contigo sobre el futuro.',
      'Porque no necesitamos planes caros para pasar un día increíble.',
      'Por la forma en que tratas a las demás personas.',
      'Porque me haces sentir orgulloso de estar a tu lado.',
      'Por cómo te arreglas el pelo cuando estás distraída.',
      'Porque compartimos el mismo nivel de sarcasmo.',
      'Por la lealtad que me demuestras constantemente.',
      'Porque no idealizamos nuestra relación, sino que la trabajamos.',
      'Por las canciones que me has dedicado o recomendado.',
      'Porque conoces mis defectos y aun así te quedas.',
      'Por la forma en que caminas con tanta seguridad.',
      'Porque me haces cuestionar mis propias ideas para bien.',
      'Por cómo se ilumina tu cara cuando hablas de lo que te apasiona.',
      'Porque me das paz mental.',
      'Por los planes improvisados que terminan siendo los mejores.',
      'Porque sabes darme mi tiempo cuando estoy de mal humor.',
      'Por la calidez de tus abrazos.',
      'Porque contigo el tiempo pasa volando.',
      'Por tu inteligencia y lo mucho que aprendo de ti.',
      'Porque no eres una carga, eres un apoyo.',
      'Por tus ojos y todo lo que transmiten sin hablar.',
      'Porque te preocupas por mi bienestar genuinamente.',
      'Por las miradas cómplices que compartimos cuando estamos rodeados de gente.',
      'Porque no le tienes miedo a decir lo que sientes.',
      'Por la forma en que duermes (incluso cuando intentas robarme las cobijas).',
      'Porque valoras mi tiempo tanto como el tuyo.',
      'Por cómo me calmas cuando el estrés me gana.',
      'Porque nuestras conversaciones pueden ir de lo profundo a lo absurdo en segundos.',
      'Porque celebramos los logros del otro como si fueran propios.',
      'Por la forma en que me haces ver el lado bueno de las cosas.',
      'Porque me has enseñado a ser más paciente.',
      'Porque no me juzgas cuando me equivoco.',
      'Por tu sonrisa, que sigue siendo mi vista favorita.',
      'Porque sabes exactamente qué decir para subirme el ánimo.',
      'Por el respeto mutuo que es la base de lo nuestro.',
      'Porque haces que los domingos por la tarde no sean aburridos.',
      'Por la forma en que defiendes a las personas que quieres.',
      'Porque no necesitamos fingir que todo es perfecto para ser felices.',
      'Por tu creatividad para solucionar las cosas del día a día.',
      'Porque me haces sentir valorado constantemente.',
      'Por las veces que nos hemos reído hasta que nos duele el estómago.',
      'Porque confío en ti con los ojos cerrados.',
      'Por tu determinación cuando te propones una meta.',
      'Porque eres mi contacto de emergencia, literal y emocionalmente.',
      'Por lo bien que nos complementamos, incluso en nuestras diferencias.',
      'Porque siempre dejas espacio para que ambos crezcamos.',
      'Por la tranquilidad que siento cuando sé que te voy a ver.',
      'Porque no tratas de competir conmigo, somos socios.',
      'Por tus pequeñas manías que te hacen única.',
      'Porque recuerdas detalles de mí que ni yo mismo recordaba.',
      'Por cómo me prestas atención cuando te explico algo muy técnico o que me apasiona.',
      'Porque haces que comprometerse no se sienta como un sacrificio.',
      'Por la forma en que pronuncias ciertas palabras.',
      'Porque me has visto en mis peores momentos y decidiste apoyarme.',
      'Por la estabilidad emocional que aportas a mi vida.',
      'Porque eres capaz de reconocer tus errores y aprender de ellos.',
      'Por tu aroma; es algo que asocio instantáneamente con estar en casa.',
      'Porque siempre encuentras el balance entre ser seria y ser divertida.',
      'Por lo fácil que es organizar planes o viajar contigo.',
      'Porque eres la primera persona a la que quiero contarle mis buenas noticias.',
      'Por tu resiliencia ante las situaciones difíciles.',
      'Porque haces que las cosas complicadas parezcan mucho más simples.',
      'Por la libertad que siento al estar contigo.',
      'Porque no necesito adivinar qué sientes por mí, me lo demuestras.',
      'Por la historia que estamos construyendo juntos.',
    ],

    // Razones marcadas como favoritas de fábrica (índices empezando en 1).
    // Las que tú marques con el corazón se guardan aparte en el navegador
    // y no se pierden aunque lo cierres — no hace falta tocar esto.
    favoritas: [],
  },

  /* ── 7. PÁGINA "RECUERDOS" ─────────────────────────────── */
  recuerdos: {
    titulo: 'Nuestros Recuerdos',                    // móvil
    tituloAmplio: 'Nuestros Recuerdos',              // escritorio
    subtitulo: 'Momentos grabados bajo el mismo cielo.',
    subtituloAmplio: 'Cada fotografía guarda un fragmento de nuestra historia. Momentos grabados para siempre bajo el mismo cielo.',
    tituloColeccion: 'Nuestra Colección de Momentos',
    subtituloColeccion: 'Explora las memorias guardadas por mes o inmortaliza una nueva fecha especial.',

    // Cómo se llama, en los filtros de la galería, el grupo de fotos/videos
    // con fecha anterior a `fechaInicio` (arriba del todo en este archivo)
    // — no se cuentan como "Mes 1", "Mes 2"... porque todavía no eran
    // pareja oficialmente.
    etiquetaPrevia: 'Antes de nosotros',

    /* Momentos destacados → carrusel.
       `insignia`, `lugar` y `etiquetas` solo se ven en escritorio.

       ▸ CÓMO AÑADIR UNA FOTO O VIDEO NUEVO (con Cloudinary, gratis y
         ya optimizado — recomendado para no engordar el repositorio):
           1. Copia el archivo original en assets/fotos/ o assets/videos/.
           2. Corre: python scripts/subir_a_cloudinary.py
           3. Pega la URL que te imprime en `foto:` (o `video:`) abajo.
         También puedes seguir usando una ruta local como 'assets/fotos/x.jpg'
         si prefieres no usar Cloudinary — ambas formas funcionan igual.
         (Para fotos/videos del día a día, es más fácil usar el botón
         "Añadir Nuevo Recuerdo" directo en la web — ver README.)

       ▸ VIDEOS EN EL CARRUSEL: en vez de `foto`, pon `video` con la URL
         o ruta del archivo. Se reproduce solo, en bucle, sin sonido y
         sin ningún control — nadie puede pausarlo ni tocarlo, es 100%
         automático. Un elemento usa `foto` O `video`, nunca los dos.
         `poster` (opcional) es una imagen de vista previa mientras
         el video carga.

       ▸ `fecha` va en formato AAAA-MM-DD. Con eso la web arma sola el
         "Mes 1", "Mes 2"... contando desde el `fechaInicio` de arriba,
         y agrupa aparte (sin número de mes) todo lo anterior a esa fecha.

       ▸ `favorito: true` la marca de fábrica. El corazón de la web
         también se puede tocar para marcar/desmarcar, y eso se guarda
         solo, para siempre y para los dos (ver README).

       ▸ SI UNA FOTO/VIDEO SE VE MAL RECORTADO (porque su tamaño no
         coincide con el recuadro): agrega `posicion: 'X% Y%'`, donde X
         es horizontal e Y vertical (0% = arriba/izquierda, 50% = centro,
         100% = abajo/derecha). Ej: `posicion: '50% 20%'` prioriza la
         parte de arriba de la imagen. Si subís la foto desde el botón
         "Añadir Nuevo Recuerdo" de la web, esto se elige arrastrando la
         previsualización — no hace falta tocarlo a mano acá. Si no lo
         pones, queda centrado (o el encuadre de siempre en video).      */
    destacados: [
      {
        titulo: 'Cafecito Juan Valdéz',
        frase: '"El puntapié incial."',
        fraseAmplia: '"La primera conversación frente a frente que tuvimos, y que marcó el inicio de todo."',
        fecha: '2026-05-12',
        detalle: '18:30',
        iconoDetalle: 'schedule',
        foto: 'https://res.cloudinary.com/fm7lsoqf/image/upload/f_auto,q_auto/v1790212535/nuestro-tiempo/fotos/juanValdez.jpg',
        favorito: true,
        acento: 'primary',
        insignia: 'Primer Destello',
        lugar: 'Universidad Católica',
        etiquetas: [
          { icono: 'schedule', texto: '1 Hora Inolvidable', color: 'tertiary' },
        ],
      },
      {
        titulo: 'Nuestro pimer beso',
        frase: 'La entrada que lo cambió todo.',
        fraseAmplia: 'Nuestra primera salida que también terminó siendo nuestro primer beso .',
        fecha: '2026-05-23',
        detalle: 'Lluvia',
        iconoDetalle: 'water_drop',
        foto: 'https://res.cloudinary.com/fm7lsoqf/image/upload/f_auto,q_auto/v1790212533/nuestro-tiempo/fotos/entradaCine.png',
        favorito: false,
        acento: 'secondary',
        insignia: 'Película de m**rd*',
        lugar: 'CCI',
        etiquetas: [
          { icono: 'movie', texto: 'Película', color: 'secondary' },
        ],
      },
      {
        titulo: 'Una salida porque sí',
        frase: 'El cielo copió los colores de tu sonrisa.',
        fraseAmplia: 'Un día común y corriente se convierte en el mejor cuando te veo.',
        fecha: '2026-06-24',
        detalle: 'Dorado',
        iconoDetalle: 'wb_twilight',
        foto: 'https://res.cloudinary.com/fm7lsoqf/image/upload/f_auto,q_auto/v1790212541/nuestro-tiempo/fotos/porque_si.jpg',
        favorito: true,
        acento: 'tertiary',
        insignia: 'Hora Dorada',
        lugar: 'McDonalds - Ejido',
        etiquetas: [
          { icono: 'favorite', texto: 'Silencio a dos', color: 'primary' },
        ],
      },
      {
        // ▸ Ejemplo de video en el carrusel — reemplázalo por el tuyo
        //   (o borra este elemento si no vas a usar videos).
        titulo: 'Un momento en video',
        frase: 'Contigo a todo lado.',
        fraseAmplia: 'Cualquier plan contigo es inolvidable',
        fecha: '2026-08-22',
        detalle: 'Video',
        iconoDetalle: 'videocam',
        video: 'https://res.cloudinary.com/fm7lsoqf/video/upload/f_auto,q_auto/v1790212546/nuestro-tiempo/videos/bolos.mp4',
        // poster: 'assets/fotos/portada-video.jpg', // opcional
        favorito: false,
        acento: 'primary',
        insignia: 'Video',
        lugar: '',
        etiquetas: [
          { icono: 'videocam', texto: 'Se reproduce solo', color: 'primary' },
        ],
      },
    ],

    /* Galería en cuadrícula de 2 columnas.
       `fecha` va en formato AAAA-MM-DD (fecha real, no solo texto): con
       eso la web arma sola el "Mes 1", "Mes 2"... contando desde el
       `fechaInicio` de arriba, y agrupa aparte (sin número de mes) todo
       lo anterior a esa fecha. Acepta `posicion` igual que los destacados,
       para corregir recortes feos, y `favorito: true` para marcarla de
       fábrica (el corazón de la web también se puede tocar para marcar
       o desmarcar, y eso se guarda solo — ver README).

       `id` es un nombre corto y único para cada una — sirve para que,
       al marcarla favorita, la web sepa siempre cuál es esa foto puntual
       aunque el orden de la lista cambie con el tiempo (por ejemplo, al
       subir recuerdos nuevos). Si agregás una foto acá a mano, ponele
       también un `id` que no se repita.                                */
    galeria: [
      { id: 'juan-valdez', titulo: 'Cafecito Juan Valdéz', nota: 'El puntapié inicial', fecha: '2026-05-12', foto: 'https://res.cloudinary.com/fm7lsoqf/image/upload/f_auto,q_auto/v1790212535/nuestro-tiempo/fotos/juanValdez.jpg' },
      { id: 'entrada-cine', titulo: 'Nuestro primer beso', nota: 'La entrada que lo cambió todo', fecha: '2026-05-23', foto: 'https://res.cloudinary.com/fm7lsoqf/image/upload/f_auto,q_auto/v1790212533/nuestro-tiempo/fotos/entradaCine.png' },
      { id: 'cumple-juli', titulo: 'Cumpleaños de Juli', nota: 'Almuerzo de celebración', fecha: '2026-06-07', foto: 'https://res.cloudinary.com/fm7lsoqf/image/upload/f_auto,q_auto/v1790212532/nuestro-tiempo/fotos/cumpleJuli.jpg' },
      { id: 'tarde-planes', titulo: 'Cafecito de tarde-noche', nota: 'Tarde de planes', fecha: '2026-06-09', foto: 'https://res.cloudinary.com/fm7lsoqf/image/upload/f_auto,q_auto/v1790212540/nuestro-tiempo/fotos/planes.jpg' },
      { id: 'mi-lugar-seguro', titulo: 'Mi lugar seguro', nota: 'Salida por mi cumpleaños', fecha: '2026-06-20', foto: 'https://res.cloudinary.com/fm7lsoqf/image/upload/f_auto,q_auto/v1790212538/nuestro-tiempo/fotos/mi_lugar_seguro.jpg' },
      { id: 'porque-si', titulo: 'Una salida porque sí', nota: 'El cielo copió los colores de tu sonrisa', fecha: '2026-06-24', foto: 'https://res.cloudinary.com/fm7lsoqf/image/upload/f_auto,q_auto/v1790212541/nuestro-tiempo/fotos/porque_si.jpg' },
      { id: 'lampara', titulo: 'Lámpara de recuerdo', nota: 'Regalo para la pedida de noviazgo', fecha: '2026-07-04', foto: 'https://res.cloudinary.com/fm7lsoqf/image/upload/f_auto,q_auto/v1790212537/nuestro-tiempo/fotos/lampara.jpg' },
      { id: 'contigo-siempre', titulo: 'Siempre contigo', nota: 'Defensa de tesis', fecha: '2026-07-07', foto: 'https://res.cloudinary.com/fm7lsoqf/image/upload/f_auto,q_auto/v1790212530/nuestro-tiempo/fotos/contigo_siempre.jpg' },
    ],


    piePagina: 'Cada día es mi favorito a tu lado',

    // Cita de cierre (solo escritorio)
    cita: {
      texto: 'Nuestros días juntos no son solo un número…',
      detalle: 'Son {dias} amaneceres eligiéndote, {dias} noches agradeciendo que existas y un número incontable de razones para seguir.',
    },
  },

  /* ── 8. PÁGINA "CARTA" ─────────────────────────────────── */
  carta: {
    titulo: 'Carta para Ti',
    subtitulo: 'Palabras salidas del corazón para la persona que ilumina mis días.',
    saludo: 'Amor de mi vida,',

    // Cada elemento del array es un párrafo
    parrafos: [
      'Todo este tiempo a tu lado ha sido maravilloso, contigo puedo ser yo mismo sin preocuparme por nada más. Cada momento que paso contigo es un regalo que atesoro, eres lo que siempre quise en mi vida y lo que mas amo en este mundo.',
      'Eres mi persona favorita y mi refugio. En este breve tiempo has logrado que cada instante cotidiano se transforme en un recuerdo inolvidable. Eres y vas a ser la mujer de mi vida, de mis sueños y mi todo.',
      'Quiero seguir descubriendo cada rincón de tu mundo día a día, caminar a tu ritmo y construir un espacio seguro donde siempre puedas florecer tal como eres.',
    ],

    // Frase destacada dentro de la carta
    destacado: '«Feliz {hito}, mi cielo. Y por todos los que vienen.»',

    despedida: 'Con amor infinito,',
    insignia: 'Love You Forever',
    piePagina: '{hito} Juntos',
  },

  /* ── 9. SUBIR FOTOS/VIDEOS DESDE LA WEB ────────────────────
     Permite que cualquiera con acceso a la web (vos o tu pareja)
     suba una foto o video directo desde el botón "Añadir Nuevo
     Recuerdo" de la página de Recuerdos, sin tocar código.

     Se sube directo a Cloudinary usando un "preset sin firmar"
     (unsigned upload preset). Estos dos valores son PÚBLICOS a
     propósito — la subida NO necesita tu api_secret para nada,
     así que no hay ningún riesgo en que estén aquí, visibles en
     el código de la web.

     ▸ Para que las fotos/videos subidos por la web aparezcan
       automáticamente para las dos personas (no solo en el
       celular de quien subió), hay que habilitar una vez el
       listado público en Cloudinary:
       Dashboard → ⚙ Settings → Security → sección "Restricted
       media types" → activa "Resource list". Si no lo activas,
       la subida igual funciona, pero cada quien solo ve en el
       momento lo que subió (y hay que avisarle a la otra persona
       o pegar el link a mano en `recuerdos.galeria` para que
       quede para siempre).                                      */
  cloudinary: {
    cloudName: 'fm7lsoqf',
    presetSubidas: 'nuestro_tiempo_recuerdos',
    etiquetaSubidas: 'recuerdos',
  },

  /* ── 10. NAVEGACIÓN ─────────────────────────────────────────
     `etiqueta`      → barra inferior (móvil)
     `etiquetaLarga` → enlaces de la barra superior (escritorio)   */
  nav: [
    { id: 'tiempo', etiqueta: 'Tiempo', etiquetaLarga: 'Nuestros Días', icono: 'schedule', href: 'tiempo.html' },
    { id: 'razones', etiqueta: 'Razones', etiquetaLarga: 'Razones para Amarte', icono: 'favorite', href: 'razones.html' },
    { id: 'recuerdos', etiqueta: 'Recuerdos', etiquetaLarga: 'Recuerdos', icono: 'photo_library', href: 'recuerdos.html' },
    { id: 'carta', etiqueta: 'Carta', etiquetaLarga: 'Carta de Amor', icono: 'mail', href: 'carta.html' },
  ],
};