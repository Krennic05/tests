let mysql = require("mysql2");

let conexion = mysql.createConnection({
    host: "localhost",
    database: "proyecto_titulacion",
    user: "root",
    password: "A828797fe$"
});

conexion.connect(function(err){
    if(err){
        throw err;
    }else{
        console.log("conexion exitosa");
    }
});

//averiguar como modificar la consulta a proposito de un imput o variable.
const medicos = "SELECT * FROM medico";

conexion.query(medicos,function(error,lista){
    if(error){
        throw error;
    }else{
        console.log(lista),
        console.log("La tabla contiene "+ lista.length+" elementos.");
    }
});

//prueba de carga de datos a BD
let rut = "17579920-6";
let nombre = "feOrtiz";
let contraseña = "1234";
const nuevoUsuario = "INSERT INTO usuario (rut, nombre, contraseña) VALUES ('"+rut+"','"+nombre+"','"+contraseña+"')"

conexion.query(nuevoUsuario,function(error,row){
    if(error){
        throw error;
    }else{
        console.log("Usuario creado exitosamente.");
    }
});

conexion.end();