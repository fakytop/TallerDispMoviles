// Para iniciar la app, vamos a dejar la pág registro como la última página, y al iniciar tenemos que evaluar si tiene un usuario iniciado o no
// Para eso lo primero que tenemos que controlar es si hay guardado un token (usuarioIniciado). 
const url = "https://crypto.develotion.com/";
//Precargar app con respuestas de la API
let departamentos;
let ciudades;
let ultimoValorCotizacion;
let infoMonedas;
let myChartCompra;
let myChartVenta;
let myChartMonedas;
let usuarioActivo = false;
mainMenu = document.querySelector("ion-menu");

precargarDepartamento();
precargarCiudades();
ocultarPage();
verificarUsuario();

function cerrarMenu() {
    mainMenu.close();
}
function verificarUsuario() {
    let apiKeyGuardada = localStorage.getItem("apiKey");
    if(apiKeyGuardada != "" && apiKeyGuardada != undefined && apiKeyGuardada != null) {
        usuarioActivo = true;
    } else {
        usuarioActivo = false;
    }
}
function cerrarSesion() {
    localStorage.clear();
    usuarioActivo = false;
    cambiarBotonesDisponibles(false);
    document.querySelector("ion-router").push("/");
    
}
//Eventos de click
document.querySelector("ion-router").addEventListener("ionRouteDidChange", evaluarPage);
document.querySelector("#sbmRegistro").addEventListener("click", capturarNuevoUsuario);
document.querySelector("#sbmIniciarSesion").addEventListener("click", capturarInicioSesion);
document.querySelector("#slcMoneda").addEventListener("ionChange", valorActualMoneda);
document.querySelector("#slcMonedaGrafica").addEventListener("ionChange", verTransacciones);
document.querySelector("#selectTransaccionesPorMoneda").addEventListener("ionChange", verTransacciones);
document.querySelector("#sbmCrearTransaccion").addEventListener("click", guardarTransaccion)
document.querySelector("#menuCerrarSesion").addEventListener("click", cerrarSesion);
document.querySelector("#btnCerrarSesion").addEventListener("click", cerrarSesion);
document.querySelector("#menuUsuarioDpto").addEventListener("click", obtenerUsuariosPorDepartamento);

