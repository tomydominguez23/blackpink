# Despliegue automático: GitHub → cPanel (FTP)

Este repositorio incluye un workflow de GitHub Actions que, en cada **push a `main`**, sube los archivos del sitio a tu hosting cPanel por **FTPS**, de modo que tu dominio (por ejemplo `https://bpphones.cl`) se actualice sin subir archivos a mano.

## Flujo de trabajo

```mermaid
flowchart LR
  A[Editas en local] --> B[git push a main]
  B --> C[GitHub Actions]
  C --> D[FTP/FTPS a cPanel]
  D --> E[public_html en el servidor]
  E --> F[Tu dominio actualizado]
```

## 1. Credenciales FTP (Blackpink / Ditecno)

Hosting **Ditecno** — sitio público en **https://bpphones.cl** (cuenta FTP asociada al hosting):

| Dato | Valor para este proyecto |
|------|--------------------------|
| Servidor FTP | `ftp.ditecno.cl` |
| Usuario FTP | `admin@bpphones.cl` |
| Puerto FTPS explícito | `21` |
| Protocolo en GitHub Actions | `ftps` (FTPS explícito; ya configurado en el workflow) |
| Directorio remoto | `./public_html/` (salvo que el sitio esté en otra carpeta) |
| Contraseña | La de la cuenta FTP en cPanel *(no va en el código)* |

Si necesitas revisar o cambiar la contraseña: **cPanel → Cuentas FTP**.

### Cómo obtener otros datos en cPanel

1. Entra a **cPanel** de tu hosting.
2. Abre **Cuentas FTP** (o **FTP Accounts**).
3. Usa la cuenta principal o crea una solo para despliegue (recomendado).

Si el sitio vive en un subdominio o carpeta, el directorio puede ser `./public_html/subcarpeta/` (con barra final).

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
| `CPANEL_FTP_SERVER_DIR` | No | `./public_html/` si el dominio apunta a la raíz |

No subas contraseñas al código: solo en secretos de GitHub.

Cuando los tres secretos obligatorios estén guardados, cada **push a `main`** disparará el workflow **Deploy a cPanel (FTP)** y subirá el sitio por FTPS al puerto 21.

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
