const express = require("express");
require("dotenv").config();
const session = require("express-session");
const path = require("path");

const authRoutes = require("./routes/auth.routes");
const adminRoutes = require("./routes/admin.routes");
const usuarioRoutes = require("./routes/user.routes");

const app = express();

// Middlewares globales
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
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





