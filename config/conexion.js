let conectar = require("mysql2");

let conexion = conectar.createConnection({
    host: "localhost",
    database: "proyecto_titulacion",
    user: "root",
    password: "A828797fe$"                                        
});

conexion.connect(function(error){
    if(error){
        throw error;                 
    }else{             
        console.log("conexion exitosa");
    }
});

module.exports = conexion;