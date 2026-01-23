const express = require("express");
const path = require("path");
const bcrypt = require("bcrypt"); //para encriptar contraseñas
const auth = require("../middlewares/auth");//
// ajusta la ruta con conexión a base de datos
const db = require("../config/db");

const validarRut = require("../utils/validarRut"); //necesario para sistema para validar formato Rut
const { traerProtocolos } = require("../services/protocolo.service");

const router = express.Router();

router.use(auth);

// /admin
router.get("/admin", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/admin.html"));
});

// /admin/usuarios
router.get("/admin/usuarios", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/usuarios.html"));
});

router.post("/admin/usuarios", async (req, res) => {
    const { rut, nombre, contraseña } = req.body;

    if (!validarRut(rut)) {
        return res.redirect("/admin/usuarios?error=rut_invalido");
    }

    try {
        const existe = await db.query(
            "SELECT rut FROM usuario WHERE rut = ?",
            [rut]
        );

        if (existe.length > 0) {
            return res.redirect("/admin/usuarios?error=rut_existe");
        }

        const hash = await bcrypt.hash(contraseña, 10);

        await db.query(
            "INSERT INTO usuario (rut, nombre, contraseña) VALUES (?, ?, ?)",
            [rut, nombre, hash]
        );

        res.redirect("/admin/usuarios?ok=1");

    } catch (error) {
        console.error(error);
        res.send("Error al crear usuario");
    }
});

/* =========================
   VISTA LISTAR USUARIOS
========================= */
router.get("/admin/ver-usuarios", async (req, res) => {

    const sql = "SELECT rut, nombre FROM usuario";

    try {
        const usuarios = await db.query(sql);

        // Render simple con HTML
        let html = `
        <html>
        <head>
            <meta charset="UTF-8">
            <title>Usuarios</title>
            <style>
                table { border-collapse: collapse; width: 50%; }
                th, td { border: 1px solid #ccc; padding: 8px; }
                th { background: #eee; }
            </style>
        </head>
        <body>

        <h1>Listado de Usuarios</h1>

        <table>
            <tr>
                <th>RUT</th>
                <th>Nombre</th>
                <th>Acciones</th>
            </tr>
        `;

        usuarios.forEach(u => {
            html += `
            <tr>
                <td>${u.rut}</td>
                <td>${u.nombre}</td>
                <td>
                    <a href="/admin/editar/${u.rut}">Editar</a> |
                    <a href="/admin/editar-password/${u.rut}">Contraseña</a> |
                    <a href="/admin/eliminar/${u.rut}" onclick="return confirm('¿Eliminar usuario?')">
                        Eliminar
                    </a>
                </td>
            </tr>
            `;
        });

        html += `
        </table>

        <br>
        <a href="/admin">Volver al panel</a>

        </body>
        </html>
        `;

        res.send(html);

    } catch (error) {
        console.error(error);
        res.send("Error al obtener usuarios");
    }
});

router.get("/admin/eliminar/:rut", async (req, res) => {
    try {
        await db.query(
            "DELETE FROM usuario WHERE rut = ?",
            [req.params.rut]
        );

        res.redirect("/admin/ver-usuarios");
    } catch (error) {
        console.error(error);
        res.send("Error al eliminar usuario");
    }
});

router.get("/admin/editar/:rut", async (req, res) => {

    const { rut } = req.params;
    const sql = "SELECT rut, nombre FROM usuario WHERE rut = ?";

    try {
        const results = await db.query(sql, [rut]);

        if (results.length === 0) {
            return res.send("Usuario no encontrado");
        }

        const usuario = results[0];

        res.send(`
            <h1>Editar Usuario</h1>

            <form method="POST" action="/admin/editar/${usuario.rut}">
                <label>RUT</label><br>
                <input type="text" value="${usuario.rut}" disabled><br><br>

                <label>Nombre</label><br>
                <input type="text" name="nombre" value="${usuario.nombre}" required><br><br>

                <button type="submit">Guardar cambios</button>
            </form>

            <br>
            <a href="/admin/ver-usuarios">Cancelar</a>
        `);

    } catch (error) {
        console.error(error);
        res.send("Error al buscar usuario");
    }
});

