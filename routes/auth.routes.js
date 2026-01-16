const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const conexion = require("../config/conexion");

router.post("/login", (req, res) => {

    const { nombre, contraseña } = req.body;

    const sql = "SELECT * FROM usuario WHERE nombre = ?";

    conexion.query(sql, [nombre], async (error, results) => {
        if (error) {
            console.error(error);
            return res.send("Error servidor");
        }

        if (results.length === 0) {
            return res.send("Usuario no existe");
        }

        const usuario = results[0];

        // 🔐 Comparar contraseña
        const match = await bcrypt.compare(contraseña, usuario.contraseña);

        if (!match) {
            return res.send("Contraseña incorrecta");
        }

        // ✅ Guardar sesión
        req.session.usuario = {
            id: usuario.id,
            nombre: usuario.nombre
        };

        // 🔁 Redirección según ID
        if (usuario.id === 1) {
            res.redirect("/admin");
        } else {
            res.redirect("/user");
        }
    });
});

module.exports = router;
