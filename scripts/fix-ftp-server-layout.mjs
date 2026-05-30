import { Client } from 'basic-ftp';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

const JUNK_FILES = [
  'common.php',
  'create.php',
  'health.php',
  'ping.php',
  'return.php',
  'status.php',
  'debug-products.php',
  'config.example.php',
  'generate-webpay-config.php',
  'clear-ftp-sync-state.sh',
  'cli-latest',
  'gotrue-version',
  'pooler-url',
  'postgres-version',
  'project-ref',
  'rest-version',
  'storage-migration',
  'storage-version',
  'package.json',
  'config.toml',
  'index.ts',
];

function normalizeRemoteDir(raw = './') {
  let dir = String(raw).replace(/\r|\n/g, '').replace(/['"]/g, '');
  dir = dir.replace(/^\/home\/ditecnoc\/?/, '');
  if (!dir || dir === '.' || dir === './' || dir === '/') return '.';
  if (dir.startsWith('./')) dir = dir.slice(2);
  return dir;
}

function required(name) {
  const value = process.env[name];
  if (!value) throw new Error(`Falta ${name}`);
  return value;
}

async function safeRemove(client, name) {
  try {
    await client.remove(name);
  } catch {
    /* no existe o no es archivo */
  }
}

async function safeRemoveDir(client, name) {
  try {
    await client.removeDir(name);
  } catch {
    /* no existe o no es carpeta */
  }
}

async function main() {
  for (const key of ['CPANEL_FTP_SERVER', 'CPANEL_FTP_USERNAME', 'CPANEL_FTP_PASSWORD']) {
    if (!process.env[key]) {
      console.log('Sin credenciales FTP; omitiendo reparación del servidor.');
      return;
    }
  }

  const remoteDir = normalizeRemoteDir(process.env.CPANEL_FTP_SERVER_DIR || './');
  const port = parseInt(process.env.CPANEL_FTP_PORT || '21', 10);
  const client = new Client(120000);

  await client.access({
    host: required('CPANEL_FTP_SERVER'),
    user: required('CPANEL_FTP_USERNAME'),
    password: required('CPANEL_FTP_PASSWORD'),
    port,
    secure: true,
    secureOptions: { rejectUnauthorized: false },
  });

  try {
    if (remoteDir !== '.') {
      await client.cd(remoteDir);
    }

    console.log(`Reparando layout FTP en ${remoteDir} (eliminar api.zip, PHP sueltos, subir .htaccess)…`);

    await safeRemove(client, 'api');
    await safeRemoveDir(client, '__MACOSX');
    await safeRemoveDir(client, 'scripts');

    for (const file of JUNK_FILES) {
      await safeRemove(client, file);
    }

    await client.ensureDir('api/webpay');
    await client.uploadFrom(join(ROOT, '.htaccess'), '.htaccess');

    console.log('Layout FTP reparado.');
  } finally {
    client.close();
  }
}

main().catch((err) => {
  console.error(`::error::${err.message}`);
  process.exit(1);
});
