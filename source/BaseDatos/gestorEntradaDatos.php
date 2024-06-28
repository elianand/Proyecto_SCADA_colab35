<?php

    //***************************************** 
    //
    //  Este archivo se encarga de recibir los datos de los dispositivos IOT y almacenarlos en la base de datos
    //
    //  El codigo clave es el codigo de maquina que es lo primero que se envia
    //
    //
    //  Este codigo esta muy relacionado con el formato del String datos del dispositivo
    //
    //
    //  Se utiliza el metodo HTTP GET para la comunicacion
    //
    //
    //*****************************************




    //La consulta es https://ejemplo256.000webhostapp.com/test/get.php?apples=50&oranges=120


    //E05=0&t0=20200323132548&E03=0&t1=20200323132549
    
    $hola = "";
    
    include "raiz.php";


    
    
    
    
    
    if(isset($_GET) && count($_GET) != 0) {

        echo " Get count: ".count($_GET);

        // Create connection
        $conexion = new mysqli($host, $nombreUsuario, $contrasenia, $baseDatos);

        // Check connection
        if ($conexion->connect_error) {
            die("Connection failed: " . $conexion->connect_error);
        }else {
            echo "Coenctado Exitosamente\n";
        }



        
        $arryKey = array_keys($_GET);

        $arryVal = [];

        for($i = 0; $i < count($_GET); $i++) {

            $arryVal[$i] = $_GET[$arryKey[$i]];
            
            $hola = $hola . "Key: " . $arryKey[$i]."\n";
            $hola = $hola . "Val: " . $arryVal[$i]."\n";
        }

        if($arryKey[0] == "M") {

            $codMaq = (int) $arryVal[0];

            echo "codMaquina: ".strval($codMaq);

            echo " elem= ".count($arryKey);

            for($i = 1; $i < count($arryKey); $i++) {

                $key = preg_replace('/[0-9]+/', '', $arryKey[$i]);

                echo " key: ".$key;

                if($key == "E") {

                    $arrayRes = DevolverDosCampos($arryVal[$i]);
                    $codEvento = "EVNT00".AgregarCeros($arrayRes[0]) . $arrayRes[0];
                    $tiempo = $arrayRes[1];

                    echo " Cod evento: ".$codEvento. " tiempo: ".$tiempo;

                    //M=1&E=5,20200415121830&E=2,20200415121830
                    $sqlInsert1 =    "insert into EventosPorMaquina(codMaq, codEvnt, fechaTiempo, valor) values
                                    ('$codMaq', '$codEvento', '$tiempo', null)";

                    InsertIntoBaseDeDatos($sqlInsert1, $conexion);

                }else if($key == "C") {

                    $arrayRes = DevolverCuatroCampos($arryVal[$i]);
                    $tiempoCiclo = $arrayRes[0];
                    $tiempoInyeccion = $arrayRes[1];
                    $tiempoCarga = $arrayRes[2];
                    $tiempo = $arrayRes[3];

                    echo " TCiclo: ".$tiempoCiclo." TIny: ".$tiempoInyeccion." TCarga: ".$tiempoCarga. " tiempo: ".$tiempo;

                    $sqlInsert1 =    "insert into EventosPorMaquina(codMaq, codEvnt, fechaTiempo, valor) values
                                    ('$codMaq', 'EVNT0050', '$tiempo', '$tiempoCiclo')";

                    $sqlInsert2 =    "insert into EventosPorMaquina(codMaq, codEvnt, fechaTiempo, valor) values
                                    ('$codMaq', 'EVNT0051', '$tiempo', '$tiempoInyeccion')";

                    $sqlInsert3 =    "insert into EventosPorMaquina(codMaq, codEvnt, fechaTiempo, valor) values
                                    ('$codMaq', 'EVNT0052', '$tiempo', '$tiempoCarga')";

                    InsertIntoBaseDeDatos($sqlInsert1, $conexion);
                    InsertIntoBaseDeDatos($sqlInsert2, $conexion);
                    InsertIntoBaseDeDatos($sqlInsert3, $conexion);

                }else if($key == "T") {

                    $arrayRes = DevolverCuatroCampos($arryVal[$i]);
                    $tiempoEncendida = $arrayRes[0];
                    $tiempoProduciendo = $arrayRes[1];
                    $cantGolpes = $arrayRes[2];
                    $tiempo = $arrayRes[3];

                    echo " TEnc: ".$tiempoEncendida." TProd: ".$tiempoProduciendo." cant Golpes: ".$cantGolpes." tiempo: ".$tiempo;

                    $sqlInsert1 =    "insert into EventosPorMaquina(codMaq, codEvnt, fechaTiempo, valor) values
                                    ('$codMaq', 'EVNT0030', '$tiempo', '$tiempoEncendida')";

                    $sqlInsert2 =    "insert into EventosPorMaquina(codMaq, codEvnt, fechaTiempo, valor) values
                                    ('$codMaq', 'EVNT0031', '$tiempo', '$tiempoProduciendo')";

                    $sqlInsert3 =    "insert into EventosPorMaquina(codMaq, codEvnt, fechaTiempo, valor) values
                                    ('$codMaq', 'EVNT0040', '$tiempo', '$cantGolpes')";

                    InsertIntoBaseDeDatos($sqlInsert1, $conexion);
                    InsertIntoBaseDeDatos($sqlInsert2, $conexion);
                    InsertIntoBaseDeDatos($sqlInsert3, $conexion);
                }else if($key == "EV") {

                    $arrayRes = DevolverTresCampos($arryVal[$i]);
                    $codEvento = "EVNT00".AgregarCeros($arrayRes[0]) . $arrayRes[0];
                    $valEvento = $arrayRes[1];
                    $tiempo = $arrayRes[2];

                    echo " codEvnt: ".$codEvento." valEvnt: ".$valEvento." tiempo: ".$tiempo;

                    $sqlInsert1 =    "insert into EventosPorMaquina(codMaq, codEvnt, fechaTiempo, valor) values
                                    ('$codMaq', '$codEvento', '$tiempo', '$valEvento')";

                    InsertIntoBaseDeDatos($sqlInsert1, $conexion);
                }else if($key == "S") {
                    
                    //M=1&S=1,0,20210823121830&S=2,1,20210823121830
                    $arrayRes = DevolverTresCampos($arryVal[$i]);
                    $codEvento = "Sns00".AgregarCeros($arrayRes[0]) . $arrayRes[0];
                    $valEvento = $arrayRes[1];
                    $tiempo = $arrayRes[2];

                    echo " codEvnt: ".$codEvento." valEvnt: ".$valEvento." tiempo: ".$tiempo;

                    $sqlInsert1 =    "insert into ValoresDeSensores(codMaq, codSensor, fecha_hora, valor) values
                                    ('$codMaq', '$codEvento', '$tiempo', '$valEvento')";
                    
                    InsertIntoBaseDeDatos($sqlInsert1, $conexion);
                }
            }
        }
    }
    
    function DevolverDosCampos($str) {

        echo " func Campo: ";

        echo " String: ".$str;
        
        $index = 0;

        //echo " index: ".$index;

        $arrayRes[0] = substr($str, $index, strpos($str, ",", $index)-$index);

        //echo " HOLAAAA:< ".$arrayRes[0];
        $index = strpos($str, ",") + 1;
        $arrayRes[1] = substr($str, $index);
        
        return $arrayRes;
    }

    function DevolverCuatroCampos($str) {

        $index = 0;

        $arrayRes[0] = substr($str, $index, strpos($str, ",", $index)-$index);
        $index = strpos($str, ",", $index) + 1;
        $arrayRes[1] = substr($str, $index, strpos($str, ",", $index)-$index);
        $index = strpos($str, ",", $index) + 1;
        $arrayRes[2] = substr($str, $index, strpos($str, ",", $index)-$index);
        $index = strpos($str, ",", $index) + 1;
        $arrayRes[3] = substr($str, $index);
        
        return $arrayRes;
    }

    function DevolverTresCampos($str) {

        $index = 0;

        $arrayRes[0] = substr($str, $index, strpos($str, ",", $index)-$index);
        $index = strpos($str, ",", $index) + 1;
        $arrayRes[1] = substr($str, $index, strpos($str, ",", $index)-$index);
        $index = strpos($str, ",", $index) + 1;
        $arrayRes[2] = substr($str, $index);
        
        return $arrayRes;
    }


    function InsertIntoBaseDeDatos($consulta, $conexion) {

        if($conexion->query($consulta) === TRUE) {
            echo "  query completada exitosa\n";
        } else {
            echo "query fallida exitosamente". $sql . "<br>" . $conexion->error."<br> ". $consulta;
        }
    }

    
    function AgregarCeros($str) {
        
        if(strlen($str) == 1) {
            return "0";
        }else if(strlen($str) == 2) {
            return "";
        }
    }


