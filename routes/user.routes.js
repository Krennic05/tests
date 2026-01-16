const express = require("express");
const path = require("path");
const auth = require("../middlewares/auth");
const conexion = require("../config/conexion");

const { obtenerOCrearPaciente } = require("../services/paciente.service");
const { obtenerOCrearCirugia } = require("../services/cirugia.service");
const { crearProtocolo } = require("../services/protocolo.service");

const bcrypt = require("bcrypt");

const router = express.Router();

router.use(auth);

router.get("/user",(req, res) => {
    res.sendFile(path.join(__dirname, "../public/user.html"));
});

// GET /usuario/cambiar-password
router.get("/usuario/cambiar-password", (req, res) => {

    res.send(`
        <h1>Cambiar contraseña</h1>

        <form method="POST" action="/usuario/cambiar-password">

            <label>Contraseña actual</label><br>
            <input type="password" name="actual" required><br><br>

            <label>Nueva contraseña</label><br>
            <input type="password" name="nueva" required><br><br>

            <label>Confirmar nueva contraseña</label><br>
            <input type="password" name="confirmar" required><br><br>

            <button type="submit">Actualizar contraseña</button>
        </form>

        <br>
        <a href="/user">Volver</a>
    `);
});

// POST /usuario/cambiar-password
router.post("/usuario/cambiar-password", async (req, res) => {

    const { actual, nueva, confirmar } = req.body;
    const usuarioId = req.session.usuario.id;

    // Validaciones básicas
    if (nueva !== confirmar) {
        return res.send("La nueva contraseña no coincide");
    }

    if (nueva.length < 6) {
        return res.send("La contraseña debe tener al menos 6 caracteres");
    }

    // Obtener contraseña actual desde BD
    const sqlBuscar = "SELECT contraseña FROM usuario WHERE id = ?";

    conexion.query(sqlBuscar, [usuarioId], async (error, results) => {
        if (error || results.length === 0) {
            return res.send("Error al verificar usuario");
        }

        const hashActual = results[0].contraseña;

        // Comparar contraseña actual
        const coincide = await bcrypt.compare(actual, hashActual);

        if (!coincide) {
            return res.send("Contraseña actual incorrecta");
        }

        // Hashear nueva contraseña
        const nuevoHash = await bcrypt.hash(nueva, 10);

        // Actualizar en BD
        const sqlUpdate = "UPDATE usuario SET contraseña = ? WHERE id = ?";

        conexion.query(sqlUpdate, [nuevoHash, usuarioId], (error) => {
            if (error) {
                return res.send("Error al actualizar contraseña");
            }

            res.send(`
                <p>Contraseña actualizada correctamente</p>
                <a href="/user">Volver</a>
            `);
        });
    });
});

//CREACION DE PROTOCOLOS:

router.get("/usuario/protocolos", (req, res) => {
    res.sendFile(
        path.join(__dirname, "../public/crear-protocolo.html")
    );
});

// POST /usuario/protocolos

router.post("/usuario/protocolos", async (req, res) => {

    try {
        const {
            id,
            paciente_rut,
            paciente_nombre,
            cirugia_nombre,
            id_medico,
            id_prevision,
            fecha
        } = req.body;

        const id_usuario = req.session.usuario.id;

        //Paciente
        const id_paciente = await obtenerOCrearPaciente(
            paciente_rut,
            paciente_nombre
        );

        //Cirugía
        const id_cirugia = await obtenerOCrearCirugia(cirugia_nombre);

        //Protocolo
        await crearProtocolo({
            id,
            id_usuario,
            id_paciente,
            id_cirugia,
            id_medico,
            id_prevision,
            fecha
        });

        res.redirect("/usuario?ok=protocolo");

    } catch (error) {

        if (error.message === "PROTOCOLO_EXISTE") {
            return res.redirect(
                "/usuario/protocolos?error=duplicado"
            );
        }

        console.error(error);
        return res.redirect(
            "/usuario/protocolos?error=general"
        );
    }

});

/* ===============================
   VISTA LISTADO PROTOCOLOS
================================ */
router.get("/usuario/ver-protocolos", auth, (req, res) => {
    res.sendFile(
        path.join(__dirname, "../public/ver-protocolos.html")
    );
});

/* ===============================
   API PROTOCOLOS (JSON)
================================ */
router.get("/api/usuario/protocolos", auth, async (req, res) => {
    try {
        const id_usuario = req.session.usuario.id;

        const protocolos = await listarProtocolosPorUsuario(id_usuario);

        res.json(protocolos);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al obtener protocolos" });
    }
});

module.exports = router;
