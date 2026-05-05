## Notas Hair
1. debes tener insstaladdo **NODE**
2. Crea en la carpeta raiz de este proyecto un archivo llamado `.env` con la siguiente información:
```json
PORT=3000

JWT_SECRET=clave_super_secreta_cambiarla_en_produccion
JWT_EXPIRES_IN=1h

DB_PLATFORM="sqlite"
HOST=""
DB_NAME="app.db"
USER=""
PASSWORD=""
```

Y guardalo.
3. abre una consola en la carpeta raiz de el proyecto 
4. en la consola ejecuta el servidor así: `npm run dev`
5. cuando quieras detener el servidor preciona ctrl + z si estas en bash, ctrl+c si estas en cmd

Mientras el servidor este cooriendo puedes acceder a los end points así:

```txt
http://localhost:3000/usuarios
http://localhost:3000/usuarios/3

```



## endpoints

### Autenticación
POST /auth/registro              → Registrar nuevo usuario
POST /auth/login                 → Iniciar sesión, retorna JWT
POST /auth/logout                → Cerrar sesión
POST /auth/refresh               → Renovar token JWT
POST /auth/verificar-correo      → Verificar dominio institucional
POST /auth/recuperar-password    → Solicitar recuperación de contraseña
PUT  /auth/cambiar-password      → Cambiar contraseña

### Usuarios
GET    /usuarios/:id             → Obtener perfil del usuario
PUT    /usuarios/:id             → Actualizar datos personales
DELETE /usuarios/:id             → Eliminar cuenta

### Contactos de emergencia 
GET    /usuarios/:id/contactos            → Listar contactos
POST   /usuarios/:id/contactos            → Agregar contacto
GET    /usuarios/:id/contactos/:cid       → Obtener contacto específico
PUT    /usuarios/:id/contactos/:cid       → Actualizar contacto
DELETE /usuarios/:id/contactos/:cid       → Eliminar contacto


## probar

En bash:

```bash
curl -X POST http://localhost:3000/login -H "Content-Type: Application/json" -d '{"email":"admin@ejemplo.com","password":"123456"}'

#{
#  "mensaje": "Login exitoso",
#  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
#  "usuario": { "id": 1, "email": "admin@ejemplo.com", "rol": "admin" }
#}


curl -X GET http://localhost:3000/perfil \
  -H "Authorization: Bearer <TOKEN_OBTENIDO>"
```

## Probarlo en thunder

1. Obteer el token con una peticion post con datos json: `{"email":"admin@ejemplo.com","password":"123456"}`
2. Copiar el token obtenido y crear una peticin get a http://localhost:3000/perfil
3. Ve a la pestaña "Auth". En el desplegable "Type", selecciona Bearer Token (o "Bearer Token"). Aparecerá un campo "Token". Pega ahí el token que copiaste del login. ¡Listo! Haz clic en "Send" de nuevo y deberías obtener la respuesta exitosa de la API.


datos={
  error:null,
  data:[
  {
    "id": 1,
    "name": "ana",
    "username": "an1",
    "email": "ana@example.com",
    "password": "pass1",
    "matricula": 12345,
    "telefono": "555-1234",
    "rol": "user"
  },
  {},
  {}
]}

datos={
  error:"letrero del error",
  data:null
}