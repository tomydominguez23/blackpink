import { Client } from 'basic-ftp';

const STATE_FILES = [
  '.ftp-deploy-sync-state.json',
  '.ftp-deploy-sync-bpphones-v5.json',
  '.ftp-deploy-sync-bpphones-v6.json',
  '.ftp-deploy-sync-bpphones-v7.json',
  '.ftp-deploy-sync-bpphones-v8.json',
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

async function deleteStateInDir(client, dir) {
  try {
    if (dir !== '.') {
      await client.cd(dir);
    }
    for (const file of STATE_FILES) {
      try {
        await client.remove(file);
      } catch {
        /* ignore */
      }
    }
    if (dir !== '.') {
      await client.cd('..');
    }
  } catch {
    /* directorio inexistente */
  }
}

async function main() {
  for (const key of ['CPANEL_FTP_SERVER', 'CPANEL_FTP_USERNAME', 'CPANEL_FTP_PASSWORD']) {
    if (!process.env[key]) {
      console.log('Sin credenciales FTP; omitiendo limpieza de estado.');
      return;
    }
  }

  const primary = normalizeRemoteDir(process.env.CPANEL_FTP_SERVER_DIR || './');
  const port = parseInt(process.env.CPANEL_FTP_PORT || '21', 10);
  const client = new Client(60000);

  await client.access({
    host: required('CPANEL_FTP_SERVER'),
    user: required('CPANEL_FTP_USERNAME'),
    password: required('CPANEL_FTP_PASSWORD'),
    port,
    secure: true,
    secureOptions: { rejectUnauthorized: false },
  });

  try {
    const dirs = [...new Set([primary, '.', 'bpphones.cl', 'public_html/bpphones.cl'])];
    for (const dir of dirs) {
      await deleteStateInDir(client, dir);
    }
    console.log(`Estado FTP limpiado (directorio principal: ${primary}).`);
  } finally {
    client.close();
  }
}

main().catch((err) => {
  console.warn(`Aviso limpieza FTP: ${err.message}`);
  process.exit(0);
});
