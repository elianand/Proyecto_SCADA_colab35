/* 

Coderhouse - Curso javascript
Entrega Final
Elian andrenacci

*/


/*


    CAMBIAR ESTO

    PARA LA ENTREGA NO OLVIDAR DE BORAR EL LOGO DE JP_MAKERS

    En esta entrega se agrega una interfaz visual donde el usuario es capaz de interactuar de 
    una forma bastante amigable y facil. Se sabe que esta visual no es atractiva, sino que es
    funcional. En el inicio se pueden seleccionar una de las distintas maquinas para ver sus 
    datos. Todos las maquinas muestran los mismos datos, no es un error, sino que se omite
    esto ya que se debe agregar mas codigo que no va a aportar para la entrega. Una mejora 
    sustancial del programa es que ahora los datos son cargados desde una base de datos
    alojada en el archivo baseDatos.js en un array en formato de JSON, al tocar los botones
    de la interfaz se van haciendo consultas a esta base y luego se guardan en el almacenamiento
    de la sesion (sessionStorange).

*/ 




const NUM_ITEM_MENU_REG_EST = 0;
const NUM_ITEM_MENU_TMP_CCL = 1;
const NUM_ITEM_MENU_REG_PRD = 2;
const NUM_ITEM_MENU_EST_SNS = 3;
const NUM_ITEM_MENU_REG_EVN = 4;
const NUM_ITEM_MENU_IMP_DTS = 5;

const NUM_ESTADO_MAQUINA_APAGADA        = 0;
const NUM_ESTADO_MAQUINA_DETENIDA       = 1;
const NUM_ESTADO_MAQUINA_PRODUCIENDO    = 2;


// Variables globales
let ultMenuItem = 0;
let elemCreadoPadre = [];


const funcion1 = async () => {
    const resp = await fetch('BaseDatos/gestorBaseDatos.php?hola=1');
    const data = await resp.text();
    //const data = await resp.json()
    //const data = await resp.text;
    
    console.log(data);

    const jsonObj = JSON.parse(data);
    console.log(jsonObj);
}

funcion1();


const ConsultaDatos_ListaMaquinas = async () => {
    const resp = await fetch('BaseDatos/listaMaquinas.json')
    const data = await resp.json()
    
    sessionStorage.setItem("datos_listaMaquinas", JSON.stringify(data));
    CargarMenuInicio();
}

const ConsultaDatos_RegistrosEstado = async () => {

    const idMaq = sessionStorage.getItem("IdMaq");
    const resp = await fetch(`BaseDatos/RegistrosEstado/${idMaq}.json`);
    const data = await resp.json();
    
    sessionStorage.setItem("datos_RegistrosEstado", JSON.stringify(data));
    CargarDatosRegistroEstado();
}

const ConsultaDatos_TiemposCiclo = async () => {

    const idMaq = sessionStorage.getItem("IdMaq");
    const resp = await fetch(`BaseDatos/TiemposCiclo/${idMaq}.json`);
    const data = await resp.json();
    
    sessionStorage.setItem("datos_TiemposCiclo", JSON.stringify(data));
    CargarDatosTiemposCiclo();
}

const ConsultaDatos_RegistrosProduccion = async () => {

    const idMaq = sessionStorage.getItem("IdMaq");
    const resp = await fetch(`BaseDatos/RegistrosProduccion/${idMaq}.json`);
    const data = await resp.json();
    
    sessionStorage.setItem("datos_RegistrosProduccion", JSON.stringify(data));
    CargarDatosRegistroProduccion();
}



ConsultaDatos_ListaMaquinas();