/*
    $codMaq = "1";
    $codEv = "EVNT0003";
    $fT = "2020-03-20T10:34:09";
    $val = "1";

    $sqlInsert = "INSERT INTO EventosPorMaquina (codMaq, codEvnt, fechaTiempo, valor) VALUES 
    ('$codMaq', '$codEv', '$fT', '$val')";





    if($conexion->query($sqlInsert) === TRUE) {
        $hola = $hola. "query completada exitosa\n";
        echo "query completada exitosa\n";
    } else {
        $hola = $hola. "query fallida exitosamente". $sqlInsert . "\n" . $conexion->error."\n";
        echo "query fallida exitosamente\n". $sqlInsert . "\n" . $conexion->error."\n";
    }


*/


    
    //Comentado por ahora



    
    /*
    

    if(isset($_GET) && count($_GET) != 0) {

        $arryKey = array_keys($_GET);

        $arryVal = [];

        for($i = 0; $i < count($_GET); $i++) {

            $arryVal[$i] = $_GET[$arryKey[$i]];

            $hola = $hola . "Key: " . $arryKey[$i]."\n";
            $hola = $hola . "Val: " . $arryVal[$i]."\n";
        }

        $hola = $hola . "Filas: ".count($arryKey)."\n";
        $hola = $hola . "Array armado\n";
        
        $hola = $hola . strval(count($arryKey). "\n");

        if($arryKey[0] == "CM") {       //codigo maquina
            $codMaq = (int) $arryVal[0];
            
            for($i = 0; $i < ((strval(count($arryKey))-1)/2); $i++) {

                $nombreEvento = substr($arryKey[$i*2+1], 1);
                $nombreEvento = substr_replace($nombreEvento, "VNT00", 1, -2);
                $fechaHora = substr_replace($arryVal[$i*2+2], "-", 4, 0);
                $fechaHora = substr_replace($fechaHora, "-", 7, 0);
                $fechaHora = substr_replace($fechaHora, "T", 10, 0);
                $fechaHora = substr_replace($fechaHora, ":", 13, 0);
                $fechaHora = substr_replace($fechaHora, ":", 16, 0);

                $hola = $hola . "(".strval($codMaq).", ".$nombreEvento.", ".$fechaHora.", ".$arryVal[$i*2+1].")\n";

                $valor = $arryVal[$i*2+1];
                
                $sqlInsert =    "insert into EventosPorMaquina(codMaq, codEvnt, fechaTiempo, valor) values
                                ('$codMaq', '$nombreEvento', '$fechaHora', '$valor')";

                if($conexion->query($sqlInsert) === TRUE) {
                    $hola = $hola. "query completada exitosa\n";
                } else {
                    $hola = $hola. "query fallida exitosamente". $sql . "<br>" . $conn->error."<br>";
                }

            }

        }

        


        



      


    }   

    /*
    if ( isset ( $_GET['apples'] ) && isset ( $_GET['oranges'] ) ){
        $var1 = $_GET['apples'];
        $var2 = $_GET['oranges'];
    }
    
    

    if (isset($_GET['E01'])) {
        echo "data puerta del abierta";
        $hola = $hola . "evento puerta delantera abierta";
    }

    if (isset($_GET['E03'])) {
        echo "data trasera del abierta";
        $hola = $hola . "evento puerta trasera abierta";
    }

    if (isset($_GET['E05'])) {
        echo "data push emergencia";
        $hola = $hola . "evento push emergencia";
    }

    if (isset($_GET['E06'])) {
        echo "data val  cierre";
        $hola = $hola . "evento valv cierre";
    }

    if (isset($_GET['E07'])) {
        echo "data val abre";
        $hola = $hola . "evento valv abre";
    }

    if (isset($_GET['E08'])) {
        echo "data auto";
        $hola = $hola . "evento auto";
    }
    */


    /*$fileContent = "you have ". $var1 . " apples, and " . $var2 . " oranges.\n";

    $fileStatus = file_put_contents('myFile.txt', $fileContent, FILE_APPEND);
    if($fileStatus != false) {
        echo "SUCCESS: data written to file";
    }else {
        echo "FAIL: could not write to file";
    }*/


    

    //$fileContent = "you have ". $var1 . " apples, and " . $var2 . " oranges.\n";
    /*
    if($hola != "") {
        $fileContent = $hola . "\n";
        $fileStatus = file_put_contents('myFile.txt', $fileContent, FILE_APPEND);
        if($fileStatus != false) {
            echo "SUCCESS: data written to file";
        }else {
            echo "FAIL: could not write to file";
        }

    }else {
        echo "ningun mensaje para escribir";
    }

    */










?>