function evaluarPage(ev) {
    cerrarMenu();
    let pathTo = ev.detail.to;
    ocultarPage();
    verificarUsuario();    
    //if(keySesion == null || keySesion == "") {
    if(!usuarioActivo) {
        cambiarBotonesDisponibles(false);
        let navegarIgual = pathTo != "/" || pathTo != "/inicio-sesion" || pathTo != "/registro";
        if(!navegarIgual) {
            display_toast("Debes iniciar sesión para poder acceder a la aplicación.", "Info", "danger");
            mostrarPagina("pagina-inicio");
        } else {
            navegacionDeLasPaginas(pathTo);
        }

    } else {
        cambiarBotonesDisponibles(true);
        navegacionDeLasPaginas(pathTo);
    }

}
function navegacionDeLasPaginas(pPathTo) {
    switch (pPathTo) {
        case "/": {
            mostrarPagina("pagina-inicio");
            break;
        }
        case "/inicio-sesion": {
            mostrarPagina("pagina-inicio-sesion");
            break;
        }
        case "/registro": {
            mostrarPagina("pagina-registro");
            break;
        }
        case "/crear-transaccion": {
            generarSelectTransaccion(infoMonedas, "slcMoneda");
            mostrarPagina("pagina-crear-transaccion");
            break;
        }
        case "/ver-transacciones": {
            generarSelectTransaccion(infoMonedas, "selectTransaccionesPorMoneda");
            mostrarPagina("pagina-ver-transacciones");
            verTransacciones();
            break;
        }
        case "/total-inversiones": {
            mostrarPagina("pagina-total-inversiones");
            verTransacciones();
            break;
        }
        case "/ver-sugerencias-transacciones": {
            mostrarPagina("pagina-ver-sugerencias-transacciones");
            verTransacciones();
            break;
        }
        case "/estadisticas": {
            mostrarPagina("pagina-estadisticas");
            generarSelectTransaccion(infoMonedas, "slcMonedaGrafica");
            verTransacciones();
            break;
        }
        case "/estadisticas-moneda": {
            mostrarPagina("pagina-estadisticas-moneda");
            generarSelectTransaccion(infoMonedas, "slcMonedaGrafica");
            verTransacciones();
            break;
        }
        case "/listado-monedas": {
            mostrarPagina("pagina-listado-monedas");
            escribirListadoMonedas(infoMonedas);
            break;
        }
        case "/usuarios-dpto": {
            mostrarPagina("pagina-usuarios-dpto");
            obtenerUsuariosPorDepartamento();
        }
    }    

}
function cambiarBotonesDisponibles(bool) {
    if(bool) {
        document.querySelector("#btnIrIniciarSesion").classList.add("notActive");
        document.querySelector("#btnIrRegistrar").classList.add("notActive");
        document.querySelector("#btnCerrarSesion").classList.remove("notActive");
        document.querySelector("#menuInicioSesion").classList.add("notActive");
        document.querySelector("#menuRegistro").classList.add("notActive");        
        document.querySelector("#menuCrearTransaccion").classList.remove("notActive");        
        document.querySelector("#menuVerTransacciones").classList.remove("notActive");        
        document.querySelector("#menuTotalTransacciones").classList.remove("notActive");        
        document.querySelector("#menuSugerencias").classList.remove("notActive");        
        document.querySelector("#menuEstadisticas").classList.remove("notActive");        
        document.querySelector("#menuEstadisticasMoneda").classList.remove("notActive");
        document.querySelector("#menuCerrarSesion").classList.remove("notActive");        
        document.querySelector("#menuListadoMonedas").classList.remove("notActive");        
        document.querySelector("#menuUsuarioDpto").classList.remove("notActive");        
    } else {
        document.querySelector("#btnIrIniciarSesion").classList.remove("notActive");
        document.querySelector("#btnIrRegistrar").classList.remove("notActive");
        document.querySelector("#btnCerrarSesion").classList.add("notActive");
        document.querySelector("#menuInicioSesion").classList.remove("notActive");
        document.querySelector("#menuRegistro").classList.remove("notActive");        
        document.querySelector("#menuCrearTransaccion").classList.add("notActive");        
        document.querySelector("#menuVerTransacciones").classList.add("notActive");        
        document.querySelector("#menuTotalTransacciones").classList.add("notActive");        
        document.querySelector("#menuSugerencias").classList.add("notActive");        
        document.querySelector("#menuEstadisticas").classList.add("notActive");        
        document.querySelector("#menuEstadisticasMoneda").classList.add("notActive");
        document.querySelector("#menuCerrarSesion").classList.add("notActive");
        document.querySelector("#menuListadoMonedas").classList.add("notActive");        
        document.querySelector("#menuUsuarioDpto").classList.add("notActive");        
    }
}
function generarGraficos(pTransacciones) {
    graficoCompraPorMoneda(pTransacciones);
    graficoVentaPorMoneda(pTransacciones);
    graficoValorTransaccionPorMoneda(pTransacciones);
}
function crearDatosGrafica(pInfoMonedas, pTransacciones, pTipoOperacion) {
    let arrayLabels = [];
    let arrayData = [];

    for (let i = 0; i < pInfoMonedas.length; i++) {
        let nombreMoneda = pInfoMonedas[i].nombre;
        arrayLabels.push(nombreMoneda);
        let idMoneda = pInfoMonedas[i].id;
        let totalMoneda = sumarTransaccionPorMoneda(idMoneda, pTransacciones, pTipoOperacion);
        arrayData.push(totalMoneda);
    }
    return {
        labels: arrayLabels,
        data: arrayData
    }
}
function graficoValorTransaccionPorMoneda(pTransacciones) {
    let moneda = document.querySelector("#slcMonedaGrafica").value;
    let datosGrafica = crearDatosGraficaPorMoneda(pTransacciones, moneda);

    if(datosGrafica) {
        const data = {
            labels: datosGrafica.labels,
            datasets: [{
                label: datosGrafica.nombre,
                backgroundColor: 'rgb(132, 255, 99)',
                borderColor: 'rgb(132, 255, 99)',
                data: datosGrafica.data,
            }]
        };
    
        const config = {
            type: 'line',
            data: data,
            options: {}
        };
        if (myChartMonedas) {
            myChartMonedas.destroy();
    
        }
    
        myChartMonedas = new Chart(
            document.getElementById('divValorTransacciones'),
            config
        );    
    }
}
function crearDatosGraficaPorMoneda(pTransacciones, monedaSeleccionada) {
    let arrayLabels = [];
    let arrayData = [];
    let valorRetorno = null;
    if(monedaSeleccionada) {
        for(let i = 0; i < pTransacciones.length; i++) {
            if(monedaSeleccionada == pTransacciones[i].moneda) {
                arrayLabels.push(`Id Transaccion: ${pTransacciones[i].id}`);
                arrayData.push(pTransacciones[i].valor_actual);
            }
        }
    }
    let infoMoneda = obtenerInfoMoneda(monedaSeleccionada);

    valorRetorno = {
        labels: arrayLabels,
        data: arrayData,
        nombre: infoMoneda.nombre
    }
    
    return valorRetorno;
}
function graficoVentaPorMoneda(pTransacciones) {
    let datosGrafica = crearDatosGrafica(infoMonedas, pTransacciones, 2)
    const data = {
        labels: datosGrafica.labels,
        datasets: [{
            label: 'Gráfico de Monedas Vendidas.',
            backgroundColor: 'rgb(132, 99, 255)',
            borderColor: 'rgb(132, 99, 255)',
            data: datosGrafica.data,
        }]
    };

    const config = {
        type: 'bar',
        data: data,
        options: {}
    };
    if (myChartVenta) {
        myChartVenta.destroy();

    }

    myChartVenta = new Chart(
        document.getElementById('divMontosVendidos'),
        config
    );
}
function graficoCompraPorMoneda(pTransacciones) {

    let datosGrafica = crearDatosGrafica(infoMonedas, pTransacciones, 1)

    const data = {
        labels: datosGrafica.labels,
        datasets: [{
            label: 'Gráfico de Monedas Compradas.',
            backgroundColor: 'rgb(255, 99, 132)',
            borderColor: 'rgb(255, 99, 132)',
            data: datosGrafica.data,
        }]
    };

    const config = {
        type: 'bar',
        data: data,
        options: {}
    };
    if (myChartCompra) {
        myChartCompra.destroy();

    }

    myChartCompra = new Chart(
        document.getElementById('divMontosComprados'),
        config
    );


}
function sumarTransaccionPorMoneda(pIdMoneda, pTransacciones, pTipoTransaccion) {
    let total = 0;
    for (let i = 0; i < pTransacciones.length; i++) {
        if (pIdMoneda == pTransacciones[i].moneda && pTransacciones[i].tipo_operacion == pTipoTransaccion) {
            total += pTransacciones[i].cantidad;
        }
    }
    return total;
}
function ocultarPage() {
    let pagActiva = document.querySelector("ion-page.active");
    if (pagActiva) {
        pagActiva.classList.remove("active");
    }
}
function mostrarPagina(page) {
    document.querySelector(`#${page}`).classList.add("active");
}
function guardarTransaccion() {
    let operacion = document.querySelector("#slcTipoOperacion").value;
    let moneda = document.querySelector("#slcMoneda").value;
    let montoTransaccion = document.querySelector("#nmbCantidadMoneda").value;
    let idUsuario = localStorage.getItem("idUsuario");
    let apikey = localStorage.getItem("apiKey");

    try {
        if (isNaN(operacion)) {
            throw "Debe elegir tipo de operación."
        }
        if (isNaN(moneda)) {
            throw "Debe seleccionar una moneda."
        }
        if (isNaN(montoTransaccion)) {
            throw "Debe indicar cantidad para nueva transacción."
        }
        if (montoTransaccion < 1) {
            throw "Monto de transacción no válido, debe ser mayor o igual a 1"
        }

        let bodyTransaccion = {
            idUsuario: idUsuario,
            tipoOperacion: parseInt(operacion),
            moneda: parseInt(moneda),
            cantidad: parseInt(montoTransaccion),
            valorActual: parseInt(ultimoValorCotizacion)
        }
        let headersTransaccion = {
            "apiKey": apikey,
            "Content-Type": "application/json"
        }

        fetch(`${url}transacciones.php`, {
            method: "POST",
            body: JSON.stringify(bodyTransaccion),
            headers: headersTransaccion
        }).then(response => {
            return response.json();
        }).then(apiJson => {
            if (apiJson.codigo != 200) {
                throw apiJson.mensaje;
            } else {
                display_toast(apiJson.mensaje,"Info", "success")
            }
        }).catch(error => {
            display_toast(error, "Error", "danger")
        })

    } catch (error) {
        display_toast(error, "Error", "danger");
    }



}
function verTransacciones() {
    
    let idUsuario = localStorage.getItem("idUsuario");
    let apikey = localStorage.getItem("apiKey");

    fetch(`${url}transacciones.php?idUsuario=${idUsuario}`, {
        headers: {
            "apiKey": apikey,
            "Content-Type": "application/json"
        }
    }).then(response => {
        return response.json();
    }).then(apiJson => {
        if (apiJson.codigo != 200) {
            throw apiJson.mensaje;
        } else {
            let transaccionesUsuario = apiJson.transacciones;
            escribirTransacciones(transaccionesUsuario);
            escribirSaldoTransacciones(transaccionesUsuario);
            buscarUltimasTransacciones(transaccionesUsuario);
            generarGraficos(transaccionesUsuario);
        }
    }).catch(error => {
        display_toast(error,"Error","danger");
    })
}
function buscarUltimasTransacciones(pObj) {
    let ultimasTransacciones = [];
    for (let i = 0; i < pObj.length; i++) {
        if (ultimasTransacciones.length == 0) {
            ultimasTransacciones.push(pObj[i])
        } else {
            let siguienteTransaccion = pObj[i];
            buscarMonedaEnUltimaTransaccion(ultimasTransacciones, siguienteTransaccion);
            obtenerMonedas(ultimasTransacciones);
        }
    }
    //ultimasTransacciones está completo de las últimas transacciones, ahora hay que compararlo con el valor actual de cada moneda
}
function buscarMonedaEnUltimaTransaccion(pArrayTransacciones, pTransaccion) {
    let i = 0;
    let flag = false;

    while (i < pArrayTransacciones.length && !flag) {
        if (pArrayTransacciones[i].moneda == pTransaccion.moneda) {
            flag = true;
            pArrayTransacciones[i] = pTransaccion;
        }
        i++;
    }
    if (!flag) {
        pArrayTransacciones.push(pTransaccion);
    }
}
function escribirSaldoTransacciones(pObj) {
    let html = "";
    let total = 0;
    for (let i = 0; i < pObj.length; i++) {
        let transaccion = pObj[i];
        if (transaccion.tipo_operacion == 1) {
            total += (transaccion.cantidad * transaccion.valor_actual);
        } else if (transaccion.tipo_operacion == 2) {
            total -= (transaccion.cantidad * transaccion.valor_actual);
        } else {
            total += 0;
        }
    }

    html = `<ion-card-subtitle>El valor actual de sus inversiones es de:</ion-card-subtitle>
            <ion-card-title>UYU ${total}</ion-card-title>`;
    document.querySelector("#divTotalInversion").innerHTML = html;
}
function obtenerInfoMoneda(pId) {
    let dirImagen = "";
    let nombreMoneda = "";
    let flag = false;
    let i = 0;
    while (i < infoMonedas.length && !flag) {
        if (infoMonedas[i].id == pId) {
            dirImagen = infoMonedas[i].imagen;
            nombreMoneda = infoMonedas[i].nombre;
            flag = true;
        }
        i++;
    }

    return {
        imagen: dirImagen,
        nombre: nombreMoneda
    };
}
function tipoOperacion(codigo) {
    let tipoTransaccion = "";
    if (codigo == 1) {
        tipoTransaccion = "Compra";
    } else if (codigo == 2) {
        tipoTransaccion = "Venta";
    }
    return tipoTransaccion;
}
function escribirTransacciones(pObj) {
    let selectMoneda = document.querySelector("#selectTransaccionesPorMoneda").value;
    let html = "<ion-list>";
    for (let i = 0; i < pObj.length; i++) {
        let idMoneda = pObj[i].moneda;
        let datosMoneda = obtenerInfoMoneda(idMoneda);
        let tipoTransaccion = tipoOperacion(pObj[i].tipo_operacion);
        if(selectMoneda == "" && (pObj[i].tipo_operacion == 1 || pObj[i].tipo_operacion == 2)) {
            html += `
            <ion-item>
                <ion-avatar>
                    <img src="https://crypto.develotion.com/imgs/${datosMoneda.imagen}">
                </ion-avatar>
                <ion-label>
                    <h2>${tipoTransaccion}</2>
                    <h3>${datosMoneda.nombre}</h3>
                    <p>Cantidad: ${pObj[i].cantidad} a valor: UYU ${pObj[i].valor_actual}</p>
                </ion-label>
            </ion-item>
        `
        } else if(selectMoneda == idMoneda && (pObj[i].tipo_operacion == 1 || pObj[i].tipo_operacion == 2)) {
            html += `
            <ion-item>
                <ion-avatar>
                    <img src="https://crypto.develotion.com/imgs/${datosMoneda.imagen}">
                </ion-avatar>
                <ion-label>
                    <h2>${tipoTransaccion}</2>
                    <h3>${datosMoneda.nombre}</h3>
                    <p>Cantidad: ${pObj[i].cantidad} a valor: UYU ${pObj[i].valor_actual}</p>
                </ion-label>
            </ion-item>
        `
        }
    }

    html += "</ion-list>";
    document.querySelector("#cntVerTransacciones").innerHTML = html;
}
function obtenerMonedas(pArrayUltimasTransacciones) {
    let apikey = localStorage.getItem("apiKey");
    fetch(`${url}monedas.php`, {
        headers: {
            "apiKey": apikey,
            "Content-Type": "application/json"
        }
    }).then(response => {
        return response.json();
    }).then(apiJson => {
        if (pArrayUltimasTransacciones == undefined) {
            guardarInfoMonedas(apiJson.monedas);
        } else {
            listadoUltimasTransaccionesPorUsuario(pArrayUltimasTransacciones, apiJson.monedas);
        }
    }).catch(error => {
        display_toast(error, "Error", "danger");
    })
}
function escribirListadoMonedas(pMonedas) {
    let html = ""; 
    console.log(pMonedas);
    for(let i = 0; i < pMonedas.length; i++) {
        html += `
        <ion-item>
            <ion-avatar>
                <img src="https://crypto.develotion.com/imgs/${pMonedas[i].imagen}">
            </ion-avatar>
            <ion-label>
                <h2>${pMonedas[i].nombre}</2>
                <h3>UYU ${pMonedas[i].cotizacion}</h3>
                <ion-button id-btn="${pMonedas[i].id} class="btnTransaccion">Nueva Transaccion</ion-button>
            </ion-label>
        </ion-item>
        `
    }

    document.querySelector("#listadoMonedas").innerHTML = html;
}
function listadoUltimasTransaccionesPorUsuario(pArrayUltimasTransacciones, monedasActuales) {
    let html = "";
    if (pArrayUltimasTransacciones.length == 0) {
        html = "No se han realizado transacciones hasta el momento."
    } else {
        html = "<ion-list>";
        for (let i = 0; i < pArrayUltimasTransacciones.length; i++) {
            let transaccionActual = pArrayUltimasTransacciones[i];
            html += obtenerResultadoComparacionMoneda(transaccionActual, monedasActuales);
        }
        html += "</ion-list>";
    }

    document.querySelector("#divSugerencias").innerHTML = html;
}
function obtenerResultadoComparacionMoneda(pTransaccion, pMonedasActuales) {
    let respuesta = "";
    let i = 0;
    let flag = false;
    while (i < pMonedasActuales.length && !flag) {
        if (pTransaccion.moneda == pMonedasActuales[i].id) {
            if (pTransaccion.tipo_operacion == 1) {
                let tipoTransaccion = "Compra";
                let sugerencia = "";
                if (compararValores(pTransaccion.valor_actual, pMonedasActuales[i].cotizacion)) {
                    sugerencia = "Se sugiere realizar transacción inversa.";
                    respuesta += escribirSugerenciaDeTransaccion(pTransaccion, pMonedasActuales[i], tipoTransaccion, sugerencia);
                } else {
                    sugerencia = "No se sugiere realizar transacción inversa.";
                    respuesta += escribirSugerenciaDeTransaccion(pTransaccion, pMonedasActuales[i], tipoTransaccion, sugerencia);
                }
            } else {
                let tipoTransaccion = "Venta";
                let sugerencia = "";
                if (compararValores(pMonedasActuales[i].cotizacion, pTransaccion.valor_actual)) {
                    sugerencia = "Se sugiere realizar transacción inversa.";
                    respuesta += escribirSugerenciaDeTransaccion(pTransaccion, pMonedasActuales[i], tipoTransaccion, sugerencia);
                } else {
                    sugerencia = "No se sugiere realizar transacción inversa.";
                    respuesta += escribirSugerenciaDeTransaccion(pTransaccion, pMonedasActuales[i], tipoTransaccion, sugerencia);
                }
            }
            flag = true;
        }
        i++;
    }
    return respuesta;
}
function escribirSugerenciaDeTransaccion(pTransaccion, pMoneda, pTipoTransaccion, pSugerencia) {
    let respuesta = `
        <ion-item>
            <ion-avatar>
                <img src="https://crypto.develotion.com/imgs/${pMoneda.imagen}">
            </ion-avatar>
            <ion-label>
                <h2>${pTipoTransaccion}</2>
                <h3>${pMoneda.nombre}</h3>
                <p>Cantidad: ${pTransaccion.cantidad} a valor: UYU ${pTransaccion.valor_actual}</p>
                <p>Valor actual de la moneda: UYU ${pMoneda.cotizacion} - ${pSugerencia}</p>
            </ion-label>
        </ion-item>
    `;
    return respuesta;
}
function compararValores(pValor1, pValor2) {
    let bool = false;
    if (pValor1 < pValor2) {
        bool = true;
    }

    return bool;
}
function guardarInfoMonedas(pObj) {
    infoMonedas = pObj;
}
function valorActualMoneda() {
    let idMoneda = document.querySelector("#slcMoneda").value;
    let apikey = localStorage.getItem("apiKey");
    fetch(`${url}monedas.php`, {
        headers: {
            "apiKey": apikey,
            "Content-Type": "application/json"
        }
    }).then(response => {
        return response.json();
    }).then(apiJson => {
        let monedas = apiJson.monedas;
        valorCotizacion(monedas, idMoneda);
    })
}
function valorCotizacion(pObj, pIdMoneda) {
    let i = 0;
    let flag = false;
    let respuesta;
    while (i < pObj.length && !flag) {
        if (pObj[i].id == pIdMoneda) {
            respuesta = pObj[i].cotizacion;
            flag = true;
        }
        i++;
    }
    escribirCotizacionActual(respuesta);
    ultimoValorCotizacion = respuesta;
}
function generarSelectTransaccion(obj, pIdSelect) {
    let html = `<ion-select-option value="" selected>Todas las monedas</ion-select-option>`;
    for (let i = 0; i < obj.length; i++) {
        html += `
            <ion-select-option value="${obj[i].id}">${obj[i].nombre}</ion-select-option>
        `
    }

    document.querySelector(`#${pIdSelect}`).innerHTML = html;
}
function escribirCotizacionActual(pValorCotizacion) {
    let html = "";
    html += `
        El valor actual es UYU ${pValorCotizacion}
    `;

    document.querySelector(`#pValorMoneda`).innerHTML = html;
}
function precargarDepartamento() {
    fetch(`${url}departamentos.php`, {
        headers: {
            "Content-Type": "application/json"
        }
    })
        .then(function (response) {
            return response.json()
        })
        .then(function (responseJson) {
            departamentos = responseJson.departamentos;
        })
}
function precargarCiudades() {
    fetch(`${url}ciudades.php`, {
        headers: {
            "Content-Type": "application/json"
        }
    }).then(function (response) {
        return response.json()
    }).then(function (responseJson) {
        ciudades = responseJson.ciudades;
    })
}
function capturarInicioSesion() {
    let user = document.querySelector("#txtUsuarioInicioSesion").value;
    let pass = document.querySelector("#txtPasswordInicioSesion").value;

    try {
        if (user == "") {
            throw "El campo Usuario no puede estar vacío."
        }
        if (pass == "") {
            throw "El campo contraseña no puede quedar vacío."
        }
        iniciarSesion(user, pass);

    } catch (error) {
        display_toast(error,"Error","danger");
    }
}
function iniciarSesion(pUser, pPass) {

    fetch(`${url}login.php`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            usuario: pUser,
            password: pPass
        })

    }).then(response => {
        return response.json();
    })
        .then(apiJson => {
            if (apiJson.codigo != 200) {
                throw apiJson.mensaje;
            } else {
                cambiarBotonesDisponibles(true);
                localStorage.setItem("apiKey", apiJson.apiKey);
                localStorage.setItem("idUsuario", apiJson.id);
                localStorage.setItem("usuario", pUser);
                localStorage.setItem("password", pPass);
                obtenerMonedas();
                usuarioActivo = true;
                document.querySelector("ion-router").push("/");
            }
        })
        .catch(error => {
            display_toast(error, "Error", "danger");
        })
}
function capturarNuevoUsuario() {
    event.preventDefault();
    let user = document.querySelector("#txtUsuario").value;
    let pass = document.querySelector("#txtPassword").value;
    let dpto = document.querySelector("#txtDepto").value;
    let city = document.querySelector("#txtCiudad").value;

    try {
        if (user == "" || user.length < 4) {
            throw "El nombre de usuario debe tener al menos 4 carácteres.";
        }
        if (pass == "") {
            throw "El password no puede ser vacío."
        }
        let idDpto = controlarDpto(dpto);
        if (idDpto == null) {
            throw "El departamento seleccionado no es válido.";
        }
        let idCity = controlarCiudad(city, idDpto);
        if (idCity == null) {
            throw "La ciudad seleccionada no es válida.";
        }

        let nuevoUsuario = {
            usuario: user,
            password: pass,
            idDepartamento: idDpto,
            idCiudad: idCity
        };
        guardarUsuario(nuevoUsuario);
    } catch (error) {
        display_toast(error,"Error","danger");
    }
}
function controlarDpto(pDpto) {
    let dptoLower = pDpto.toLowerCase();
    let resp = null;
    let i = 0;
    while (i < departamentos.length && resp == null) {
        let dptoILC = departamentos[i].nombre;
        if (dptoILC.toLowerCase() == dptoLower) {
            resp = departamentos[i].id;
        }
        i++;
    }
    return resp;
}
function controlarCiudad(pCity, pIdDpto) {
    let cityLower = pCity.toLowerCase();
    let resp = null;
    let i = 0;
    while (i < ciudades.length && resp == null) {
        if (ciudades[i].nombre.toLowerCase() == cityLower) {
            if (ciudades[i].id_departamento == pIdDpto) {
                resp = ciudades[i].id;
            } else {
                resp = -1;
            }
        }
        i++;
    }
    return resp;
}
function guardarUsuario(pUsuario) {

    fetch(`${url}usuarios.php`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(pUsuario)
    }).then(response => {
        return response.json();
    })
        .then(apiJson => {
            if (apiJson.codigo != 200) {
                throw apiJson.mensaje;
            } else {
                display_toast("Usuario registrado correctamente.", "Info", "success");
                document.querySelector("ion-router").push("/inicio-sesion");
            }
        }).catch(error => {
            display_toast(error,"Error","danger");
        })
}
function display_toast(mensaje, header, color) {
    const toast = document.createElement('ion-toast');
    toast.header = header;
    toast.icon = 'information-circle',
        toast.position = 'top';
    toast.message = mensaje;
    toast.duration = 2000;
    toast.color = color;
    document.body.appendChild(toast);
    toast.present();
}
function obtenerUsuariosPorDepartamento() {
    let apiKey = localStorage.getItem("apiKey");
    fetch(`${url}usuariosPorDepartamento.php`, {
        headers: {
            "Content-Type": "application/json",
            "apikey": apiKey,
        }
    }).then(response => {
        return response.json();
    }).then(apiJson => {
        if(apiJson.codigo != 200) {
            throw apiJson.mensaje;
        } else {
            
            mostrarUsuariosPoDpto(apiJson.departamentos);
        }
    }).catch(error => {
        display_toast(error,"Error", "danger");
    })
    
}

var map = L.map('map').setView([-32.633729, -56.021976],5);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap',        
}).addTo(map);

function mostrarUsuariosPoDpto(pDeptos) {
    map.remove();
    map = L.map('map').setView([-32.633729, -56.021976],5);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap',        
    }).addTo(map);

    for(let i = 0; i < pDeptos.length; i++) {
        let ubicacion = devolverLatitudLongitudDpto(pDeptos[i].id);
        
        var marker = L.marker([ubicacion.latitud,ubicacion.longitud]).addTo(map);
        
        marker.bindPopup(`${ubicacion.nombre} - ${pDeptos[i].cantidad_de_usuarios} Usuarios`).openPopup();

    } 
}
function devolverLatitudLongitudDpto(idDpto) {
    let latitud;
    let longitud;
    let nombre;
    let i = 0;
    let flag = false;
    while(i < departamentos.length && !flag) {
        if(idDpto == departamentos[i].id) {
            nombre = departamentos[i].nombre;
            latitud = departamentos[i].latitud;
            longitud = departamentos[i].longitud;
            flag = true;
        }
        i++;
    }
    return {
        nombre: nombre,
        latitud: latitud,
        longitud: longitud
    }
}