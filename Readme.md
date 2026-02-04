# 🛍️ E-commerce Backend 2
Proyecto final del curso Backend 2, donde se desarrolla un backend completo para un e-commerce aplicando conceptos de arquitectura profesional, autenticación y autorización por roles, patrones de diseño, y lógica de compra real.

# 🚀 Tecnologías utilizadas

###### Node.js

###### Express.js

###### MongoDB + Mongoose

###### Passport.js

###### JWT (Json Web Token)

###### bcrypt

###### Handlebars

###### dotenv

# 🧱 Arquitectura del proyecto

#### El proyecto sigue una arquitectura en capas, separando responsabilidades de manera clara y escalable:

Src/

├── config/         **Configuración (MongoDB, Passport)**

├── controllers/    **Controladores HTTP**

├── services/       **Lógica de negocio**

├── repositories/   **Patrón Repository**

├── dao/            **Acceso a datos (Data Access Object)**

├── dto/            **Data Transfer Objects**

├── models/         **Modelos Mongoose**

├── routes/         **Endpoints de API y rutas de vistas**

├── middlewares/    **Middlewares (auth, manejo de errores)**

├── utils/          **Utilidades generales**

├── views/          **Plantillas Handlebars**

└── public/         **Archivos estáticos (CSS, JS, imágenes)**

✔️ Arquitectura con DAO + Repository + DTO

# 👤 Usuarios (Users)

###### **Modelo User**

**Javascript**

``` bash 
{
  first_name: String,
  last_name: String,
  email: String, // único
  age: Number,
  password: String, // encriptada
  cart: ObjectId, // referencia a Cart
  role: String // "user" por defecto
}
```  

- Contraseñas encriptadas con bcrypt.

- Asociación automática de carrito al registrar.

- Soporte para múltiples rol.

# 🔐 Seguridad y autenticación

**🔑 Encriptación:**

- Uso de bcrypt (hashSync) para proteger contraseñas.

# 🔒 Autenticación (Passport)

- Local Strategy: register, login

- JWT Strategy: current (lee token desde cookies httpOnly)

# 🪪 Tokens JWT

- Guardados en cookies seguras (httpOnly)

- Contienen id y role del usuario

- Expiran en 1 día

# 🧩 Autorización por roles

**Rol	Permisos principales:**

- Admin	Crear, actualizar y eliminar productos

- User	Agregar productos al carrito, finalizar compra

- Middleware de autorización personalizado para garantizar seguridad.

# 📦 Productos

**CRUD completo de productos:**

- Paginación integrada con mongoose-paginate-v2

##### Filtros disponibles:

- Por categoría

- Por stock disponible

- Ordenamiento por precio (ascendente / descendente)

# 🛒 Carritos

- Cada usuario obtiene un carrito al registrarse automáticamente. 

- Funcionalidades principales:

- Crear y obtener carritos

- Agregar y eliminar productos

- Finalizar compra y generar ticket

# 🎟️ Tickets (Compras)

Modelo Ticket para registrar las compras exitosas:

**Javascript**

```bash
{
  code: String, // único autogenerado
  purchase_datetime: Date,
  amount: Number, // total
  purchaser: String // email del usuario
}
``` 

# 🧭 Proceso de compra

- Se valida stock de todos los productos en el carrito.

- Si hay stock, se descuenta y se incluye en el ticket.

- Si no hay stock, el producto se excluye del ticket.

- El carrito se actualiza con los productos no comprados.

- Se genera un Ticket con el total de la compra.

# 🧠 Repository
Se aplica el patrón Repository para desacoplar la lógica de negocio del acceso a datos.

#### Repositorios incluidos:

- ProductsRepository

- CartsRepository

- UsersRepository

- TicketsRepository

Los services interactúan sólo con repositories, no con el DAO directamente.

# 📤 DTOs (Data Transfer Objects)

Se implementan para proteger información sensible y mantener formatos consistentes.

- UserDTO

- ProductDTO

Ejemplo: el endpoint /current retorna un UserDTO con información segura y normalizada.

# 🌐 Rutas principales

##### Sessions

**POST**   /api/sessions/register

**POST**   /api/sessions/login

**GET**    /api/sessions/current

**POST**   /api/sessions/logout

#### Products


**GET**    /api/products

**POST**   /api/products          // admin

**PUT**    /api/products/:pid     // admin

**DELETE** /api/products/:pid     // admin

#### Carts

**POST**   /api/carts

**GET**    /api/carts/:cid

**POST**   /api/carts/:cid/product/:pid

**DELETE** /api/carts/:cid/products/:pid

**POST**   /api/carts/:cid/purchase

# ⚙️ Variables de entorno

**Ejemplo de archivo .env:**

```bash
MONGO_URL=mongodb+srv://...

JWT_SECRET=supersecretkey

PORT=8080
```


# ▶️ Ejecución del proyecto

# Instalar dependencias

```bash
npm install
```

# Iniciar servidor en modo desarrollo

```bash
npm run dev
```

Servidor disponible (por defecto): 

```bash
http://localhost:8080
```