function CargarMenuInicio() {

    let listaMaquinas = new ListaMaquinas(); 

    const data = sessionStorage.getItem("datos_listaMaquinas");
    listaMaquinas.IngresoDatosJSON(data);

    let cantMaq = listaMaquinas.GetCantMaquinas();
    let cntndor_gral = document.getElementById("contenedorInicio");


    for(let i = 0; i < cantMaq; i++) {


        let cntndor_carta = document.createElement("DIV");
        cntndor_gral.appendChild(cntndor_carta);
        cntndor_carta.id = "ContenedorMaquinaEstado"+i.toString();
        cntndor_carta.className = "card col-sm-4 col-md-3 col-lg-2 mx-1 my-2";
        cntndor_carta.title = i;
        elemCreadoPadre.push(cntndor_carta);

        cntndor_carta.innerHTML = `
            <img src="imagenes/maquina.png" class = "card-img-top" title="Inyectora" style="margin-top: 30px"></img>
            <div class="card-body" style="text-align: center;">
                <h5 class="card-title" style="height: 20%; margin-bottom: 0px;">${listaMaquinas.GetNombre()[i]} Num: ${listaMaquinas.GetNumero()[i]}</h5>
                <p class="card-text" style="height: 20%; margin-bottom: 20px;"></p>
                <a class="btn btn-primary" style="position: relative; height: fit-content;" onclick="CargaDatosMaquina_PostInicio(${i})">Ver detalles</a>
            </div>
        `;
    }
}

function CargaDatosMaquina_PostInicio(idMaquina) {

    sessionStorage.setItem("IdMaq", idMaquina);
    
    EliminarElemCreados();

    // Se esconde el inicio
    document.getElementById("contenedorInicio").classList.add("d-none");
    document.getElementById("botonCerrarSesion").classList.add("d-none");
    
    
    // Se muestra el menu
    document.getElementById("contenedorMenu").classList.remove("d-none");
    document.getElementById("botonMenu").classList.remove("d-none");

    /*
    // Se esconde el inicio
    document.getElementsByClassName("contenedorInicio").forEach(element => {
        element.classList.add("d-none");
    });
    
    // Se muestra el menu
    document.getElementsByClassName("contenedorMenu").forEach(element => {
        element.classList.remove("d-none");
    });*/

    // Se carga el header de la maquina elegida
    CargarDatosHeaderEstadoMaquina();

    ConsultaDatos_RegistrosEstado();
    // Se carga la pestaña de registro de estado
    //CargarDatosRegistroEstado();
}

