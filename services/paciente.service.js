const conexion = require("../config/db");
const validarRut = require("../utils/validarRut");

async function obtenerOCrearPaciente( rut, nombre ) {
    if (!rut || !nombre) {
        throw new Error("Datos de paciente incompletos");
    }

    if (!validarRut(rut)) {
        throw new Error("RUT de paciente inválido");
    }

    // Buscar paciente
    const rows = await conexion.query(
        `SELECT id FROM paciente WHERE rut LIKE '${rut}'`,
        [rut]
    );

    // Si existe → devolver ID
    if (rows.length > 0) {

        return rows[0].id;
    }


    // Si no existe → crear
    const result = await conexion.query(
        "INSERT INTO paciente (rut, nombre) VALUES (?, ?)",
        [rut, nombre]
    );

    // DEVOLVER ID
    return result.insertId;
}

module.exports = {
    obtenerOCrearPaciente
};