router.post("/admin/editar/:rut", async (req, res) => {

    const { rut } = req.params;
    const { nombre } = req.body;

    const sql = "UPDATE usuario SET nombre = ? WHERE rut = ?";

    try {
        await db.query(sql, [nombre, rut]);
        res.redirect("/admin/ver-usuarios");

    } catch (error) {
        console.error(error);
        res.send("Error al actualizar usuario");
    }
});

router.get("/admin/editar-password/:rut", async (req, res) => {

    const { rut } = req.params;
    const sql = "SELECT rut FROM usuario WHERE rut = ?";

    try {
        const results = await db.query(sql, [rut]);

        if (results.length === 0) {
            return res.send("Usuario no encontrado");
        }

        // ⬇️ HTML exactamente igual
        res.send(`
            <h1>Cambiar contraseña</h1>

            <form method="POST" action="/admin/editar-password/${rut}">
                <label>Nueva contraseña</label><br>
                <input type="password" name="contraseña" required><br><br>

                <label>Confirmar contraseña</label><br>
                <input type="password" name="confirmar" required><br><br>

                <button type="submit">Actualizar contraseña</button>
            </form>

            <br>
            <a href="/admin/ver-usuarios">Cancelar</a>
        `);

    } catch (error) {
        console.error(error);
        res.send("Error al buscar usuario");
    }
});

router.post("/admin/editar-password/:rut", async (req, res) => {

    const { rut } = req.params;
    const { contraseña, confirmar } = req.body;

    // 1️⃣ Validaciones básicas
    if (contraseña !== confirmar) {
        return res.send("Las contraseñas no coinciden");
    }

    if (contraseña.length < 6) {
        return res.send("La contraseña debe tener al menos 6 caracteres");
    }

    try {
        // 2️⃣ Hashear contraseña
        const hash = await bcrypt.hash(contraseña, 10);

        // 3️⃣ Actualizar en BD
        const sql = "UPDATE usuario SET contraseña = ? WHERE rut = ?";

        await db.query(sql, [hash, rut]);

        res.redirect("/admin/ver-usuarios");

    } catch (error) {
        console.error(error);
        res.send("Error al actualizar contraseña");
    }
});

/* =========================
   VISTA LISTAR PROTOCOLOS
========================= */
router.get("/admin/ver-protocolos", async (req, res) => {

    const id_usuario = req.session.usuario.id;

    try {
        const protocolos = await traerProtocolos(id_usuario);

        // Render simple con HTML
        let html = `
        <html>
        <head>
            <meta charset="UTF-8">
            <title>Protocolos</title>
            <style>
                table { border-collapse: collapse; width: 80%; }
                th, td { border: 1px solid #ccc; padding: 8px; }
                th { background: #eee; }
            </style>
        </head>
        <body>

        <h1>Listado de Protocolos</h1>

        <table>
            <tr>
                <th>ID</th>
                <th>Fecha</th>
                <th>Paciente</th>
                <th>RUT</th>
                <th>Cirugía</th>
                <th>Médico</th>
                <th>Previsión</th>
            </tr>
        `;

        protocolos.forEach(p => {
            html += `
            <tr>
                <td>${p.id}</td>
                <td>${p.fecha}</td>
                <td>${p.nombrePaciente}</td>
                <td>${p.rutPaciente}</td>
                <td>${p.nombreCirugia}</td>
                <td>${p.nombreMedico}</td>
                <td>${p.prevision}</td>
            </tr>
            `;
        });

        html += `
        </table>

        <br>
        <a href="/admin">Volver al panel</a>

        </body>
        </html>
        `;

        res.send(html);

    } catch (error) {
        console.error(error);
        res.send("Error al obtener protocolos");
    }
});

module.exports = router;