function ItemMenu_Click(numItem){

    let array_menuItem = [];

    array_menuItem.push(document.getElementsByClassName("mi-re"));
    array_menuItem.push(document.getElementsByClassName("mi-tc"));
    array_menuItem.push(document.getElementsByClassName("mi-rp"));
    array_menuItem.push(document.getElementsByClassName("mi-es"));
    array_menuItem.push(document.getElementsByClassName("mi-rv"));
    array_menuItem.push(document.getElementsByClassName("mi-id"));

    array_visualData = [];

    array_visualData.push(document.getElementsByClassName("reg-est"));
    array_visualData.push(document.getElementsByClassName("tmp-ccl"));
    array_visualData.push(document.getElementsByClassName("reg-prd"));
    array_visualData.push(document.getElementsByClassName("est-sns"));
    array_visualData.push(document.getElementsByClassName("reg-evn"));
    array_visualData.push(document.getElementsByClassName("imp-dts"));

    // El item previamente seleccionado

    switch(ultMenuItem) {
        case NUM_ITEM_MENU_REG_EST:
            for(let val of array_menuItem[NUM_ITEM_MENU_REG_EST]) {
                val.classList.remove("active");
                val.classList.add("link-dark");
            }
            for(let val of array_visualData[NUM_ITEM_MENU_REG_EST]) {
                val.classList.add("d-none");
            }
        break;
        case NUM_ITEM_MENU_TMP_CCL:
            for(let val of array_menuItem[NUM_ITEM_MENU_TMP_CCL]) {
                val.classList.remove("active");
                val.classList.add("link-dark");
            }
            for(let val of array_visualData[NUM_ITEM_MENU_TMP_CCL]) {
                val.classList.add("d-none");
            }
        break;
        case NUM_ITEM_MENU_REG_PRD:
            for(let val of array_menuItem[NUM_ITEM_MENU_REG_PRD]) {
                val.classList.remove("active");
                val.classList.add("link-dark");
            }
            for(let val of array_visualData[NUM_ITEM_MENU_REG_PRD]) {
                val.classList.add("d-none");
            }
        break;
        case NUM_ITEM_MENU_EST_SNS:
            for(let val of array_menuItem[NUM_ITEM_MENU_EST_SNS]) {
                val.classList.remove("active");
                val.classList.add("link-dark");
            }
            for(let val of array_visualData[NUM_ITEM_MENU_EST_SNS]) {
                val.classList.add("d-none");
            }
        break;
        case NUM_ITEM_MENU_REG_EVN:
            for(let val of array_menuItem[NUM_ITEM_MENU_REG_EVN]) {
                val.classList.remove("active");
                val.classList.add("link-dark");
            }
            for(let val of array_visualData[NUM_ITEM_MENU_REG_EVN]) {
                val.classList.add("d-none");
            }
        break;
        case NUM_ITEM_MENU_IMP_DTS:
            for(let val of array_menuItem[NUM_ITEM_MENU_IMP_DTS]) {
                val.classList.remove("active");
                val.classList.add("link-dark");
            }
            for(let val of array_visualData[NUM_ITEM_MENU_IMP_DTS]) {
                val.classList.add("d-none");
            }
        break;
    }


    ultMenuItem = numItem;

    // El item seleccionado

    switch(numItem) {
        case NUM_ITEM_MENU_REG_EST:
            for(let val of array_menuItem[NUM_ITEM_MENU_REG_EST]) {
                val.classList.add("active");
                val.classList.remove("link-dark");
            }
            for(let val of array_visualData[NUM_ITEM_MENU_REG_EST]) {
                val.classList.remove("d-none");
            }
            ConsultaDatos_RegistrosEstado();
        break;
        case NUM_ITEM_MENU_TMP_CCL:
            for(let val of array_menuItem[NUM_ITEM_MENU_TMP_CCL]) {
                val.classList.add("active");
                val.classList.remove("link-dark");
            }
            for(let val of array_visualData[NUM_ITEM_MENU_TMP_CCL]) {
                val.classList.remove("d-none");
            }
            ConsultaDatos_TiemposCiclo();
        break;
        case NUM_ITEM_MENU_REG_PRD:
            for(let val of array_menuItem[NUM_ITEM_MENU_REG_PRD]) {
                val.classList.add("active");
                val.classList.remove("link-dark");
            }
            for(let val of array_visualData[NUM_ITEM_MENU_REG_PRD]) {
                val.classList.remove("d-none");
            }
            ConsultaDatos_RegistrosProduccion();
        break;
        case NUM_ITEM_MENU_EST_SNS:
            for(let val of array_menuItem[NUM_ITEM_MENU_EST_SNS]) {
                val.classList.add("active");
                val.classList.remove("link-dark");
            }
            for(let val of array_visualData[NUM_ITEM_MENU_EST_SNS]) {
                val.classList.remove("d-none");
            }
        break;
        case NUM_ITEM_MENU_REG_EVN:
            for(let val of array_menuItem[NUM_ITEM_MENU_REG_EVN]) {
                val.classList.add("active");
                val.classList.remove("link-dark");
            }
            for(let val of array_visualData[NUM_ITEM_MENU_REG_EVN]) {
                val.classList.remove("d-none");
            }
        break;
        case NUM_ITEM_MENU_IMP_DTS:
            for(let val of array_menuItem[NUM_ITEM_MENU_IMP_DTS]) {
                val.classList.add("active");
                val.classList.remove("link-dark");
            }
            for(let val of array_visualData[NUM_ITEM_MENU_IMP_DTS]) {
                val.classList.remove("d-none");
            }
        break;
    }
}


