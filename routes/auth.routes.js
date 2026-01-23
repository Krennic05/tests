const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const db = require("../config/db");

router.post("/login", async (req, res) => {

    const { nombre, contraseña } = req.body;

    const sql = "SELECT * FROM usuario WHERE nombre = ?";

    try {
        //const [rows] = await db.query(sql, [nombre]);
        const results = await db.query(sql, [nombre]);

        if (results.length === 0) {
            return res.send("Usuario no existe");
        }

        const usuario = results[0];

        const match = await bcrypt.compare(
            contraseña,
            usuario.contraseña
        );

        if (!match) {
            return res.send("Contraseña incorrecta");
        }

        req.session.usuario = {
            id: usuario.id,
            nombre: usuario.nombre
        };

        if (usuario.id === 1) {
            res.redirect("/admin");
        } else {
            res.redirect("/user");
        }

    } catch (error) {
        console.error(error);
        res.status(500).send("Error servidor");
    }
});

module.exports = router;

