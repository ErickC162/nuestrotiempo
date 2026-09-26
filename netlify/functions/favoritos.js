/* ============================================================
   FAVORITOS COMPARTIDOS — función de Netlify
   ------------------------------------------------------------
   Por qué existe este archivo:

   Los favoritos de "Recuerdos" se guardan como un pequeño archivo
   (favoritos.json) en Cloudinary, la misma cuenta que ya usás para
   las fotos — así se ven igual desde cualquier dispositivo, sin
   necesitar cuenta ni contraseña.

   Esta función atiende dos pedidos:

   ▸ GET  → lee los favoritos actuales.
   ▸ POST → guarda una lista nueva (sobreescribe la anterior).

   Los dos pasan por acá, y no por una URL directa de Cloudinary,
   por dos motivos:

   1. ESCRIBIR requiere autenticación. Cloudinary no permite
      sobreescribir archivos desde el navegador sin firmar el
      pedido, ni siquiera con el "preset sin firmar" que usamos
      para subir fotos — sería un hueco de seguridad de la propia
      plataforma. Firmar requiere el api_secret, que NUNCA debe
      estar en el navegador — por eso el guardado ocurre acá, en
      el servidor de Netlify, no en la página.

   2. LEER directo desde la URL pública del archivo tiene un
      problema práctico: la CDN de Cloudinary puede seguir sirviendo
      una copia vieja del archivo un buen rato después de guardar
      uno nuevo (se probó en vivo: ni agregar "?algo=random" a la
      URL lo evita, algo que sí funciona en un servidor normal pero
      no en la CDN de Cloudinary). La solución es pedirle a
      Cloudinary, con la API autenticada (que no tiene ese problema
      de caché), cuál es la versión más reciente, y leer *esa* URL
      exacta con su número de versión — una URL versionada nunca
      cambia de contenido, así que se puede leer sin miedo a que
      esté vieja.

   ▸ CONFIGURACIÓN NECESARIA (una sola vez):
     En el dashboard de Netlify → tu sitio → Site configuration →
     Environment variables → agregá una variable:
       Nombre:  CLOUDINARY_URL
       Valor:   cloudinary://TU_API_KEY:TU_API_SECRET@TU_CLOUD_NAME
     (Es el mismo valor que ya tenés en el archivo .env local — se
     usa acá en vez de ahí porque esta función corre en Netlify, no
     en tu compu. Después de agregarla, hay que volver a desplegar
     el sitio una vez para que la tome.)
   ============================================================ */

const crypto = require('crypto');

// Para archivos "raw" (no imagen/video), Cloudinary usa el nombre de
// archivo completo —extensión incluida— como public_id; por eso termina
// en ".json" acá (a diferencia de las fotos, donde el formato se maneja
// aparte).
const PUBLIC_ID = 'nuestro-tiempo/estado/favoritos.json';

function leerCredenciales() {
  const cloudinaryUrl = process.env.CLOUDINARY_URL;
  if (!cloudinaryUrl) return null;
  const coincidencia = cloudinaryUrl.match(/^cloudinary:\/\/([^:]+):([^@]+)@(.+)$/);
  if (!coincidencia) return null;
  const [, apiKey, apiSecret, cloudName] = coincidencia;
  return { apiKey, apiSecret, cloudName };
}

function firmar(parametros, apiSecret) {
  const cadena = Object.keys(parametros).sort()
    .map((clave) => `${clave}=${parametros[clave]}`).join('&');
  return crypto.createHash('sha1').update(cadena + apiSecret).digest('hex');
}

async function manejarLectura(cred) {
  // Le pregunta a Cloudinary (API de administración, autenticada con usuario
  // y contraseña —no con firma— y sin problema de caché) cuál es la versión
  // más actual del archivo, y después lee esa URL exacta. Los "/" del
  // public_id van literales en la ruta, no codificados como %2F.
  const auth = Buffer.from(`${cred.apiKey}:${cred.apiSecret}`).toString('base64');
  const url = `https://api.cloudinary.com/v1_1/${cred.cloudName}/resources/raw/upload/${PUBLIC_ID}`;

  const respuesta = await fetch(url, { headers: { Authorization: `Basic ${auth}` } });
  if (respuesta.status === 404) {
    // Todavía nadie marcó ningún favorito compartido.
    return { statusCode: 200, body: JSON.stringify({ favoritos: [] }) };
  }
  if (!respuesta.ok) {
    return { statusCode: 502, body: JSON.stringify({ error: 'No se pudo consultar Cloudinary.' }) };
  }
  const info = await respuesta.json();

  const archivo = await fetch(info.secure_url);
  if (!archivo.ok) return { statusCode: 200, body: JSON.stringify({ favoritos: [] }) };
  const datos = await archivo.json();
  return { statusCode: 200, body: JSON.stringify({ favoritos: Array.isArray(datos.favoritos) ? datos.favoritos : [] }) };
}

async function manejarGuardado(cred, event) {
  let favoritos;
  try {
    const cuerpo = JSON.parse(event.body || '{}');
    favoritos = cuerpo.favoritos;
    if (!Array.isArray(favoritos)) throw new Error();
  } catch (e) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Se espera un body { favoritos: ["g0", "d1", ...] }' }) };
  }

  // `overwrite: true` solo se puede usar en una subida FIRMADA — por eso
  // hace falta este paso en el servidor y no se puede hacer directo desde
  // el navegador con el preset sin firmar que usamos para las fotos.
  const timestamp = Math.floor(Date.now() / 1000);
  const firma = firmar({ overwrite: 'true', public_id: PUBLIC_ID, timestamp }, cred.apiSecret);

  const formulario = new FormData();
  const contenido = JSON.stringify({ favoritos, actualizado: new Date().toISOString() });
  formulario.append('file', new Blob([contenido], { type: 'application/json' }), 'favoritos.json');
  formulario.append('api_key', cred.apiKey);
  formulario.append('timestamp', String(timestamp));
  formulario.append('public_id', PUBLIC_ID);
  formulario.append('overwrite', 'true');
  formulario.append('signature', firma);

  const respuesta = await fetch(`https://api.cloudinary.com/v1_1/${cred.cloudName}/raw/upload`, {
    method: 'POST',
    body: formulario,
  });
  const resultado = await respuesta.json();
  if (!respuesta.ok) {
    return {
      statusCode: 502,
      body: JSON.stringify({ error: (resultado.error && resultado.error.message) || 'Cloudinary rechazó la subida.' }),
    };
  }
  return { statusCode: 200, body: JSON.stringify({ ok: true }) };
}

exports.handler = async (event) => {
  const cred = leerCredenciales();
  if (!cred) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Falta configurar CLOUDINARY_URL en las variables de entorno de Netlify.' }),
    };
  }

  try {
    if (event.httpMethod === 'GET') return await manejarLectura(cred);
    if (event.httpMethod === 'POST') return await manejarGuardado(cred, event);
    return { statusCode: 405, body: JSON.stringify({ error: 'Método no permitido.' }) };
  } catch (e) {
    return { statusCode: 502, body: JSON.stringify({ error: 'No se pudo conectar con Cloudinary: ' + e.message }) };
  }
};
