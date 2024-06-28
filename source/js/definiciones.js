/*

Coderhouse - Curso javascript
Entrega final
Elian andrenacci


En este script se generan las clases para guardar los datos



*/






//  --------        INICIO      -------------------------

class ItemTablaRegEstado {

    constructor(nroGolpe, estdo, tIncio, duracion) {
        this.nroGolpe = nroGolpe;
        this.estdo = estdo;
        this.tIncio = tIncio;
        this.duracion = duracion;
    }

}


/// En esta clase se almacena el array de los items de la tabla
/// Ademas se implementan funciones para una mejor performance
class TablaRegEstado {
    
    constructor() {
        this.ArrayItemTablaRegEstado = [];
    }

    AgregarElemento(nroGolpe, estdo, tIncio, duracion) {
        this.ArrayItemTablaRegEstado.push(new ItemTablaRegEstado(nroGolpe, estdo, tIncio, duracion)); 
    }

    IngresoDatosJSON(strJSON) {

        let objJSON = JSON.parse(strJSON);

        for(let elem of objJSON.ArrayItemTablaRegEstado) {
            this.AgregarElemento(elem.nroGolpe, elem.estdo, elem.tIncio, elem.duracion);
        }
    }

    GetGolpe(nElem) {
        return this.ArrayItemTablaRegEstado[nElem].nroGolpe;
    }

    GetEstado(nElem) {
        return this.ArrayItemTablaRegEstado[nElem].estdo;
    }

    GetTInicio(nElem) {
        return this.ArrayItemTablaRegEstado[nElem].tIncio;
    }

    GetDuracion(nElem) {
        return this.ArrayItemTablaRegEstado[nElem].duracion;
    }

    GetDuracionParseada(nElem) {
        return ParseHoraMin(this.ArrayItemTablaRegEstado[nElem].duracion);
    }

    

    GetDisplayChart() {

        let arrayInitKeys = this.ArrayItemTablaRegEstado.map(elem => elem.estdo);
        let arrayInitVals = this.ArrayItemTablaRegEstado.map(elem => elem.duracion);
        

        let arrayKeys = [];
        let arrayVals = [];
        
        
        // Se crea el nuevo array
        for(let val of arrayInitKeys) {
            if(!arrayKeys.includes(val)) {
                arrayKeys.push(val);
                arrayVals.push(0);
            }
        }

        // Se suma las duraciones
        for(let i = 0; i < arrayInitKeys.length; i++) {
            let indx = arrayKeys.indexOf(arrayInitKeys[i]);
            
            arrayVals[indx] += arrayInitVals[i];
        }


        let arrayKeysVals = [arrayKeys, arrayVals];
        return arrayKeysVals;
    }

    GetCantElem() {
        return this.ArrayItemTablaRegEstado.length;
    }

}

//  ----------       FIN         --------------------







//  --------        INICIO      ---------------------

class ItemTablaTiempoCiclo {
    constructor(nroGolpe, inyc, carg, succ, mldCrdo, mldAbrto, tmpCiclo) {
        this.nroGolpe = nroGolpe;
        this.inyc = inyc;
        this.carg = carg;
        this.succ = succ;
        this.mldCrdo = mldCrdo;
        this.mldAbrto = mldAbrto;
        this.tmpCiclo = tmpCiclo;
    }
}


class TablaTiempoCiclo {
    
    constructor() {
        this.ArrayItemTablaTiempoCiclo = [];
    }

    AgregarElemento(nroGolpe, inyc, carg, succ, mldCrdo, mldAbrto, tmpCiclo) {
        this.ArrayItemTablaTiempoCiclo.push(new ItemTablaTiempoCiclo(nroGolpe, inyc, carg, succ, mldCrdo, mldAbrto, tmpCiclo)); 
    }

    IngresoDatosJSON(strJSON) {

        let objJSON = JSON.parse(strJSON);

        for(let elem of objJSON.ArrayItemTablaTiempoCiclo) {
            this.AgregarElemento(elem.nroGolpe, elem.inyc, elem.carg, elem.succ, elem.mldCrdo, elem.mldAbrto, elem.tmpCiclo);
        }
    }

