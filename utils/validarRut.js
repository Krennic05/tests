//La siguiente linea define la funcion, recibe el rut como string y los recibe tanto con puntos y guion como solo guion o sin puntos ni guion
function validarRut(rutCompleto) {
    //La siguiente linea detiene la ejecución si el rut no registra dato (es decir si este viene "null", "undefined" o "")
    if (!rutCompleto) return false;
    //La siguiente linea se encarga de limpiar puntos y guion, normalizando el dato
    rutCompleto = rutCompleto.replace(/\./g, "").replace("-", "");
    //Las siguientes lineas separan cuerpo y  digito verificador:
    const cuerpo = rutCompleto.slice(0, -1); //cuerpo del rut
    let dv = rutCompleto.slice(-1).toUpperCase(); //digito verificador

    if (!/^\d+$/.test(cuerpo)) return false; //Esto valida que el cuerpo sea numerico, evitando letras u otros simbolos
    //A continuación preparamos el calculo del digito verificador
    let suma = 0;
    let multiplicador = 2;
    //Bucle:
    for (let i = cuerpo.length - 1; i >= 0; i--) {
        suma += multiplicador * cuerpo[i];
        multiplicador = multiplicador < 7 ? multiplicador + 1 : 2;
    }

    const resto = suma % 11;
    const dvEsperado = 11 - resto;

    let dvCalculado;
    if (dvEsperado === 11) dvCalculado = "0";
    else if (dvEsperado === 10) dvCalculado = "K";
    else dvCalculado = dvEsperado.toString();

    return dv === dvCalculado;
}

module.exports = validarRut;
