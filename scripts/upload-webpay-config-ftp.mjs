import { access } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { connectFtp } from './ftp-utils.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const CONFIG = join(ROOT, 'api/webpay/config.php');

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

  const { client, remoteDir } = await connectFtp();

  try {
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
