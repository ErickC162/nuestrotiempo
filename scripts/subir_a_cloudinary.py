#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Sube las fotos/videos de assets/fotos y assets/videos a Cloudinary
(almacenamiento gratis + compresión/optimización automática) y guarda
las URLs resultantes en assets/cloudinary-map.json.

USO:
    python scripts/subir_a_cloudinary.py            # sube solo lo nuevo
    python scripts/subir_a_cloudinary.py --forzar    # re-sube todo

Requisitos: solo Python 3 estándar (no hace falta instalar nada).
Lee las credenciales de .env (CLOUDINARY_URL) — ese archivo es local,
nunca se sube al repo.

Cómo usarlo cuando quieras añadir un recuerdo nuevo:
  1. Copia la foto o el video (el archivo original, sin comprimir a mano)
     dentro de assets/fotos/ o assets/videos/.
  2. Corre este script.
  3. Al final te imprime la URL de Cloudinary de cada archivo nuevo:
     cópiala y pégala en el campo `foto:` o `video:` de esa entrada en
     js/config.js (reemplazando la ruta local 'assets/fotos/...').
  4. El archivo original en assets/ lo puedes dejar (sirve de respaldo)
     o borrarlo del repo — la web ya no lo necesita ahí una vez subido.
"""

import hashlib
import json
import mimetypes
import os
import re
import sys
import time
import urllib.request
import uuid
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
RUTA_ENV = RAIZ / '.env'
RUTA_MANIFIESTO = RAIZ / 'assets' / 'cloudinary-map.json'

CARPETAS = {
    'fotos':  {'dir': RAIZ / 'assets' / 'fotos',  'tipo': 'image', 'carpeta_cloud': 'nuestro-tiempo/fotos',  'ext': {'.jpg', '.jpeg', '.png', '.webp', '.heic'}},
    'videos': {'dir': RAIZ / 'assets' / 'videos', 'tipo': 'video', 'carpeta_cloud': 'nuestro-tiempo/videos', 'ext': {'.mp4', '.mov', '.m4v', '.webm'}},
}


def leer_env(ruta):
    valores = {}
    if not ruta.exists():
        return valores
    for linea in ruta.read_text(encoding='utf-8').splitlines():
        linea = linea.strip()
        if not linea or linea.startswith('#') or '=' not in linea:
            continue
        clave, _, valor = linea.partition('=')
        valores[clave.strip()] = valor.strip()
    return valores


def parsear_cloudinary_url(url):
    # cloudinary://API_KEY:API_SECRET@CLOUD_NAME
    m = re.match(r'cloudinary://([^:]+):([^@]+)@(.+)', url)
    if not m:
        sys.exit('CLOUDINARY_URL en .env tiene un formato inesperado.')
    return {'api_key': m.group(1), 'api_secret': m.group(2), 'cloud_name': m.group(3)}


def construir_multipart(campos, archivo_nombre, archivo_bytes, nombre_campo_archivo='file'):
    boundary = uuid.uuid4().hex
    partes = []
    for clave, valor in campos.items():
        partes.append(f'--{boundary}\r\nContent-Disposition: form-data; name="{clave}"\r\n\r\n{valor}\r\n'.encode('utf-8'))
    tipo_mime = mimetypes.guess_type(archivo_nombre)[0] or 'application/octet-stream'
    cabecera_archivo = (
        f'--{boundary}\r\nContent-Disposition: form-data; name="{nombre_campo_archivo}"; filename="{archivo_nombre}"\r\n'
        f'Content-Type: {tipo_mime}\r\n\r\n'
    ).encode('utf-8')
    pie = f'\r\n--{boundary}--\r\n'.encode('utf-8')
    cuerpo = b''.join(partes) + cabecera_archivo + archivo_bytes + pie
    return cuerpo, boundary


def subir_archivo(ruta_archivo, tipo, carpeta_cloud, credenciales):
    public_id = f'{carpeta_cloud}/{ruta_archivo.stem}'
    timestamp = str(int(time.time()))

    # Firma requerida por Cloudinary para subidas autenticadas:
    # sha1("param1=valor1&param2=valor2..." + api_secret), params en orden alfabético.
    params_a_firmar = {
        'overwrite': 'true',
        'public_id': public_id,
        'timestamp': timestamp,
    }
    cadena_firma = '&'.join(f'{k}={v}' for k, v in sorted(params_a_firmar.items()))
    firma = hashlib.sha1((cadena_firma + credenciales['api_secret']).encode('utf-8')).hexdigest()

    campos = {
        'api_key': credenciales['api_key'],
        'timestamp': timestamp,
        'public_id': public_id,
        'overwrite': 'true',
        'signature': firma,
    }

    cuerpo, boundary = construir_multipart(campos, ruta_archivo.name, ruta_archivo.read_bytes())
    url = f'https://api.cloudinary.com/v1_1/{credenciales["cloud_name"]}/{tipo}/upload'
    peticion = urllib.request.Request(url, data=cuerpo, method='POST')
    peticion.add_header('Content-Type', f'multipart/form-data; boundary={boundary}')

    with urllib.request.urlopen(peticion) as resp:
        return json.loads(resp.read().decode('utf-8'))


def url_optimizada(secure_url):
    # Inserta f_auto,q_auto: Cloudinary entrega el formato y la calidad
    # óptimos según el navegador de quien lo vea, sin perder calidad visible.
    return secure_url.replace('/upload/', '/upload/f_auto,q_auto/')


def main():
    forzar = '--forzar' in sys.argv

    env = leer_env(RUTA_ENV)
    cloudinary_url = env.get('CLOUDINARY_URL') or os.environ.get('CLOUDINARY_URL')
    if not cloudinary_url:
        sys.exit('No se encontró CLOUDINARY_URL. Revisa el archivo .env en la raíz del proyecto.')
    credenciales = parsear_cloudinary_url(cloudinary_url)

    manifiesto = {}
    if RUTA_MANIFIESTO.exists():
        manifiesto = json.loads(RUTA_MANIFIESTO.read_text(encoding='utf-8'))

    nuevos = []
    for grupo in CARPETAS.values():
        directorio = grupo['dir']
        if not directorio.exists():
            continue
        for archivo in sorted(directorio.iterdir()):
            if archivo.suffix.lower() not in grupo['ext']:
                continue
            clave = f'assets/{directorio.name}/{archivo.name}'
            if clave in manifiesto and not forzar:
                continue

            print(f'Subiendo {clave} ...', end=' ', flush=True)
            try:
                resultado = subir_archivo(archivo, grupo['tipo'], grupo['carpeta_cloud'], credenciales)
            except Exception as e:
                print(f'ERROR: {e}')
                continue

            if 'secure_url' not in resultado:
                print(f'ERROR: {resultado}')
                continue

            optimizada = url_optimizada(resultado['secure_url'])
            manifiesto[clave] = optimizada
            nuevos.append((clave, optimizada))
            print('listo.')

    RUTA_MANIFIESTO.parent.mkdir(parents=True, exist_ok=True)
    RUTA_MANIFIESTO.write_text(json.dumps(manifiesto, indent=2, ensure_ascii=False), encoding='utf-8')

    print()
    if not nuevos:
        print('No había archivos nuevos que subir (usa --forzar para re-subir todo).')
    else:
        print(f'{len(nuevos)} archivo(s) subido(s). URLs listas para pegar en js/config.js:\n')
        for clave, url in nuevos:
            print(f'  {clave}\n    -> {url}\n')
    print(f'Mapa completo guardado en {RUTA_MANIFIESTO.relative_to(RAIZ)}')


if __name__ == '__main__':
    main()
