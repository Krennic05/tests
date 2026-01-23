const db = require("../config/db");

async function listarProtocolosPorUsuario(id_usuario) {
    if (!id_usuario) {
        throw new Error("ID de usuario requerido");
    }

    const sql = `
        SELECT 
            p.id,
            p.fecha,
            pa.rut AS paciente_rut,
            pa.nombre AS paciente_nombre,
            c.nombre AS cirugia,
            m.nombre AS medico,
            pr.nombre AS prevision
        FROM protocolo p
        JOIN paciente pa ON pa.id = p.id_paciente
        JOIN cirugia c ON c.id = p.id_cirugia
        JOIN medico m ON m.id = p.id_medico
        JOIN prevision pr ON pr.id = p.id_prevision
        WHERE p.id_usuario = ?
        ORDER BY p.fecha DESC
    `;

    return await db.query(sql, [id_usuario]);
}

module.exports = {
    listarProtocolosPorUsuario
};