function CargarDatosHeaderEstadoMaquina() {

    let idMaq = sessionStorage.getItem("IdMaq");

    let listaMaquinas = new ListaMaquinas();

    let strJSON = sessionStorage.getItem("datos_listaMaquinas");
    listaMaquinas.IngresoDatosJSON(strJSON);


    let nombreMaq = listaMaquinas.GetNombre()[idMaq];
    let numeroMaq = listaMaquinas.GetNumero()[idMaq];
    //let estadoMaq = ParseoEstado(listaMaquinas.GetEstado()[idMaq]);

    // Actualizacion del header
    document.getElementById("header-titulo").textContent = "Maquina: "+nombreMaq+" Num: "+numeroMaq;
    let header_estado = document.getElementById("header-estado");

    switch(listaMaquinas.GetEstado()[idMaq]) {
        case NUM_ESTADO_MAQUINA_APAGADA:
                header_estado.textContent = "Apagada";
                header_estado.classList.add("alert-secondary");
                header_estado.classList.remove("alert-primary");
                header_estado.classList.remove("alert-success");
            break; 
        case NUM_ESTADO_MAQUINA_DETENIDA:
                header_estado.textContent = "Detenida";
                header_estado.classList.remove("alert-secondary");
                header_estado.classList.add("alert-primary");
                header_estado.classList.remove("alert-success");
            break;
        case NUM_ESTADO_MAQUINA_PRODUCIENDO:
                header_estado.textContent = "Produciendo";
                header_estado.classList.remove("alert-secondary");
                header_estado.classList.remove("alert-primary");
                header_estado.classList.add("alert-success");
            break;
        default:

    }
}



function CargarDatosRegistroEstado() {

    EliminarElemCreados();

    /// Carga de datos registro estados

    let tablaRegEstado = new TablaRegEstado();
    const data = sessionStorage.getItem("datos_RegistrosEstado");
    tablaRegEstado.IngresoDatosJSON(data);


    let cantElem = tablaRegEstado.GetCantElem();

    for(var i = 0; i < cantElem; i++) {

        let contenedorFila = document.createElement("TR");
        document.getElementById("tbdy_tabla_reg_est").appendChild(contenedorFila);
        elemCreadoPadre.push(contenedorFila);

        contenedorFila.innerHTML = `
            <td>${tablaRegEstado.GetGolpe(i)}</td>
            <td>${tablaRegEstado.GetEstado(i)}</td>
            <td>${tablaRegEstado.GetTInicio(i)}</td>
            <td>${tablaRegEstado.GetDuracionParseada(i)}</td>
        `;
    }


    // Acondicionamiento de datos para el grafico
    let arrayKeysVals = tablaRegEstado.GetDisplayChart();


    let ctxP = document.getElementById("GrafPiRegEstdo").getContext('2d');
    let myPieChart = new Chart(ctxP, {
        type: 'pie',
        data: {
            //labels: ["Red", "Green", "Yellow", "Grey", "Dark Grey"],
        labels: arrayKeysVals[0],        
        datasets: [{
            data: arrayKeysVals[1],                                    
            backgroundColor: ["#F7464A", "#46BFBD", "#FDB45C", "#949FB1", "#4D5360"],
            hoverBackgroundColor: ["#FF5A5E", "#5AD3D1", "#FFC870", "#A8B3C5", "#616774"]
        }]
        },
        options: {
        responsive: true,
        legend: {
            position: 'bottom'
        },
        title: {
        display: true,
        text: 'Gráfico de estado de máquina'
        }
        }
    });

}


