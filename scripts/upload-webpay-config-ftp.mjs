import { access } from 'fs/promises';
import { Client } from 'basic-ftp';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const CONFIG = join(ROOT, 'api/webpay/config.php');

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

async function main() {
  try {
    await access(CONFIG);
  } catch {
    console.log('No hay config.php generado; omitiendo subida FTP.');
    return;
  }

  for (const key of ['CPANEL_FTP_SERVER', 'CPANEL_FTP_USERNAME', 'CPANEL_FTP_PASSWORD']) {
    if (!process.env[key]) {
      console.log('Faltan credenciales FTP para subir config.php.');
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

    console.log(`Subiendo config.php → ${remoteDir}/api/webpay/config.php`);
    await client.ensureDir('api/webpay');
    await client.cd('api/webpay');
    await client.uploadFrom(CONFIG, 'config.php');
    console.log('config.php subido correctamente.');
  } finally {
    client.close();
  }
}

main().catch((err) => {
  console.error(`::error::${err.message}`);
  process.exit(1);
});
