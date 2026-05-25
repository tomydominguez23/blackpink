# Despliegue automático: GitHub → cPanel (FTP)

Este repositorio incluye un workflow de GitHub Actions que, en cada **push a `main`**, sube los archivos del sitio a tu hosting cPanel por **FTPS**, de modo que tu dominio (por ejemplo `https://blackpinkphones.cl`) se actualice sin subir archivos a mano.

## Flujo de trabajo

```mermaid
flowchart LR
  A[Editas en local] --> B[git push a main]
  B --> C[GitHub Actions]
  C --> D[FTP/FTPS a cPanel]
  D --> E[public_html en el servidor]
  E --> F[Tu dominio actualizado]
```

## 1. Credenciales FTP en cPanel

1. Entra a **cPanel** de tu hosting.
2. Abre **Cuentas FTP** (o **FTP Accounts**).
3. Usa la cuenta principal o crea una solo para despliegue (recomendado).
4. Anota:

| Dato | Dónde encontrarlo | Ejemplo |
|------|-------------------|---------|
| Servidor | Host FTP en cPanel | `ftp.blackpinkphones.cl` o el hostname del servidor |
| Usuario | Nombre de la cuenta FTP | `usuario@blackpinkphones.cl` |
| Contraseña | La de esa cuenta FTP | *(la defines tú)* |
| Directorio remoto | Raíz del sitio | `./public_html/` (dominio principal) |
| Puerto | Suele ser 21 | `21` |

Si el sitio vive en un subdominio o carpeta, el directorio puede ser `./public_html/subcarpeta/` (con barra final).

> **FTPS:** El workflow usa `protocol: ftps`. Si tu proveedor solo permite FTP plano, en `.github/workflows/deploy-cpanel-ftp.yml` cambia `protocol: ftps` por `protocol: ftp`.

## 2. Secretos en GitHub

En el repositorio de GitHub:

**Settings → Secrets and variables → Actions → New repository secret**

Crea estos secretos (nombres exactos):

| Secreto | Obligatorio | Descripción |
|---------|-------------|-------------|
| `CPANEL_FTP_SERVER` | Sí | Host FTP (sin `ftp://`) |
| `CPANEL_FTP_USERNAME` | Sí | Usuario FTP |
| `CPANEL_FTP_PASSWORD` | Sí | Contraseña FTP |
| `CPANEL_FTP_SERVER_DIR` | No | Carpeta remota; por defecto `./public_html/` |
| `CPANEL_FTP_PORT` | No | Puerto; por defecto `21` |

No subas contraseñas al código: solo en secretos de GitHub.

## 3. Archivos que no se sobrescriben

Por seguridad, el despliegue **no toca** estos archivos en el servidor (debes crearlos una vez en cPanel):

- `api/webpay/config.php` — copia desde `api/webpay/config.example.php` (ver `WEBPAY_PHP_SETUP.md`)
- `config.js` — copia desde `config.example.js` si usas Supabase en el front

El resto del sitio (HTML, CSS, JS, PHP de Webpay excepto `config.php`) se sincroniza desde GitHub.

## 4. Primera vez

1. Fusiona o activa el workflow en `main`.
2. Asegúrate de que en el servidor ya existen `config.php` y `config.js` con tus claves reales.
3. Haz un push a `main` o ejecuta el workflow a mano: **Actions → Deploy a cPanel (FTP) → Run workflow**.

Revisa la pestaña **Actions** en GitHub; si falla, suele ser usuario/contraseña, ruta `public_html` o FTPS deshabilitado.

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
| Webpay deja de funcionar | Que `api/webpay/config.php` siga en el servidor y no se haya borrado |

## Alternativa más robusta (opcional)

Si tu hosting ofrece **Git Version Control** en cPanel o **SSH**, un `git pull` en el servidor puede ser más fiable que FTP. Este proyecto está preparado para FTP porque es lo más común en planes compartidos.
