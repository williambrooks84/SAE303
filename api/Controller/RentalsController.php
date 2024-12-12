<?php
require_once "Controller.php";
require_once "Repository/RentalsRepository.php" ;


// This class inherits the jsonResponse method  and the $cnx propertye from the parent class Controller
// Only the process????Request methods need to be (re)defined.

class RentalsController extends Controller {

    private RentalsRepository $rental;

    public function __construct(){
        $this->rental = new RentalsRepository();
    }

   
    protected function processGetRequest(HttpRequest $request) {

        $stat = $request->getParam("stat");
        if ($stat=='rentalsThisMonth'){
            return $this->rental->rentalsThisMonth();
        }
        if ($stat=='topRentalsThisMonth'){
            return $this->rental->topRentalsThisMonth();
        }
        if ($stat=='totalRentalsByMonth'){
            return $this->rental->totalRentalsByMonth();
        }
        if ($stat=='totalRentalsByMonthAndGenre'){
            return $this->rental->totalRentalsByMonthAndGenre();
        }
        if ($stat=='rentalsByCountry'){
            return $this->rental->rentalsByCountry();
        }
        if ($stat=='rentalsByMovie'){
            $idMovie = $request->getParam("idMovie");
            return $this->rental->rentalsByMovie($idMovie);
        }

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