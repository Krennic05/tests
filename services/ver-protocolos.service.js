// services/protocolo.service.js
const conexion = require("../config/conexion");

function listarProtocolosPorUsuario(id_usuario) {
    return new Promise((resolve, reject) => {
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

        conexion.query(sql, [id_usuario], (error, rows) => {
            if (error) return reject(error);
            resolve(rows);
        });
    });
}

module.exports = {
    listarProtocolosPorUsuario
};
