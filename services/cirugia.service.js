const db = require("../config/db");

async function obtenerOCrearCirugia(nombre) {
    if (!nombre) {
        throw new Error("Nombre de cirugía requerido");
    }

    // Buscar cirugía existente
    const rows = await db.query(
        "SELECT id FROM cirugia WHERE nombre = ?",
        [nombre]
    );

    if (rows.length > 0) {
        return rows[0].id;
    }

    // Crear cirugía si no existe
    const result = await db.query(
        "INSERT INTO cirugia (nombre) VALUES (?)",
        [nombre]
    );

    return result.insertId;
}

module.exports = {
    obtenerOCrearCirugia
};


