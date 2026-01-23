const db = require("../config/db");

/* =========================
   CREAR PROTOCOLO
========================= */
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
    id == null ||
    id_usuario == null ||
    id_paciente == null ||
    id_cirugia == null ||
    id_medico == null ||
    id_prevision == null ||
    !fecha
    ) {
    throw new Error("Faltan datos obligatorios");
    }

    // 1️⃣ Evitar duplicado
    const existe = await db.query(
        "SELECT id FROM protocolo WHERE id = ?",
        [id]
    );

    if (existe.length > 0) {
        throw new Error("PROTOCOLO_EXISTE");
    }

    // 2️⃣ Insertar
    await db.query(
        `INSERT INTO protocolo 
        (id, id_usuario, id_paciente, id_cirugia, id_medico, id_prevision, fecha)
        VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [id, id_usuario, id_paciente, id_cirugia, id_medico, id_prevision, fecha]
    );
}

/* =========================
   TRAER PROTOCOLOS
========================= */
async function traerProtocolos(id_usuario) {
    if (!id_usuario) {
        throw new Error("Faltan datos obligatorios");
    }

    let where = "";
    let params = [];

    // Si no es admin
    if (id_usuario !== 1) {
        where = "WHERE protocolo.id_usuario = ?";
        params.push(id_usuario);
    }

    const sql = `
        SELECT 
            protocolo.id,
            protocolo.fecha,
            paciente.rut AS rutPaciente,
            paciente.nombre AS nombrePaciente,
            cirugia.nombre AS nombreCirugia,
            medico.nombre AS nombreMedico,
            prevision.nombre AS prevision
        FROM protocolo
        LEFT JOIN paciente ON protocolo.id_paciente = paciente.id
        LEFT JOIN cirugia ON protocolo.id_cirugia = cirugia.id
        LEFT JOIN medico ON protocolo.id_medico = medico.id
        LEFT JOIN prevision ON protocolo.id_prevision = prevision.id
        ${where}
        ORDER BY protocolo.fecha DESC
    `;

    return await db.query(sql, params);
}

module.exports = {
    crearProtocolo,
    traerProtocolos
};


// El codigo comentado a continuación esta planteado para uso futuro.
// async function borrarProtocolo(
//     id,idBorrar
// ) {
//     if (
//         !id
//     ) {
//         throw new Error("Faltan datos obligatorios");
//     }
//     let busqueda = ` WHERE id = ${idBorrar} `;
//     if(id != 1){ //no es admin
//         busqueda += ` id_usuario = ${id}`
//     }
//     const text = 
//         `SELECT id FROM protocolo `;

//     const lista = await conexion.query( text + busqueda);
//     if(lista.length === 0){
//         return //no se puede inaccesible para el usuario o no existe
//     }
//     await conexion.query( 'DELETE FROM protocolo ' + busqueda);
// }
// async function findOneProtocolo(
//     id,idBuscar
// ) {
//     if (
//         !id
//     ) {
//         throw new Error("Faltan datos obligatorios");
//     }
//     let busqueda = ` WHERE id = ${idBuscar} `;
//     if(id != 1){ //no es admin
//         busqueda += ` id_usuario = ${id}`
//     }
//     const text = 
//         `SELECT protocolo.id, protocolo.fecha, `+
//         `paciente.rut as rutPaciente, paciente.nombre as nombrePaciente, `+
//         `cirugia.nombre as nombreCirugia, `+
//         `medico.rut as rutMedico, medico.nombre as nombreMedico, `+
//         `prevision.nombre as prevision `+
//         `FROM protocolo  `+
//         `LEFT JOIN paciente on protocolo.id_paciente = paciente.id  ` +
//         `LEFT JOIN cirugia on protocolo.id_cirugia = cirugia.id  ` +
//         `LEFT JOIN medico on protocolo.id_medico = medico.id  ` +
//         `LEFT JOIN prevision on protocolo.id_prevision = prevision.id `;

//     return [lista] = await conexion.query( text + busqueda);
// }
// async function updateProtocolo(
//     idusuario,updatear,{
//     id,
//     id_paciente,
//     id_cirugia,
//     id_medico,
//     id_prevision,
//     fecha
// }
// ) {
//     if (
//         !idusuario || !updatear
//     ) {
//         throw new Error("Faltan datos obligatorios");
//     }
//     let busqueda = ` WHERE id = ${updatear} `;
//     if(idusuario != 1){ //no es admin
//         busqueda += ` id_usuario = ${idusuario}`
//     }
//     const text = 
//         `SELECT id FROM protocolo `;

//     const lista = await conexion.query( text + busqueda);
//     if(lista.length === 0){
//         return //no se puede inaccesible para el usuario o no existe
//     }
//     const comparativo = lista[0];
//     let set = ''
//     if(!id && id != comparativo.id){
//         let exist = await conexion.query(`SELECT id FROM protocolo  WHERE id = ${id} `)
//         if(exist.length > 0){
//             return //no se puede ese id ya existe y no se debe usar
//         }
//         set = ` id = ${id} `
//     }
//     if(!id_paciente && id_paciente != comparativo.id_paciente){
//         if(set === ''){
//             set += `,`
//         }
//         set = ` id_paciente = ${id_paciente} `
//     }
//     if(!id_medico && id_medico != comparativo.id_paciente){
//         if(set === ''){
//             set += `,`
//         }
//         set = ` id_medico = ${id_medico} `
//     }
//     if(!id_cirugia && id_cirugia != comparativo.id_cirugia){
//         if(set === ''){
//             set += `,`
//         }
//         set = ` id_cirugia = ${id_cirugia} `
//     }
//     if(!id_prevision && id_prevision != comparativo.id_prevision){
//         if(set === ''){
//             set += `,`
//         }
//         set = ` id_prevision = ${id_prevision} `
//     }
//     if(!fecha && fecha != comparativo.fecha){
//         if(set === ''){
//             set += `,`
//         }
//         set = ` fecha = ${fecha} `
//     }
//     if(set === '')
//     {
//         return //no cambio nada
//     }
//     await conexion.query( 'UPDATE FROM protocolo SET '+ set + busqueda);
// }

