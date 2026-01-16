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

async function traerProtocolos({
    id
}) {
    if (
        !id
    ) {
        throw new Error("Faltan datos obligatorios");
    }
    let busqueda = ``;
    if(id != 1){ //no es admin
        busqueda = ` WHERE id_usuario = ${id}`
    }
    // Evitar duplicado de protocolo
    const lista = await conexion.query(
        `SELECT id, fecha, 
        paciente.rut as rutPaciente, paciente.nombre as nombrePaciente,
        cirugia.nombre as nombreCirugia,
        medico.rut as rutMedico, medico.nombre as nombreMedico,
        prevision.nombre as prevision
        FROM protocolo 
        LEFT JOIN paciente on protocolo.id_paciente = paciente.id 
        LEFT JOIN cirugia on protocolo.id_cirugia = cirugia.id 
        LEFT JOIN medico on protocolo.id_medico = medico.id 
        LEFT JOIN prevision on protocolo.id_prevision = prevision.id 
        ` + busqueda,
        [id]
    );

    return lista;
}
module.exports = {
    crearProtocolo,traerProtocolos
};

