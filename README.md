# Backend - Oficina de Turismo API

API REST para el sistema de gestión de excursiones turísticas. Desarrollado con Node.js, Express y MongoDB. Este proyecto forma parte de un trabajo final de la materia Programacion 3. Y esta pensado para ser mostrado en un ambiente academico. 



## 📋 Tabla de Contenidos

- [Descripción](#descripción)
- [Tecnologías](#tecnologías)
- [Requisitos Previos](#requisitos-previos)
- [Instalación](#instalación)
- [Configuración](#configuración)
- [Ejecución](#ejecución)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Modelos de Datos](#modelos-de-datos)
- [API Endpoints](#api-endpoints)
- [Autenticación](#autenticación)
- [Migraciones](#migraciones)
- [Logs](#logs)

---

## 📖 Descripción

Sistema backend para una oficina de turismo que permite:
- Gestión de excursiones turísticas
- Administración de salidas programadas
- Sistema de reservas y compras
- Carrito de compras
- Panel administrativo
- Gestión de usuarios con roles

---

## 🛠️ Tecnologías

| Tecnología | Versión | Propósito                     |
| ------------| ---------| -------------------------------|
| Node.js    | 18+     | Runtime de JavaScript         |
| Express    | 4.18.2  | Framework web                 |
| MongoDB    | 5.0+    | Base de datos NoSQL           |
| Mongoose   | 8.0.0   | ODM para MongoDB              |
| JWT        | 9.0.2   | Autenticación                 |
| bcrypt     | 5.1.1   | Hash de contraseñas           |
| Winston    | 3.11.0  | Sistema de logs               |
| CORS       | 2.8.5   | Cross-Origin Resource Sharing |

---

## ⚙️ Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js** versión 18.x o superior
  ```bash
  node --version
  ```

- **npm** versión 9.x o superior
  ```bash
  npm --version
  ```

- **MongoDB** versión 5.0 o superior
  - Opción 1: MongoDB local
  - Opción 2: MongoDB Atlas (cloud)

---

## 📥 Instalación

### 1. Clonar el repositorio
```bash
git clone https://github.com/kronos5693/finalP3Back.git
cd finalP3Back
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Crear directorios necesarios
```bash
mkdir -p src/logs
```

---

## 🔧 Configuración

#### Dado que se trata de un proyecto académico y el objetivo es facilitar la instalación y configuración de la aplicación, se ha incluido directamente en el repositorio el archivo .env con las variables de entorno necesarias para que la aplicación funcione correctamente.

#### De esta forma, cualquier persona que clone el repositorio podrá ejecutar la aplicación de inmediato, sin tener que crear o configurar manualmente dicho archivo.

#### No obstante, con fines educativos y para reflejar las buenas prácticas en entornos reales, también se proporcionan las instrucciones necesarias para el caso hipotético de que el archivo .env no estuviera presente en el repositorio (por ejemplo, si se parte de una plantilla .env.example).


### 1. Crear archivo de variables de entorno

Crear un archivo `.env` en la raíz del proyecto backend:

```bash
touch .env
```
```env
# Base de Datos
MONGODB_URI=mongodb://localhost:27017/oficina_turismo
# O si usas MongoDB Atlas:
# MONGODB_URI=mongodb+srv://usuario:contraseña@cluster.mongodb.net/oficina_turismo

# JWT Secret (cambiar en producción)
JWT_SECRET=tu_clave_secreta_super_segura_cambiar_en_produccion

# Puerto del servidor
PORT=3000

# Entorno (development, production, test)
NODE_ENV=development

## 🚀 Ejecución

### Modo Desarrollo (con auto-reload)
```bash
npm start
```

Este comando ejecuta `nodemon src/main.js` que reinicia automáticamente el servidor cuando detecta cambios en el código.

### Modo Producción
```bash
node src/main.js
```

### Salida esperada al iniciar
```
════════════════════════════════════════
 Servidor corriendo en puerto: 3000
════════════════════════════════════════
═══════════════════════════════════════
 Inicializando Base de Datos
═══════════════════════════════════════
 Creando roles...
 Roles creados: usuario, admin
 Creando usuario admin...
 Usuario admin creado: admin@turismo.com / admin123
 Cargando personajes...
 Personajes cargados: XX
 Cargando excursiones...
 Excursiones cargadas: XX
═══════════════════════════════════════
 Inicialización completada
═══════════════════════════════════════
```

---

## 📁 Estructura del Proyecto

```
back/
├── src/
│   ├── config/           # Configuración (DB, etc.)
│   │   └── db.js
│   ├── controllers/      # Lógica de negocio
│   │   ├── authController.js
│   │   ├── usuarioController.js
│   │   ├── excursionController.js
│   │   ├── salidacontroller.js
│   │   ├── reservacontroller.js
│   │   ├── carritocontroller.js
│   │   ├── compraController.js
│   │   ├── personajeController.js
│   │   └── rolController.js
│   ├── data/             # Datos de migración inicial
│   │   ├── DataLugares.json
│   │   └── DataPersona.json
│   ├── middleware/       # Middlewares
│   │   └── authMiddleware.js
│   ├── models/           # Modelos de Mongoose
│   │   ├── usuarioModel.js
│   │   ├── rolModel.js
│   │   ├── excursionModel.js
│   │   ├── salidamodel.js
│   │   ├── reservamodel.js
│   │   ├── carritomodel.js
│   │   ├── compraModel.js
│   │   └── personajeModel.js
│   ├── routes/           # Definición de rutas
│   │   ├── authRoute.js
│   │   ├── usuarioRoute.js
│   │   ├── excursionRoute.js
│   │   ├── salidaroute.js
│   │   ├── reservaroute.js
│   │   ├── carritoroute.js
│   │   ├── compraRoute.js
│   │   ├── personajeRoute.js
│   │   └── rolRoute.js
│   ├── utils/            # Utilidades
│   │   ├── createAdmin.js
│   │   ├── errorHandler.js
│   │   ├── initDB.js
│   │   └── logger.js
│   ├── logs/             # Archivos de log (generados automáticamente)
│   └── main.js           # Punto de entrada de la aplicación
├── .env                  # Variables de entorno (NO subir a git)
├── .gitignore
├── package.json
└── README.md
```

---

## 🗄️ Modelos de Datos

### Usuario
```javascript
{
  nombre: String,
  apellido: String,
  email: String (único),
  contraseña: String (hasheada),
  telefono: String,
  edad: Number,
  direccion: {
    calle, ciudad, provincia, codigoPostal, pais
  },
  rol: ObjectId (ref: Rol),
  excursionesCompradas: [ObjectId]
}
```

### Rol
```javascript
{
  nombre: String  // 'usuario' | 'admin'
}
```

### Excursion
```javascript
{
  excursion: String,
  provincia: String,
  localidad: String,
  descripcion: String,
  precio: Number (opcional, referencial),
  img: String (URL),
  habilitadaPorTemporada: Boolean,
  duracion: String,
  dificultad: String, // 'baja' | 'media' | 'alta'
  incluye: [String],
  noIncluye: [String],
  requisitos: [String]
}
```

### Salida
```javascript
{
  excursion: ObjectId (ref: Excursion),
  fecha: Date,
  horario: String, // '9hs' | '11hs' | '14hs' | '16hs'
  capacidadMaxima: Number (default: 15),
  disponibilidad: Number,
  precioPersona: Number (obligatorio),
  habilitada: Boolean,
  guia: String,
  observaciones: String
}
```

### Reserva
```javascript
{
  cliente: ObjectId (ref: Usuario),
  salida: ObjectId (ref: Salida),
  cantidadPersonas: Number,
  totalPagado: Number,
  fechaReserva: Date,
  estado: String, // 'confirmada' | 'cancelada' | 'completada'
  metodoPago: String, // 'efectivo' | 'tarjeta' | 'transferencia'
  observaciones: String,
  nombreCliente: String,
  emailCliente: String,
  telefonoCliente: String
}
```

### Carrito
```javascript
{
  usuario: ObjectId (ref: Usuario, único),
  items: [{
    salida: ObjectId (ref: Salida),
    cantidadPersonas: Number,
    precioUnitario: Number,
    fechaAgregado: Date
  }],
  fechaCreacion: Date,
  fechaActualizacion: Date
}
```

---

## 🔌 API Endpoints

### Autenticación
```
POST   /auth/login          - Iniciar sesión
GET    /auth/verificar      - Verificar token (requiere auth)
```

### Usuarios
```
GET    /usuarios            - Obtener todos los usuarios (admin)
GET    /usuarios/:id        - Obtener usuario por ID
POST   /usuarios            - Crear nuevo usuario (registro)
PUT    /usuarios/:id        - Actualizar usuario
DELETE /usuarios/:id        - Eliminar usuario (admin)
```

### Excursiones
```
GET    /excursiones         - Obtener todas las excursiones
GET    /excursiones/:id     - Obtener excursión por ID
POST   /excursiones         - Crear excursión (admin)
PUT    /excursiones/:id     - Actualizar excursión (admin)
PATCH  /excursiones/:id/toggle - Habilitar/deshabilitar (admin)
DELETE /excursiones/:id     - Eliminar excursión (admin)
```

### Salidas
```
GET    /salidas                    - Obtener todas las salidas
GET    /salidas/:id                - Obtener salida por ID
GET    /salidas/excursion/:id      - Obtener salidas de una excursión
POST   /salidas                    - Crear salida (admin)
PUT    /salidas/:id                - Actualizar salida (admin)
DELETE /salidas/:id                - Eliminar salida (admin)
```

### Reservas
```
GET    /reservas                   - Obtener todas las reservas (admin)
GET    /reservas/mis-reservas      - Obtener reservas del usuario (requiere auth)
GET    /reservas/:id               - Obtener reserva por ID
GET    /reservas/salida/:idSalida  - Obtener reservas de una salida (admin)
POST   /reservas                   - Crear reserva (requiere auth)
PUT    /reservas/:id/cancelar      - Cancelar reserva (requiere auth)
PUT    /reservas/:id/completar     - Completar reserva (admin)
```

### Carrito
```
GET    /carrito              - Obtener carrito del usuario (requiere auth)
POST   /carrito              - Agregar item al carrito (requiere auth)
PUT    /carrito/:itemId      - Actualizar cantidad de item (requiere auth)
DELETE /carrito/:itemId      - Eliminar item del carrito (requiere auth)
DELETE /carrito              - Vaciar carrito (requiere auth)
POST   /carrito/checkout     - Confirmar compra (requiere auth)
```

### Roles
```
GET    /roles                - Obtener todos los roles
POST   /roles                - Crear rol (admin)
```

### Personajes
```
GET    /personajes           - Obtener todos los personajes
```

---

## 🔐 Autenticación

### Sistema de Autenticación

El sistema utiliza **JSON Web Tokens (JWT)** para la autenticación.

### Flujo de Autenticación

1. **Login:** El usuario envía email y contraseña a `/auth/login`
2. **Verificación:** El servidor verifica las credenciales
3. **Token:** Si las credenciales son válidas, se genera un JWT
4. **Almacenamiento:** El cliente almacena el token (localStorage)
5. **Requests:** El token se incluye en el header `Authorization: Bearer <token>`

### Uso del Token

Para endpoints protegidos, incluir el header:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Roles y Permisos

- **usuario**: Rol estándar con acceso a:
  - Ver excursiones y salidas
  - Crear reservas
  - Gestionar su carrito
  - Ver sus propias reservas
  - Actualizar su perfil

- **admin**: Rol administrativo con acceso a:
  - Todo lo del usuario
  - Crear/editar/eliminar excursiones
  - Crear/editar/eliminar salidas
  - Ver todas las reservas
  - Gestionar usuarios

### Credenciales por Defecto

Al inicializar la base de datos, se crea automáticamente un usuario administrador:

```
Email: admin@turismo.com
Contraseña: admin123
```

**⚠️ IMPORTANTE:** Cambiar esta contraseña en producción.

---

## 📊 Migraciones

### Inicialización Automática

El sistema ejecuta automáticamente una migración inicial cuando se inicia el servidor por primera vez (cuando la base de datos está vacía).

### Datos que se Cargan

1. **Roles**
   - usuario
   - admin

2. **Usuario Administrador**
   - Email: admin@turismo.com
   - Contraseña: admin123

3. **Personajes**
   - Carga datos desde `src/data/DataPersona.json`

4. **Excursiones**
   - Carga datos desde `src/data/DataLugares.json`

### Migración Manual

Si necesitas ejecutar la migración manualmente:

```javascript
// Crear archivo: scripts/migrate.js
const initDB = require('./src/utils/initDB');
const connectDB = require('./src/config/db');

async function migrate() {
    await connectDB();
    await initDB();
    process.exit(0);
}

migrate();
```

Ejecutar:
```bash
node scripts/migrate.js
```

### Resetear Base de Datos

**⚠️ CUIDADO:** Esto eliminará todos los datos.

```javascript
// En MongoDB shell o Compass
use oficina_turismo
db.dropDatabase()
```

Luego reinicia el servidor para ejecutar la migración automáticamente.

---

## 📝 Logs

### Sistema de Logs

El sistema utiliza **Winston** para el registro de logs.

### Configuración

- **Nivel de log:** debug (desarrollo), info (producción)
- **Ubicación:** `src/logs/log-api.log`
- **Rotación:** Automática
  - Tamaño máximo por archivo: 5MB
  - Máximo de archivos: 5

### Tipos de Logs

```javascript
logger.info('Información general');
logger.error('Errores del sistema');
logger.warn('Advertencias');
logger.debug('Información de depuración');
```

### Consultar Logs

```bash
# Ver logs en tiempo real
tail -f src/logs/log-api.log

# Ver últimas 100 líneas
tail -n 100 src/logs/log-api.log

# Buscar errores
grep "error" src/logs/log-api.log
```



---

## 🐛 Solución de Problemas


### Problema: Puerto 3000 ya en uso
```bash
# Cambiar puerto en .env
PORT=3001
```

### Problema: Error de JWT
```bash
# Verificar que JWT_SECRET esté configurado en .env
# Limpiar localStorage en el frontend
```

### Problema: Logs no se generan
```bash
# Verificar que exista el directorio
mkdir -p src/logs

# Verificar permisos
chmod 755 src/logs
```

---

## 📚 Recursos Adicionales

- [Express.js Documentation](https://expressjs.com/)
- [Mongoose Documentation](https://mongoosejs.com/)
- [JWT.io](https://jwt.io/)
- [MongoDB Documentation](https://docs.mongodb.com/)

---

## 👥 Contacto

- Email: werner.krull@alu.inspt.utn.edu.ar


---

## 📄 Licencia

Este proyecto es parte de un trabajo académico para Programación III.

---

**Última actualización:** Febrero 2026
