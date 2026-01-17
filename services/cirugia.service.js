const conexion = require("../config/db");

async function obtenerOCrearCirugia(nombre) {
    if (!nombre) {
        throw new Error("Nombre de cirugía requerido");
    }

    const rows = await conexion.query(
        `SELECT id FROM cirugia WHERE nombre LIKE '${nombre}'`,
        [nombre]
    );

    if (rows.length > 0) {
        return rows[0].id;
    }
    const result = await conexion.query(
        "INSERT INTO cirugia (nombre) VALUES (?)",
        [nombre]
    );

    return result.insertId;
}

module.exports = {
    obtenerOCrearCirugia
};

