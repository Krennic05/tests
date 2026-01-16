const conexion = require("../config/db");

async function crearProtocolo({
    id,
    id_usuario,
    id_paciente,
    id_cirugia,
    id_medico,
    id_prevision,
    fecha
}) {
    if (
        !id ||
        !id_usuario ||
        !id_paciente ||
        !id_cirugia ||
        !id_medico ||
        !id_prevision ||
        !fecha
    ) {
        throw new Error("Faltan datos obligatorios");
    }

    // Evitar duplicado de protocolo
    const existe = await conexion.query(
        "SELECT id FROM protocolo WHERE id = ?",
        [id]
    );

    if (existe.length > 0) {
        throw new Error("El protocolo ya existe");
    }

    await conexion.query(
        `INSERT INTO protocolo 
        (id, id_usuario, id_paciente, id_cirugia, id_medico, id_prevision, fecha)
        VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [id, id_usuario, id_paciente, id_cirugia, id_medico, id_prevision, fecha]
    );
}

module.exports = {
    crearProtocolo
};

