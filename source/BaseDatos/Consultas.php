<?php

    // Funcion que se utiliza para listar todas las maquinas cargadas
    // Utilidad para el menu inicio
    // Parametros entrada: ninguno 
    // Salida idMaq, nMaq, nombre maq
    function Consulta1() {
        return "SELECT idCod as idMaq, nMaq, nombre FROM Maquinas";
    }

    // Funcion que se utiliza para saber el estado de la maquina
    // Devuelve la fecha y el estado del ultimo registro, si la
    // constante de TIEMPO_ESTADO_DESCONEXION es menor a la fecha
    // hora, entonces la maquina esta apagada
    // Parametros entrada: ninguno 
    // Salida idMaq, fechaHora, valEstado
    function Consulta2() {
        return "SELECT codmaq as idMaq, fechaTiempo as fechaHora, MIN(valor) AS valEstado FROM EventosPorMaquina 
        WHERE CONCAT(CONVERT(codmaq, CHAR), CONVERT(fechaTiempo, CHAR)) in (
            SELECT DISTINCT CONCAT(CONVERT(codmaq, CHAR), CONVERT(max(fechatiempo), CHAR)) 
            FROM EventosPorMaquina WHERE codEvnt='EVNT0020' GROUP BY codMaq 
        )
        GROUP BY codMaq, fechatiempo ORDER BY codmaq ASC";
    }

    // ????????????????????????????????????????????????? NOse que hace esta funcion
    function Consulta3($codMaq) {
        return "SELECT Sensores.descripcion as tipoSensor, ValoresDeSensores.fecha_hora as fecha_hora, valor FROM ValoresDeSensores 
        inner join Sensores on ValoresDeSensores.codSensor = Sensores.codSensor
        inner join (SELECT codSensor, max(fecha_hora) as fecha_hora FROM ValoresDeSensores WHERE codMaq = '$codMaq' 
        group by codSensor) as subTabla on ValoresDeSensores.codSensor = subTabla.codSensor and 
        ValoresDeSensores.fecha_hora = subTabla.fecha_hora";
        
        /*
        SELECT s.descripcion as tipoSensor, max(fecha_hora) as fecha_hora, valor FROM ValoresDeSensores v 
        inner join sensores s on s.codSensor = v.codSensor WHERE codMaq =  group by v.codSensor";
        */
    }

    function Consulta4($idUsuaio) {
        return "SELECT nombreEmpresa, email FROM Usuarios WHERE idCod = '$idUsuaio'";
    }

    /// Estaba funcion listaba los 50 ultimos turnos (Manana, tarde, noche) y en cada uno te indica cuanto 
    //  tiempo estuvo, encendida, produciendo y apagada.
    //  Esto no sirve mas, ahora se debe buscar en el ultimo turno, como los eventos de la maquina
    //  Ver pestana registro de estados
    function Consulta5($codMaq, $cantMaxFilas) {

        return "SELECT sum(cantGolpes) as cantGolpes, sum(tEncendida) as tEncendida, sum(tProduciendo) as tProduciendo, sum(tEncendida) - sum(tProduciendo) as tDetenida, nombreTurno, convert(fechaTiempo, date) as fecha from (
            select null as cantGolpes, nombreTurno, fechaTiempo, valor as tEncendida, null as tProduciendo, null as n2 from (
                select fechaTiempo, valor from EventosPorMaquina where codMaq = '$codMaq' and (codEvnt = 'EVNT0030')
            ) as evntTiempo inner join Turnos on (
                (
                    CONVERT(evntTiempo.fechaTiempo, time) > Turnos.inicioTurno 
                )and(
                    CONVERT(evntTiempo.fechaTiempo, time) < Turnos.finTurno
                )
            ) union all (
                select null as vari, nombreTurno, fechaTiempo, null as n2, valor, null as n3 from (
                    select fechaTiempo, valor from EventosPorMaquina where codMaq = '$codMaq' and codEvnt = 'EVNT0031'
                ) as evntTiempo inner join Turnos on (
                    (
                        CONVERT(evntTiempo.fechaTiempo, time) > Turnos.inicioTurno 
                    )and(
                        CONVERT(evntTiempo.fechaTiempo, time) < Turnos.finTurno
                    )
                )
            ) union all (
                select ifnull(valor, 'golpe') as vari, nombreTurno, fechaTiempo as fecha, null as n1, null as n2, null as n3 from (
                    select fechaTiempo, valor from EventosPorMaquina where codMaq = '$codMaq' and codEvnt = 'EVNT0040'
                ) as evntTiempo inner join Turnos on (
                    (
                        CONVERT(evntTiempo.fechaTiempo, time) > Turnos.inicioTurno 
                    )and(
                        CONVERT(evntTiempo.fechaTiempo, time) < Turnos.finTurno
                    )
                )
            )
        )as a group by nombreTurno, convert(fechaTiempo, date) order by convert(fechaTiempo, date) desc, convert(fechaTiempo, time) asc limit ".$cantMaxFilas;
    }



    function Consulta6($codMaq, $fecha, $turno, $cantMaxFilas) {

        return " SELECT max(tCiclo) as tCiclo, max(tInyeccion) as tInyeccion, max(tCarga) as tCarga, hora from (
            select valor as tCiclo, null as tInyeccion, null as tCarga, convert(fechatiempo, time) as hora from EventosPorMaquina
            where codMaq = '$codMaq' and codEvnt = 'EVNT0050' and ( 
                fechaTiempo > CONCAT (
                    '$fecha', (select inicioTurno from
                    (select nombreTurno, inicioTurno from Turnos inner join TurnosPorMaquina on Turnos.idTurno = TurnosPorMaquina.codTurno 
                    where TurnosPorMaquina.codMaq = '$codMaq' order by TurnosPorMaquina.codTurno asc) a
                    where nombreTurno = '$turno' limit 1)
                )
            ) and (
                fechaTiempo < CONCAT(
                    '$fecha ', (select finTurno from
                    (select nombreTurno, finTurno from Turnos inner join TurnosPorMaquina on Turnos.idTurno = TurnosPorMaquina.codTurno 
                    where TurnosPorMaquina.codMaq = '$codMaq' order by TurnosPorMaquina.codTurno asc) a
                    where nombreTurno = '$turno' limit 1)
                )
            )
            union all (
                select null as tCiclo, valor as tInyeccion, null as tCarga, convert(fechatiempo, time) as hora from EventosPorMaquina
                where codMaq = '$codMaq' and codEvnt = 'EVNT0051' and ( 
                    fechaTiempo > CONCAT (
                        '$fecha ', (select inicioTurno from
                        (select nombreTurno, inicioTurno from Turnos inner join TurnosPorMaquina on Turnos.idTurno = TurnosPorMaquina.codTurno 
                        where TurnosPorMaquina.codMaq = '$codMaq' order by TurnosPorMaquina.codTurno asc) a
                        where nombreTurno = '$turno' limit 1)
                    )
                ) and (
                    fechaTiempo < CONCAT(
                        '$fecha ', (select finTurno from
                        (select nombreTurno, finTurno from Turnos inner join TurnosPorMaquina on Turnos.idTurno = TurnosPorMaquina.codTurno 
                        where TurnosPorMaquina.codMaq = '$codMaq' order by TurnosPorMaquina.codTurno asc) a
                        where nombreTurno = '$turno' limit 1)
                    )
                )
            )union all (
                select null as tCiclo, null as tInyeccion, valor as tCarga, convert(fechatiempo, time) as hora from EventosPorMaquina
                where codMaq = '$codMaq' and codEvnt = 'EVNT0052' and ( 
                    fechaTiempo > CONCAT (
                        '$fecha ', (select inicioTurno from
                        (select nombreTurno, inicioTurno from Turnos inner join TurnosPorMaquina on Turnos.idTurno = TurnosPorMaquina.codTurno 
                        where TurnosPorMaquina.codMaq = '$codMaq' order by TurnosPorMaquina.codTurno asc) a
                        where nombreTurno = '$turno' limit 1)
                    )
                ) and (
                    fechaTiempo < CONCAT(
                        '$fecha ', (select finTurno from
                        (select nombreTurno, finTurno from Turnos inner join TurnosPorMaquina on Turnos.idTurno = TurnosPorMaquina.codTurno 
                        where TurnosPorMaquina.codMaq = '$codMaq' order by TurnosPorMaquina.codTurno asc) a
                        where nombreTurno = '$turno' limit 1)
                    )
                )
            )
        )as q1 group by hora order by hora desc limit ".$cantMaxFilas;
    }

    function Consulta7($nUsuario) {

        return "SELECT idCod, nombreUsuario, contrasena, dadoDeAlta FROM Usuarios WHERE nombreUsuario = '$nUsuario'";
    }

    function Consulta8($nUsuario) {

        return "SELECT idCod FROM Usuarios WHERE nombreUsuario = '$nUsuario'";
    }

    function ConsultaUpdate8($nUsuarioAnterior, $nombre, $apellido, $email, $nUsuario, $contrasena) {
        return "UPDATE Usuarios SET nombre='$nombre', apellido='$apellido', nombreEmpresa='vacio', nombreUsuario='$nUsuario', contrasena='$contrasena', email='$email', dadoDeAlta=true WHERE nombreUsuario = '$nUsuarioAnterior'";
    }

    function Consulta9($codMaq, $cantMaxFilas) {
        return "SELECT max(tCiclo) as tCiclo, max(tInyeccion) as tInyeccion, max(tCarga) as tCarga, fecha_hora from (
            select valor as tCiclo, null as tInyeccion, null as tCarga, fechaTiempo as fecha_hora from EventosPorMaquina
            where codMaq ='$codMaq' and codEvnt = 'EVNT0050'  
            union all (
                select null as tCiclo, valor as tInyeccion, null as tCarga, fechaTiempo as fecha_hora from EventosPorMaquina
                where codMaq ='$codMaq' and codEvnt = 'EVNT0051' 
            )union all (
                select null as tCiclo, null as tInyeccion, valor as tCarga, fechaTiempo as fecha_hora from EventosPorMaquina
                where codMaq ='$codMaq' and codEvnt = 'EVNT0052' 
            )
        )as q1 group by fecha_hora order by fecha_hora desc limit ".$cantMaxFilas;
    }

    function Consulta10($codMaq) {
        return "SELECT codmaq as codMaq, fechaTiempo, MIN(valor) AS valor FROM EventosPorMaquina 
        WHERE CONCAT(CONVERT(codmaq, CHAR), CONVERT(fechaTiempo, CHAR)) in (
            SELECT DISTINCT CONCAT(CONVERT(codmaq, CHAR), CONVERT(max(fechatiempo), CHAR)) 
            FROM EventosPorMaquina WHERE codEvnt='EVNT0020' and codMaq = '$codMaq' 
        )
        GROUP BY fechatiempo limit 1";
    }