    GetGolpe(nElem) {
        return this.ArrayItemTablaTiempoCiclo[nElem].nroGolpe;
    }

    GetTInyeccion(nElem) {
        return this.ArrayItemTablaTiempoCiclo[nElem].inyc;
    }

    GetTCarga(nElem) {
        return this.ArrayItemTablaTiempoCiclo[nElem].carg;
    }

    GetTSuccion(nElem) {
        return this.ArrayItemTablaTiempoCiclo[nElem].succ;
    }

    GetTMoldeCerrado(nElem) {
        return this.ArrayItemTablaTiempoCiclo[nElem].mldCrdo;
    }

    GetTMoldeAbierto(nElem) {
        return this.ArrayItemTablaTiempoCiclo[nElem].mldAbrto;
    }

    GetTMoldeAbierto(nElem) {
        return this.ArrayItemTablaTiempoCiclo[nElem].mldAbrto;
    }

    GetDatosGraficoMoldeAbiertoCerrado() {

        let tiempoMoldeAbierto, tiempoMoldeCerrado;
        tiempoMoldeAbierto = 0;
        tiempoMoldeCerrado = 0;

        for(let val of this.ArrayItemTablaTiempoCiclo) {
            tiempoMoldeAbierto += val.mldAbrto;
            tiempoMoldeCerrado += val.mldCrdo;
        }

        tiempoMoldeAbierto = tiempoMoldeAbierto / this.ArrayItemTablaTiempoCiclo.length;
        tiempoMoldeCerrado = tiempoMoldeCerrado / this.ArrayItemTablaTiempoCiclo.length;

        let arrayMoldeAbiertoCerrado = [tiempoMoldeAbierto, tiempoMoldeCerrado];
        return arrayMoldeAbiertoCerrado;
    }

    GetDatosGraficoTiemposCiclo() {

        let tInyecc, tCarga, tSuccion;
        tInyecc = tCarga = tSuccion = 0;

        for(let val of this.ArrayItemTablaTiempoCiclo) {
            tInyecc  += val.inyc;
            tCarga   += val.carg;
            tSuccion += val.succ;
        }

        let divisor = this.ArrayItemTablaTiempoCiclo.length;

        tInyecc  = tInyecc / divisor;
        tCarga   = tCarga / divisor;
        tSuccion = tSuccion / divisor;

        let arrayTiemposCiclo = [tInyecc, tCarga, tSuccion];
        return arrayTiemposCiclo;
    }

    GetDatosTabla() {
        let arraySalida = [
            this.ArrayItemTablaTiempoCiclo.map(elem => elem.nroGolpe),
            this.ArrayItemTablaTiempoCiclo.map(elem => elem.inyc),
            this.ArrayItemTablaTiempoCiclo.map(elem => elem.carg),
            this.ArrayItemTablaTiempoCiclo.map(elem => elem.succ),
            this.ArrayItemTablaTiempoCiclo.map(elem => elem.mldCrdo),
            this.ArrayItemTablaTiempoCiclo.map(elem => elem.mldAbrto),
            this.ArrayItemTablaTiempoCiclo.map(elem => elem.tmpCiclo)
        ];

        return arraySalida;
    }


    GetCantElem() {
        return this.ArrayItemTablaTiempoCiclo.length;
    }

}

//  ----------       FIN         --------------------








//  --------        INICIO      ---------------------

class ItemRegProdDato {
    constructor(id, hora, prodAcum) {
        this.id = id;
        this.hora = hora;
        this.prodAcum = prodAcum;
    }
}

class ItemRegProdDatoTurno {
    constructor(id, fecha, idTurno, cantProd) {
        this.id = id;
        this.fecha = fecha;
        this.idTurno = idTurno;
        this.cantProd = cantProd;
    }
}

class ItemRegProdNombreTurno {
    constructor(idTurno, nombreTurno) {
        this.idTurno = idTurno;
        this.nombreTurno = nombreTurno;
    }
}

class ClassRegProd {
    constructor() {
        this.arrayRegProdP = [];
        this.arrayRegProdTG = [];
        this.arrayRegProdNT = [];
    }

