<?php

    header("Access-Control-Allow-Origin: *");

    if(isset($_REQUEST['hola'])) {

        //echo "hola mundo";
        /*
        echo `{"arrayMaquinas":[{"id":0,"numero":1,"nombre":"R-180","estado":0},{"id":1,"numero":2,"nombre":"FluidMec - 800","estado":1},{"id":2,"numero":3,"nombre":"FluidMec - 870","estado":2},{"id":3,"numero":4,"nombre":"F-870-870ta","estado":2},{"id":4,"numero":5,"nombre":"R-280","estado":1},{"id":5,"numero":6,"nombre":"FluidMec - 100","estado":0},{"id":6,"numero":7,"nombre":"F-570","estado":2},{"id":7,"numero":8,"nombre":"Techmation-1500","estado":2},{"id":8,"numero":9,"nombre":"Techmation-980","estado":1},{"id":9,"numero":10,"nombre":"Techmation-150","estado":0},{"id":10,"numero":11,"nombre":"Techmation-760","estado":2}]}
        */
        $var = '{"arrayMaquinas":[{"id":0,"numero":1,"nombre":"R-180","estado":0},{"id":1,"numero":2,"nombre":"FluidMec - 800","estado":1},{"id":2,"numero":3,"nombre":"FluidMec - 870","estado":2},{"id":3,"numero":4,"nombre":"F-870-870ta","estado":2},{"id":4,"numero":5,"nombre":"R-280","estado":1},{"id":5,"numero":6,"nombre":"FluidMec - 100","estado":0},{"id":6,"numero":7,"nombre":"F-570","estado":2},{"id":7,"numero":8,"nombre":"Techmation-1500","estado":2},{"id":8,"numero":9,"nombre":"Techmation-980","estado":1},{"id":9,"numero":10,"nombre":"Techmation-150","estado":0},{"id":10,"numero":11,"nombre":"Techmation-760","estado":2}]}';
    
        echo $var;
    }
    

?>  









