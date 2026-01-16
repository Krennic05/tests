const conexion = require("./conexion");

function query(sql, params = []) {
    return new Promise((resolve, reject) => {
        conexion.query(sql, params, (error, results) => {
            if (error) return reject(error);
            resolve(results);
        });
    });
}

module.exports = { query };