function CargarDatosTiemposCiclo() {

    EliminarElemCreados();

    /// Cargar datos tiempo ciclo

    let tablaTiempoCiclo = new TablaTiempoCiclo();

    const data = sessionStorage.getItem("datos_TiemposCiclo");
    tablaTiempoCiclo.IngresoDatosJSON(data);
  
    
    /// Hacer grafico
    let arrayGMoldeAC = tablaTiempoCiclo.GetDatosGraficoMoldeAbiertoCerrado();

    let grafMldeAC = document.getElementById("GrafPiMoldeAbrtoCrrdo").getContext('2d');
    let piGrafMldeAC = new Chart(grafMldeAC, {
        type: 'pie',
        data: {
            labels: ["Molde abierto", "Molde cerrado"],
        datasets: [{
            data: [arrayGMoldeAC[0], arrayGMoldeAC[1]],                                    
            backgroundColor: ["#F7464A", "#46BFBD"],
            hoverBackgroundColor: ["#FF5A5E", "#5AD3D1"]
        }]
        },
        options: {
        responsive: true,
        legend: {
            position: 'bottom'
        },
        title: {
        display: true,
        text: 'Gráfico tiempo de molde'
        }
        }
    });



    // Grafico de barras tiempos ciclo

    let arrayGTCiclo = tablaTiempoCiclo.GetDatosGraficoTiemposCiclo();

    //console.log(arrayGTCiclo);

    let gradBarTCiclo = document.getElementById("GrafBarTmpsCclo");

    var myBarChart = new Chart(gradBarTCiclo, {
            type: 'bar',
            data: {
                //labels: ['Monday', 'Tuesday' , 'Wednesday' , 'Thursday' , 'Friday' , 'Saturday' , 'Sunday '],
                labels: ['Inyeccion', 'Carga', 'Succion'],
                datasets: [{
                    label: 'Tiempos',
                    data: [arrayGTCiclo[0], arrayGTCiclo[1], arrayGTCiclo[2]],
                    backgroundColor: ["#46BFBD", "#46BFBD", "#46BFBD"],
                    hoverBackgroundColor: ["#FF5A5E", "#FF5A5E", "#FF5A5E"]
                }]
            },
        
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                }
                
            }
    });

  
    
    let cantElem_tablaCiclo = tablaTiempoCiclo.GetCantElem();
    let datosTablaTC = tablaTiempoCiclo.GetDatosTabla();

    for(var i = 0; i < cantElem_tablaCiclo; i++) {

        let contenedorFila = document.createElement("TR");
        document.getElementById("tbdy_tabla_tmp_cclo").appendChild(contenedorFila);
        elemCreadoPadre.push(contenedorFila);

        contenedorFila.innerHTML = `
            <td>${datosTablaTC[0][i]}</td>
            <td>${datosTablaTC[1][i]}</td>
            <td>${datosTablaTC[2][i]}</td>
            <td>${datosTablaTC[3][i]}</td>
            <td>${datosTablaTC[4][i]}</td>
            <td>${datosTablaTC[5][i]}</td>
            <td>${datosTablaTC[6][i]}</td>
        `;
    }
}


