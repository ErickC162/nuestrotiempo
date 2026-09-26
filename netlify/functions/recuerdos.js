/* ============================================================
   RECUERDOS COMPARTIDOS — función de Netlify
   ------------------------------------------------------------
   Por qué existe este archivo:

   Guarda, en un pequeño archivo JSON en Cloudinary (la misma cuenta
   que ya usás para las fotos), todo lo que alguien cambie a mano
   sobre un recuerdo: marcarlo favorito, marcarlo (o no) como
   destacado, editar su título/nota/fecha/encuadre, cambiarle la
   foto/video, o borrarlo. Así se ve igual desde cualquier
   dispositivo, sin necesitar cuenta ni contraseña — reemplaza al
   antiguo favoritos.js (guardaba solo los favoritos; este archivo
   guarda cualquier cambio sobre cualquier recuerdo).

   Cómo funciona: `js/config.js` sigue siendo el punto de partida (la
   "semilla") de cada recuerdo — título, nota, fecha, foto original.
   Este archivo solo guarda las DIFERENCIAS respecto a esa semilla
   (o, para un recuerdo subido desde la web, respecto a lo que se
   subió a Cloudinary). El navegador combina ambas cosas al mostrar
   la página: semilla + cambios guardados acá = lo que se ve.

   Esta función atiende dos pedidos:

   ▸ GET  → lee todos los cambios guardados hasta ahora.
   ▸ POST { id, cambios } → guarda (o actualiza) los cambios de UN
     recuerdo puntual, identificado por su `id` (el de config.js) o
     su `publicId` de Cloudinary. No hace falta mandar el objeto
     completo: se combina con lo que ya hubiera guardado antes para
     ese mismo recuerdo.

   Por qué pasa por acá y no directo a Cloudinary — dos motivos:

   1. ESCRIBIR requiere autenticación. Cloudinary no permite
      sobreescribir archivos desde el navegador sin firmar el
      pedido, ni siquiera con el "preset sin firmar" que usamos
      para subir fotos — sería un hueco de seguridad de la propia
      plataforma. Firmar requiere el api_secret, que NUNCA debe
      estar en el navegador — por eso el guardado ocurre acá.

   2. LEER directo desde la URL pública del archivo tiene un
      problema práctico: la CDN de Cloudinary puede seguir sirviendo
      una copia vieja del archivo un buen rato después de guardar
      uno nuevo (se probó en vivo). La solución es preguntarle a
      Cloudinary, con la API autenticada (sin ese problema), cuál es
      la versión más reciente, y leer esa URL exacta.

   ▸ CONFIGURACIÓN NECESARIA (una sola vez):
     En el dashboard de Netlify → tu sitio → Site configuration →
     Environment variables → agregá una variable:
       Nombre:  CLOUDINARY_URL
       Valor:   cloudinary://TU_API_KEY:TU_API_SECRET@TU_CLOUD_NAME
     (El mismo valor que ya tenés en tu .env local. Después de
     agregarla, hay que volver a desplegar el sitio una vez.)
   ============================================================ */

const crypto = require('crypto');

const PUBLIC_ID = 'nuestro-tiempo/estado/recuerdos.json';

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

/** Trae el manifiesto actual (los cambios guardados hasta ahora), sin
 *  problema de caché — ver punto 2 del comentario de arriba.        */
async function leerManifiesto(cred) {
  const auth = Buffer.from(`${cred.apiKey}:${cred.apiSecret}`).toString('base64');
  const url = `https://api.cloudinary.com/v1_1/${cred.cloudName}/resources/raw/upload/${PUBLIC_ID}`;

  const respuesta = await fetch(url, { headers: { Authorization: `Basic ${auth}` } });
  if (respuesta.status === 404) return {}; // todavía nadie cambió nada
  if (!respuesta.ok) throw new Error('No se pudo consultar Cloudinary.');
  const info = await respuesta.json();

  const archivo = await fetch(info.secure_url);
  if (!archivo.ok) return {};
  const datos = await archivo.json();
  return (datos && typeof datos.cambios === 'object' && datos.cambios) || {};
}

async function guardarManifiesto(cred, cambiosPorId) {
  const timestamp = Math.floor(Date.now() / 1000);
  const firma = firmar({ overwrite: 'true', public_id: PUBLIC_ID, timestamp }, cred.apiSecret);

  const formulario = new FormData();
  const contenido = JSON.stringify({ cambios: cambiosPorId, actualizado: new Date().toISOString() });
  formulario.append('file', new Blob([contenido], { type: 'application/json' }), 'recuerdos.json');
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
    throw new Error((resultado.error && resultado.error.message) || 'Cloudinary rechazó la subida.');
  }
}

async function manejarLectura(cred) {
  const cambios = await leerManifiesto(cred);
  return { statusCode: 200, body: JSON.stringify({ cambios }) };
}

async function manejarGuardado(cred, event) {
  let id, cambiosNuevos;
  try {
    const cuerpo = JSON.parse(event.body || '{}');
    id = cuerpo.id;
    cambiosNuevos = cuerpo.cambios;
    if (!id || typeof id !== 'string' || typeof cambiosNuevos !== 'object' || cambiosNuevos === null) throw new Error();
  } catch (e) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Se espera un body { id: "...", cambios: {...} }' }) };
  }

  const manifiesto = await leerManifiesto(cred);
  manifiesto[id] = { ...(manifiesto[id] || {}), ...cambiosNuevos };
  await guardarManifiesto(cred, manifiesto);

  return { statusCode: 200, body: JSON.stringify({ ok: true, cambios: manifiesto[id] }) };
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
