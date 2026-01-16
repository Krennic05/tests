const express = require("express");
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
    secret: "clave_secreta",
    resave: false,
    saveUninitialized: false
}));

// Archivos estáticos
app.use(express.static(path.join(__dirname, "public")));

// Rutas
app.use(authRoutes);
app.use(adminRoutes);
app.use(usuarioRoutes);

// Servidor
app.listen(3000, () => {
    console.log("Servidor corriendo en http://localhost:3000");
});





