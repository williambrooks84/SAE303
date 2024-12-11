<?php
require_once "Controller.php";
require_once "Repository/MoviesRepository.php" ;


// This class inherits the jsonResponse method  and the $cnx propertye from the parent class Controller
// Only the process????Request methods need to be (re)defined.

class MoviesController extends Controller {

    private MoviesRepository $movie;

    public function __construct(){
        $this->movie = new MoviesRepository();
    }

   
    protected function processGetRequest(HttpRequest $request) {

        $id = $request->getId("id");
        if ($id){
            // URI is .../category/{id}
            $p = $this->movie->find($id);
            return $p==null ? false :  $p;
        }
        else{
            return $this->movie->findAll();
        }
    }

    protected function processPostRequest(HttpRequest $request) {
        return false;
    }
   
}

?>