/*


    select codMaq, fechaTiempo from EventosPorMaquina where codEvnt = EVNT0031

    function Consulta6a($codMaq, $fecha, $turno, $cantMaxFilas) {

        return " SELECT max(tCiclo) as tCiclo, max(tInyeccion) as tInyeccion, max(tCarga) as tCarga, hora from (
            select valor as tCiclo, null as tInyeccion, null as tCarga, convert(fechatiempo, time) as hora from EventosPorMaquina
            where codMaq = 1 and codEvnt = 'EVNT0050' and ( 
                fechaTiempo > CONCAT (
                    '2020-03-20', (select inicioTurno from
                    (select nombreTurno, inicioTurno from Turnos inner join TurnosPorMaquina on Turnos.idTurno = TurnosPorMaquina.codTurno 
                    where TurnosPorMaquina.codMaq = 1 order by TurnosPorMaquina.codTurno asc) a
                    where nombreTurno = 'Manana' limit 1)
                )
            ) and (
                fechaTiempo < CONCAT(
                    '2020-03-20', (select finTurno from
                    (select nombreTurno, finTurno from Turnos inner join TurnosPorMaquina on Turnos.idTurno = TurnosPorMaquina.codTurno 
                    where TurnosPorMaquina.codMaq = 1 order by TurnosPorMaquina.codTurno asc) a
                    where nombreTurno = 'Manana' limit 1)
                )
            )
            union all (
                select null as tCiclo, valor as tInyeccion, null as tCarga, convert(fechatiempo, time) as hora from EventosPorMaquina
                where codMaq = 1 and codEvnt = 'EVNT0051' and ( 
                    fechaTiempo > CONCAT (
                        '2020-03-20', (select inicioTurno from
                        (select nombreTurno, inicioTurno from Turnos inner join TurnosPorMaquina on Turnos.idTurno = TurnosPorMaquina.codTurno 
                        where TurnosPorMaquina.codMaq = 1 order by TurnosPorMaquina.codTurno asc) a
                        where nombreTurno = 'Manana' limit 1)
                    )
                ) and (
                    fechaTiempo < CONCAT(
                        '2020-03-20', (select finTurno from
                        (select nombreTurno, finTurno from Turnos inner join TurnosPorMaquina on Turnos.idTurno = TurnosPorMaquina.codTurno 
                        where TurnosPorMaquina.codMaq = 1 order by TurnosPorMaquina.codTurno asc) a
                        where nombreTurno = 'Manana' limit 1)
                    )
                )
            )union all (
                select null as tCiclo, null as tInyeccion, valor as tCarga, convert(fechatiempo, time) as hora from EventosPorMaquina
                where codMaq = 1 and codEvnt = 'EVNT0052' and ( 
                    fechaTiempo > CONCAT (
                        '2020-03-20', (select inicioTurno from
                        (select nombreTurno, inicioTurno from Turnos inner join TurnosPorMaquina on Turnos.idTurno = TurnosPorMaquina.codTurno 
                        where TurnosPorMaquina.codMaq = 1 order by TurnosPorMaquina.codTurno asc) a
                        where nombreTurno = 'Manana' limit 1)
                    )
                ) and (
                    fechaTiempo < CONCAT(
                        '2020-03-20', (select finTurno from
                        (select nombreTurno, finTurno from Turnos inner join TurnosPorMaquina on Turnos.idTurno = TurnosPorMaquina.codTurno 
                        where TurnosPorMaquina.codMaq = 1 order by TurnosPorMaquina.codTurno asc) a
                        where nombreTurno = 'Manana' limit 1)
                    )
                )
            )
        )as q1 group by hora order by hora asc limit ".$cantMaxFilas;




        SELECT count(cantGolpes) as cantGolpes, sum(tEncendida) as tEncendida, sum(tProduciendo) as tProduciendo, sum(tEncendida) - sum(tProduciendo) as tDetenida, nombreTurno, convert(fechaTiempo, date) as fecha from (
            select null as cantGolpes, nombreTurno, fechaTiempo, valor as tEncendida, null as tProduciendo, null as n2 from (
                select fechaTiempo, valor from EventosPorMaquina where codMaq = 1 and (codEvnt = 'EVNT0030')
            ) as evntTiempo inner join Turnos on (
                (
                    CONVERT(evntTiempo.fechaTiempo, time) > Turnos.inicioTurno 
                )and(
                    CONVERT(evntTiempo.fechaTiempo, time) < Turnos.finTurno
                )
            ) union all (
                select null as vari, nombreTurno, fechaTiempo, null as n2, valor, null as n3 from (
                    select fechaTiempo, valor from EventosPorMaquina where codMaq = 1 and codEvnt = 'EVNT0031'
                ) as evntTiempo inner join Turnos on (
                    (
                        CONVERT(evntTiempo.fechaTiempo, time) > Turnos.inicioTurno 
                    )and(
                        CONVERT(evntTiempo.fechaTiempo, time) < Turnos.finTurno
                    )
                )
            ) union all (
                select ifnull(valor, 'golpe') as vari, nombreTurno, fechaTiempo as fecha, null as n1, null as n2, null as n3 from (
                    select fechaTiempo, valor from EventosPorMaquina where codMaq = 1 and codEvnt = 'EVNT0040'
                ) as evntTiempo inner join Turnos on (
                    (
                        CONVERT(evntTiempo.fechaTiempo, time) > Turnos.inicioTurno 
                    )and(
                        CONVERT(evntTiempo.fechaTiempo, time) < Turnos.finTurno
                    )
                )
            )
        )as a group by nombreTurno, convert(fechaTiempo, date) order by convert(fechaTiempo, date) desc, convert(fechaTiempo, time) asc limit 500;






























    }*/
?>