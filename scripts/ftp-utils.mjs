export function normalizeHost(raw) {
  let host = String(raw ?? '').trim().replace(/\r|\n/g, '').replace(/['"]/g, '');
  host = host.replace(/^ftps?:\/\//i, '');
  host = host.replace(/\/+$/, '');
  return host;
}

export function parseFtpEndpoint(server, portFromEnv) {
  let host = normalizeHost(server);
  let port = parseInt(String(portFromEnv || '21'), 10);

  if (host.includes(':')) {
    const lastColon = host.lastIndexOf(':');
    const maybePort = host.slice(lastColon + 1);
    if (/^\d+$/.test(maybePort)) {
      port = parseInt(maybePort, 10);
      host = host.slice(0, lastColon);
    }
  }

  if (!host) {
    throw new Error('CPANEL_FTP_SERVER vacío o inválido');
  }

  return { host, port };
}

export function normalizeRemoteDir(raw = './') {
  let dir = String(raw).replace(/\r|\n/g, '').replace(/['"]/g, '');
  dir = dir.replace(/^\/home\/ditecnoc\/?/, '');
  if (!dir || dir === '.' || dir === './' || dir === '/') return '.';
  if (dir.startsWith('./')) dir = dir.slice(2);
  return dir;
}

export function required(name) {
  const value = process.env[name];
  if (!value) throw new Error(`Falta ${name}`);
  return value;
}

export async function connectFtp() {
  const { Client } = await import('basic-ftp');
  const { host, port } = parseFtpEndpoint(
    required('CPANEL_FTP_SERVER'),
    process.env.CPANEL_FTP_PORT || '21'
  );
  const remoteDir = normalizeRemoteDir(process.env.CPANEL_FTP_SERVER_DIR || './');
  const client = new Client(120000);

  console.log(`Conectando FTPS a ${host}:${port} (dir=${remoteDir})…`);

  await client.access({
    host,
    user: required('CPANEL_FTP_USERNAME'),
    password: required('CPANEL_FTP_PASSWORD'),
    port,
    secure: true,
    secureOptions: { rejectUnauthorized: false },
  });

  if (remoteDir !== '.') {
    await client.cd(remoteDir);
  }

  return { client, remoteDir, host, port };
}
