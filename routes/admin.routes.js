const express = require("express");
const path = require("path");
const bcrypt = require("bcrypt"); //para encriptar contraseñas
const auth = require("../middlewares/auth");//

const conexion = require("../config/conexion"); // ajusta la ruta con conexión a base de datos
const validarRut = require("../utils/validarRut"); //necesario para sistema para validar formato Rut

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

// POST /admin/usuarios, CREAR USUARIO:
router.post("/admin/usuarios", async (req, res) => {

    const { rut, nombre, contraseña } = req.body;

    //Validar formato RUT
    if (!validarRut(rut)) {
        return res.redirect("/admin/usuarios?error=rut_invalido");
    }

    //Validar que el RUT no exista
    const validarRutSQL = "SELECT rut FROM usuario WHERE rut = ?";

    conexion.query(validarRutSQL, [rut], async (error, results) => {
        if (error) {
            console.error(error);
            return res.send("Error al validar RUT");
        }

        //Si existe, cancelar
        if (results.length > 0) {
            return res.redirect("/admin/usuarios?error=rut_existe");
        }

        try {
            //Hashear contraseña
            const hash = await bcrypt.hash(contraseña, 10);

            //Insertar usuario con HASH
            const insertSQL = `
                INSERT INTO usuario (rut, nombre, contraseña)
                VALUES (?, ?, ?)
            `;

            conexion.query(insertSQL, [rut, nombre, hash], (error) => {
                if (error) {
                    console.error(error);
                    return res.send("Error al crear usuario");
                }

                //Redirigir al formulario
                res.redirect("/admin/usuarios?ok=1");
            });

        } catch (err) {
            console.error(err);
            res.send("Error al procesar contraseña");
        }
    });
});

// Flujo completo (lo que pasa ahora)
// Usuario envía formulario
// Backend consulta la BD
// Si el formato de RUT es incorrecto → vuelve al formulario con error
// Si el RUT existe → vuelve al formulario con error
// Si no existe → inserta y vuelve al formulario, hasheando la contraseña
// El usuario puede seguir creando registros
// ✔ Flujo profesional
// ✔ Sin recargar manualmente
// ✔ Sin duplicados

/* =========================
   VISTA LISTAR USUARIOS
========================= */
router.get("/admin/ver-usuarios", (req, res) => {

    const sql = "SELECT rut, nombre FROM usuario";

    conexion.query(sql, (error, usuarios) => {
        if (error) {
            console.error(error);
            return res.send("Error al obtener usuarios");
        }

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
    });
});

router.get("/admin/eliminar/:rut", (req, res) => {

    const { rut } = req.params;

    const sql = "DELETE FROM usuario WHERE rut = ?";

    conexion.query(sql, [rut], (error) => {
        if (error) {
            console.error(error);
            return res.send("Error al eliminar usuario");
        }

        res.redirect("/admin/ver-usuarios");
    });
});

router.get("/admin/editar/:rut", (req, res) => {

    const { rut } = req.params;

    const sql = "SELECT rut, nombre FROM usuario WHERE rut = ?";

    conexion.query(sql, [rut], (error, results) => {
        if (error) {
            console.error(error);
            return res.send("Error al buscar usuario");
        }

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
    });
});

router.post("/admin/editar/:rut", (req, res) => {

    const { rut } = req.params;
    const { nombre } = req.body;

    const sql = "UPDATE usuario SET nombre = ? WHERE rut = ?";

    conexion.query(sql, [nombre, rut], (error) => {
        if (error) {
            console.error(error);
            return res.send("Error al actualizar usuario");
        }

        res.redirect("/admin/ver-usuarios");
    });
});

router.get("/admin/editar-password/:rut", (req, res) => {

    const { rut } = req.params;

    const sql = "SELECT rut FROM usuario WHERE rut = ?";

    conexion.query(sql, [rut], (error, results) => {
        if (error) {
            console.error(error);
            return res.send("Error al buscar usuario");
        }

        if (results.length === 0) {
            return res.send("Usuario no encontrado");
        }

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
    });
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

    // 2️⃣ Hashear contraseña
    const hash = await bcrypt.hash(contraseña, 10);

    // 3️⃣ Actualizar en BD
    const sql = "UPDATE usuario SET contraseña = ? WHERE rut = ?";

    conexion.query(sql, [hash, rut], (error) => {
        if (error) {
            console.error(error);
            return res.send("Error al actualizar contraseña");
        }

        res.redirect("/admin/ver-usuarios");
    });
});

module.exports = router;