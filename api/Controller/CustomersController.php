<?php
require_once "Controller.php";
require_once "Repository/CustomersRepository.php" ;


// This class inherits the jsonResponse method  and the $cnx propertye from the parent class Controller
// Only the process????Request methods need to be (re)defined.

class CustomersController extends Controller {

    private CustomersRepository $customer;

    public function __construct(){
        $this->customer = new CustomersRepository();
    }

   
    protected function processGetRequest(HttpRequest $request) {
        $id = $request->getId("id");
        if ($id){
            // URI is .../category/{id}
            $p = $this->customer->find($id);
            return $p==null ? false :  $p;
        }
        else{
            return $this->customer->findAll();
        }
    }

    protected function processPostRequest(HttpRequest $request) {
        return false;
    }
   
}

?>