    AgregarElemDato(id, hora, prodAcum) {
        this.arrayRegProdP.push(new ItemRegProdDato(id, hora, prodAcum)); 
    }
    AgregarElemDatoTurno(id, fecha, idTurno, cantProd) {
        this.arrayRegProdTG.push(new ItemRegProdDatoTurno(id, fecha, idTurno, cantProd)); 
    }
    AgregarElemNombreTurno(idTurno, nombreTurno) {
        this.arrayRegProdNT.push(new ItemRegProdNombreTurno(idTurno, nombreTurno)); 
    }

    IngresoDatosJSON(strJSON) {
        
        let objJSON = JSON.parse(strJSON);

        for(let elem of objJSON.arrayRegProdP) {
            this.AgregarElemDato(elem.id, elem.hora, elem.prodAcum);
        }
        for(let elem of objJSON.arrayRegProdTG) {
            this.AgregarElemDatoTurno(elem.id, elem.fecha, elem.idTurno, elem.cantProd);
        }
        for(let elem of objJSON.arrayRegProdNT) {
            this.AgregarElemNombreTurno(elem.idTurno, elem.nombreTurno);
        }
    }

    GetFechayNombreTurnoActual(nroTurno) {
        return this.GetFecha()[nroTurno] + " " + this.GetNombreTurnos()[nroTurno];
    }

    GetDatosPuntosX(id) {
        let arraySalida = [];

        for(let val of this.arrayRegProdP){
            if(val.id == id) {
                arraySalida.push(ParseHora(val.hora));
            }
        }

        return arraySalida;
    }

    GetDatosPuntosY(id) {
        let arraySalida = [];

        for(let val of this.arrayRegProdP){
            if(val.id == id) {
                arraySalida.push(val.prodAcum);
            }
        }

        return arraySalida;
    }

    GetCantTurnos() {
        return this.arrayRegProdTG.length;
    }

    GetNombreTurnos() {
        let arrayNbresSalida = [];

        for(let listTurnos of this.arrayRegProdTG) {
            for(let listNomTrns of this.arrayRegProdNT) {
                if(listTurnos.idTurno == listNomTrns.idTurno) {
                    arrayNbresSalida.push(listNomTrns.nombreTurno);
                    break;
                }
            }
        }
        
        return arrayNbresSalida;
    }

    GetFecha() {
        return this.arrayRegProdTG.map(elem => ParseFecha(elem.fecha));
    }

    GetCantProd() {
        return this.arrayRegProdTG.map(elem => elem.cantProd);
    }

    GetDatosTabla() {
        let arraySalida = [];

        arraySalida.push(this.GetFecha());
        arraySalida.push(this.GetNombreTurnos());
        arraySalida.push(this.GetCantProd());

        return arraySalida;
    }

}

//  ----------       FIN         --------------------






//  --------        INICIO      ---------------------

class ItemMaquina {
    constructor(id, numero, nombre, estado) {
        this.id = id;
        this.numero = numero;
        this.nombre = nombre;
        this.estado = estado;
    }
}

class ListaMaquinas {
    constructor() {
        this.arrayMaquinas = [];
    }

    AgregarElem(id, numero, nombre, estado) {
        this.arrayMaquinas.push(new ItemMaquina(id, numero, nombre, estado)); 
    }

    IngresoDatosJSON(strJSON) {
        let objJSON = JSON.parse(strJSON);


        for(let elem of objJSON.arrayMaquinas) {
            this.AgregarElem(elem.id, elem.numero, elem.nombre, elem.estado);
        }
    }

    GetId() {
        return this.arrayMaquinas.map(elem => elem.id);
    }

    GetNumero() {
        return this.arrayMaquinas.map(elem => elem.numero);
    }

    GetNombre() {
        return this.arrayMaquinas.map(elem => elem.nombre);
    }

    GetEstado() {
        return this.arrayMaquinas.map(elem => elem.estado);
    }

    GetCantMaquinas() {
        return this.arrayMaquinas.length;
    }

    GetDatosMaquinas() {
        let arraySalida = [];

        arraySalida.push(this.GetId());
        arraySalida.push(this.GetNumero());
        arraySalida.push(this.GetNombre());
        arraySalida.push(this.GetEstado());

        return arraySalida;
    }

}

//  --------        FIN         ---------------------
