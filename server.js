const express = require("express");
require("dotenv").config();
const session = require("express-session");
const MySQLStore = require("express-mysql-session")(session);
const path = require("path");

const authRoutes = require("./routes/auth.routes");
const adminRoutes = require("./routes/admin.routes");
const usuarioRoutes = require("./routes/user.routes");

const app = express();

// Middlewares globales
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// CONFIGURACIÓN DE SESIONES CON MYSQL
const sessionStore = new MySQLStore({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

app.set("trust proxy", 1); //añadido 23/01

app.use(session({
    key: "session_id",
    secret: process.env.SESSION_SECRET,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false // true solo si usas HTTPS directo
    } //añadido 23/01
}));

// Archivos estáticos
app.use(express.static(path.join(__dirname, "public")));

// Rutas
app.use(authRoutes);
app.use(adminRoutes);
app.use(usuarioRoutes);

// Puerto dinámico (Railway)
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});





