# Despliegue automático: GitHub → cPanel (FTP)

Este repositorio incluye un workflow de GitHub Actions que, en cada **push a `main`**, sube los archivos del sitio a tu hosting cPanel por **FTPS**, de modo que tu dominio (por ejemplo `https://bpphones.cl`) se actualice sin subir archivos a mano.

## Flujo de trabajo

```mermaid
flowchart LR
  A[Editas en local] --> B[git push a main]
  B --> C[GitHub Actions]
  C --> D[FTP/FTPS a cPanel]
  D --> E[public_html/bpphones.cl en el servidor]
  E --> F[Tu dominio actualizado]
```

## 1. Datos FTP (Ditecno / bpphones.cl)

Copia esto en **GitHub Secrets** y en tu cliente FTP (FileZilla, etc.). **Nunca** subas la contraseña al repositorio.

| Campo | Valor |
|-------|--------|
| **Servidor / host** | `ftp.ditecno.cl` |
| **Usuario** | `admin@bpphones.cl` |
| **Contraseña** | La de cPanel *(solo en secretos de GitHub, no en el código)* |
| **Puerto** | `21` |
| **Protocolo** | **FTPS explícito** (FTP sobre TLS / “Explicit FTP over TLS”) |
| **Carpeta en el servidor** | `/home/ditecnoc/public_html/bpphones.cl` |

### Ruta al conectar por FTP

La cuenta `admin@bpphones.cl` suele abrir **ya dentro** de la carpeta del sitio. En el cliente FTP:

- **Directorio remoto / carpeta inicial:** `/` o vacío (raíz de la sesión)
- En GitHub, secreto `CPANEL_FTP_SERVER_DIR` = **`./`** o **no crear ese secreto** (el workflow usa `./` solo)

Si usas la cuenta principal del hosting (no `admin@bpphones.cl`), la ruta FTP suele ser `./public_html/bpphones.cl/`.

### Comprobar en cPanel

1. **Administrador de archivos** → `/home/ditecnoc/public_html/bpphones.cl`
2. Tras el deploy debe haber `index.html`, `styles.css`, carpeta `api/`, etc.
3. **Dominios** → `bpphones.cl` → raíz del documento = `/home/ditecnoc/public_html/bpphones.cl`

Tras el deploy: **https://bpphones.cl/deploy-root.txt**

> **FTPS:** El workflow usa `protocol: ftps`. Si tu proveedor solo permite FTP plano, en `.github/workflows/deploy-cpanel-ftp.yml` cambia `protocol: ftps` por `protocol: ftp`.

## 2. Vincular GitHub con el FTP (secretos)

En el repositorio:

**[Settings → Secrets and variables → Actions](https://github.com/tomydominguez23/blackpink/settings/secrets/actions)** → **New repository secret**

Crea estos secretos (nombres **exactos**):

| Secreto | Obligatorio | Valor para Blackpink |
|---------|-------------|----------------------|
| `CPANEL_FTP_SERVER` | Sí | `ftp.ditecno.cl` |
| `CPANEL_FTP_USERNAME` | Sí | `admin@bpphones.cl` |
| `CPANEL_FTP_PASSWORD` | Sí | Contraseña de la cuenta FTP |
| `CPANEL_FTP_PORT` | No | `21` (opcional; el workflow usa 21 si no existe) |
| `CPANEL_FTP_SERVER_DIR` | No | Por defecto `./public_html/bpphones.cl/` → `/home/ditecnoc/public_html/bpphones.cl` |
| `SUPABASE_URL` | Para Webpay | `https://kodehyjdonripddobqgs.supabase.co` |
| `SUPABASE_SERVICE_ROLE_KEY` | Para Webpay | Clave **service_role** de Supabase (Dashboard → API) |
| `WEBPAY_MODE` | No | `integration` o `production` |
| `WEBPAY_COMMERCE_CODE` | Producción | Código comercio Transbank |
| `WEBPAY_API_KEY_SECRET` | Producción | API Key secreta Transbank |

No subas contraseñas al código: solo en secretos de GitHub.

Cuando los secretos FTP estén guardados, cada **push a `main`** dispara **Deploy a cPanel (FTP)**. Si además existen `SUPABASE_URL` y `SUPABASE_SERVICE_ROLE_KEY`, el workflow genera y sube `api/webpay/config.php` automáticamente.

## 3. Archivos que no se sobrescriben

- `config.js` — copia desde `config.example.js` si personalizas Supabase en el front (el sitio ya trae valores por defecto en `supabase-client.js`).

El resto del sitio (HTML, CSS, JS, PHP de Webpay) se sincroniza desde GitHub.

## 4. Primera vez

1. Fusiona o activa el workflow en `main`.
2. Configura secretos `SUPABASE_*` para Webpay, o copia manualmente `api/webpay/config.example.php` → `config.php` en el servidor.
3. Haz un push a `main` o ejecuta el workflow a mano: **Actions → Deploy a cPanel (FTP) → Run workflow**.

Revisa la pestaña **Actions** en GitHub; si falla, suele ser usuario/contraseña, ruta `public_html/bpphones.cl` o FTPS deshabilitado.

## 5. Desarrollo diario

```bash
git add .
git commit -m "Descripción del cambio"
git push origin main
```

En unos minutos el sitio en tu dominio debería reflejar los cambios.

## 6. Despliegue manual

**Actions → Deploy a cPanel (FTP) → Run workflow** (disponible con `workflow_dispatch`).

## Problemas frecuentes

| Síntoma | Qué revisar |
|---------|-------------|
| Error de login FTP | Usuario/contraseña; a veces el usuario lleva `@tudominio.cl` |
| Carpeta vacía o sitio en subcarpeta | Valor de `CPANEL_FTP_SERVER_DIR` |
| Timeout / conexión | Prueba `protocol: ftp` o confirma que el firewall del hosting permite tu IP (algunos hosts restringen FTP) |
| Webpay error 500 / HTML en lugar de JSON | Raíz del dominio = carpeta FTP; probá `https://bpphones.cl/api/webpay/ping.php` y `health.php` |
| Webpay “missing_supabase” | Secretos `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY` en GitHub o `config.php` en servidor |
| Listado “Index of /” en bpphones.cl | Verificar dominio y FTP en `/home/ditecnoc/public_html/bpphones.cl` |

## Alternativa más robusta (opcional)

Si tu hosting ofrece **Git Version Control** en cPanel o **SSH**, un `git pull` en el servidor puede ser más fiable que FTP. Este proyecto está preparado para FTP porque es lo más común en planes compartidos.
