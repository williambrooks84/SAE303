<?php
require_once "Controller.php";
require_once "Repository/SalesRepository.php" ;


// This class inherits the jsonResponse method  and the $cnx propertye from the parent class Controller
// Only the process????Request methods need to be (re)defined.

class SalesController extends Controller {

    private SalesRepository $sale;

    public function __construct(){
        $this->sale = new SalesRepository();
    }

   
    protected function processGetRequest(HttpRequest $request) {

        $stat = $request->getParam("stat");
        if ($stat=='salesThisMonth'){
            return $this->sale->salesThisMonth();
        }
        if ($stat=='topSalesThisMonth'){
            return $this->sale->topSalesThisMonth();
        }
        if ($stat=='totalSalesByMonth'){
            return $this->sale->totalSalesByMonth();
        }
        if ($stat=='totalSalesByMonthAndGenre'){
            return $this->sale->totalSalesByMonthAndGenre();
        }
        if ($stat=='salesByCountry'){
            return $this->sale->salesByCountry();
        }

        $id = $request->getId("id");
        if ($id){
            // URI is .../category/{id}
            $p = $this->sale->find($id);
            return $p==null ? false :  $p;
        }
        else{
            return $this->sale->findAll();
        }
    }

    protected function processPostRequest(HttpRequest $request) {
        return false;
    }
   
}

?>