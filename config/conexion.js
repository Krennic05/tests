let conectar = require("mysql2");

const conexion = conectar.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
});

conexion.connect(function(error){
    if(error){
        throw error;                 
    }else{             
        console.log("conexion exitosa");
    }
});

module.exports = conexion;