function CargarDatosRegistroProduccion() {

    EliminarElemCreados();

    let tablaRegProd = new ClassRegProd();

    const data = sessionStorage.getItem("datos_RegistrosProduccion");
    tablaRegProd.IngresoDatosJSON(data);


    let dataEjeXRP = tablaRegProd.GetDatosPuntosX(0);
    let dataEjeYRP = tablaRegProd.GetDatosPuntosY(0);



    //line
    var canvasGrafRP = document.getElementById("GrafLineRegProd").getContext('2d');
    var grafLineRP = new Chart(canvasGrafRP, {
        type: 'line',
        data: {
            //labels: ["January", "February", "March", "April", "May", "June", "July"],
            labels: dataEjeXRP,
            datasets: [
                {
                    //label: "data",
                    label: tablaRegProd.GetFechayNombreTurnoActual(0),
                    //data: [65, 59, 80, 81, 56, 55, 40],
                    data: dataEjeYRP,
                    backgroundColor: ['rgba(105, 0, 132, .2)',],
                    borderColor: ['rgba(200, 99, 132, .7)',],
                    borderWidth: 2,
                    lineTension: 0,          /// valores de 0 a 1 (interpolacion)
                    showLine: true
                    //steppedLine: false
                },
                                //ACA SE PUEDEN VISUALIZAR VARIOS GRAFICOS SUPERPUESTOS
                /*
                {
                    label: "My Second dataset",
                    //data: [28, 48, 40, 19, 86, 27, 90],
                    data: dataEjeYRP.map(elem => elem+10),
                    backgroundColor: [
                        'rgba(0, 137, 132, .2)',
                    ],
                    borderColor: [
                        'rgba(0, 10, 130, .7)',
                    ],
                    borderWidth: 2
                }
                */
            ]
        },
        options: {
            responsive: true,
            showLine: true
        }
    });


    let dropdownRP = document.getElementById("dropdown_regProd");
    
    let cantTurnos = tablaRegProd.GetCantTurnos();
    let dropdownRP_divItems = [];
    let dropdownRP_Items = [];

    let nbreTurnosRP = tablaRegProd.GetNombreTurnos();
    let fechaRP = tablaRegProd.GetFecha();
    let cantProdRP = tablaRegProd.GetCantProd();
    

    for(let i = 0; i < cantTurnos; i++) {
    
        dropdownRP_divItems.push(document.createElement("LI"));
        dropdownRP.appendChild(dropdownRP_divItems[i]);
        elemCreadoPadre.push(dropdownRP_divItems[i]);

        dropdownRP_divItems[i].innerHTML = `
            <a class="dropdown-item">${fechaRP[i]}, ${nbreTurnosRP[i]}, cantProd: ${cantProdRP[i]}</a>
        `;
    }


    
    

    let cantElem_tablaRegProd = tablaRegProd.GetCantTurnos();
    let datosTablaRP = tablaRegProd.GetDatosTabla();

    for(var i = 0; i < cantElem_tablaRegProd; i++) {

        let contenedorFila = document.createElement("TR");
        document.getElementById("tbdy_tabla_reg_prod").appendChild(contenedorFila);
        elemCreadoPadre.push(contenedorFila);

        contenedorFila.innerHTML = `
            <td>${datosTablaRP[0][i]}</td>
            <td>${datosTablaRP[1][i]}</td>
            <td>${datosTablaRP[2][i]}</td>
        `;
    }

}


function ItemHeader_Inicio() {


    EliminarElemCreados();

    // Se esconde el inicio
    document.getElementById("contenedorMenu").classList.add("d-none");
    document.getElementById("botonMenu").classList.add("d-none");
    
    
    // Se muestra el menu
    document.getElementById("contenedorInicio").classList.remove("d-none");
    document.getElementById("botonCerrarSesion").classList.remove("d-none");

    // Se carga el inicio
    CargarMenuInicio();

}



function EliminarElemCreados() {


    for(let val of elemCreadoPadre) {
        val.remove();
    }

    elemCreadoPadre = [];
    elemCreadoPadre.splice(0, elemCreadoPadre.length);
}

















function ParseHoraMin(duracion) {
    if (duracion < 60) {
        duracion = duracion + " m";
    }else{
        let hora = parseInt(duracion/60);
        let min = duracion % 60;

        if(min == 0) {
            duracion = hora + "h";
        }else{
            duracion = hora + "h " + min + "m";
        }
    }
    return duracion;
}




function ParseFecha(fecha) {

    let strFecha = fecha.toString();

    let mes = strFecha.substr(-2, 2);
    let dia = strFecha.slice(0, -2);
    
    return dia + "/" + mes;
}



function ParseHora(horaNum) {

    let strHora = horaNum.toString();

    let min = strHora.substr(-2, 2);
    let hora = strHora.slice(0, -2);

    return hora + ":" + min;
}



function ParseoEstado(numEstado) {
    switch(numEstado){
        case NUM_ESTADO_MAQUINA_APAGADA:
            return "Apagada";
            break;
        case NUM_ESTADO_MAQUINA_DETENIDA:
            return "Detenida";
            break;
        case NUM_ESTADO_MAQUINA_PRODUCIENDO:
            return "Produciendo";
            break;
        default:
            return "none";
            break;
    }
}