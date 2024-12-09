<?php
require_once "Controller.php";
require_once "Repository/RentalsRepository.php" ;


// This class inherits the jsonResponse method  and the $cnx propertye from the parent class Controller
// Only the process????Request methods need to be (re)defined.

class RentalsController extends Controller {

    private RentalsRepository $rental;

    public function __construct(){
        $this->rental = new MoviesRepository();
    }

   
    protected function processGetRequest(HttpRequest $request) {
        $id = $request->getId("id");
        if ($id){
            // URI is .../category/{id}
            $p = $this->rental->find($id);
            return $p==null ? false :  $p;
        }
        else{
            return $this->rental->findAll();
        }
    }

    protected function processPostRequest(HttpRequest $request) {
        return false;
    }
   
}

?>