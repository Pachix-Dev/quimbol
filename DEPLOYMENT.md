# Publicación con GitHub Actions

El workflow `.github/workflows/deploy.yml` compila con `npm ci` y `npm run build`.
Los pull requests hacia `master` solo compilan; los pushes a `master` y las
ejecuciones manuales desde esa rama también publican `dist/` por SSH.

En el repositorio de GitHub, abre **Settings → Secrets and variables → Actions**:

| Nombre | Tipo | Valor |
| --- | --- | --- |
| `HOST` | Secret o variable | Host o IPv4 del servidor, sin `https://` |
| `USER` | Secret o variable | Usuario SSH |
| `PASSWORD` | Secret | Contraseña SSH |
| `DEPLOY_PATH` | Variable o secret | Ruta absoluta del directorio público del sitio |
| `SSH_PORT` | Variable opcional | Puerto SSH, por defecto `22` |

Los nombres `HOST`, `USER` y `PASSWORD` coinciden con el ejemplo local de `.env`.
GitHub Actions lee su configuración desde GitHub; `.env` permanece ignorado y
no se sube al repositorio ni al servidor. Guarda `PASSWORD` como secret, no como
variable. Si usas secrets de organización, habilita su acceso a este repositorio.
El workflow usa secrets de repositorio u organización; no requiere un Environment.

Configura `DEPLOY_PATH` con la ruta real que sirve Apache o Nginx, por ejemplo
`/var/www/quimbol`. No incluyas espacios, puntos ni una barra raíz sola. El usuario
SSH debe tener permiso de escritura y el servidor necesita `rsync` instalado y
autenticación SSH con contraseña habilitada. No hace falta Node.js en el servidor.
Los archivos subidos deben poder ser leídos por el servidor web.

El despliegue acepta la clave SSH en la primera conexión de cada ejecución.
Publica primero los recursos y después los HTML, sin eliminar archivos existentes
del servidor. Los recursos antiguos y las páginas retiradas se conservan.

Después de subir estos cambios a `master`, revisa **Actions → Build and deploy**.
También puedes ejecutarlo con **Run workflow** desde `master`. Una compilación
fallida impide publicar. El artefacto `site` se conserva durante siete días.
