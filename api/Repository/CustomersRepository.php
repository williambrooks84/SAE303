<?php

require_once("Repository/EntityRepository.php");
require_once("Class/Customers.php");


/**
 *  Classe ProductRepository
 * 
 *  Cette classe représente le "stock" de Product.
 *  Toutes les opérations sur les Product doivent se faire via cette classe 
 *  qui tient "synchro" la bdd en conséquence.
 * 
 *  La classe hérite de EntityRepository ce qui oblige à définir les méthodes  (find, findAll ... )
 *  Mais il est tout à fait possible d'ajouter des méthodes supplémentaires si
 *  c'est utile !
 *  
 */
class CustomersRepository extends EntityRepository {

    public function __construct(){
        // appel au constructeur de la classe mère (va ouvrir la connexion à la bdd)
        parent::__construct();
    }

    public function find($id): ?Customers{
        /*
            La façon de faire une requête SQL ci-dessous est "meilleur" que celle vue
            au précédent semestre (cnx->query). Notamment l'utilisation de bindParam
            permet de vérifier que la valeur transmise est "safe" et de se prémunir
            d'injection SQL.
        */
        $requete = $this->cnx->prepare("select * from Customers where id=:value"); // prepare la requête SQL
        $requete->bindParam(':value', $id); // fait le lien entre le "tag" :value et la valeur de $id
        $requete->execute(); // execute la requête
        $answer = $requete->fetch(PDO::FETCH_OBJ);
        
        if ($answer==false) return null; // may be false if the sql request failed (wrong $id value for example)
        
        $p = new Customers($answer->id);
        $p->setFirstName($answer->firs_name);
        $p->setLastName($answer->last_name);
        $p->setEmail($answer->email);
        $p->setCountry($answer->country);
        $p->setCity($answer->city);
        $p->setLatitude($answer->lat);
        $p->setLongitude($answer->lng);
        return $p;
    }

    public function findAll(): array {
        $requete = $this->cnx->prepare("select * from Customers");
        $requete->execute();
        $answer = $requete->fetchAll(PDO::FETCH_OBJ);

        $res = [];
        foreach($answer as $obj){
            $p = new Customers($obj->id);
            $p->setFirstName($obj->firs_name);
            $p->setLastName($obj->last_name);
            $p->setEmail($obj->email);
            $p->setCountry($obj->country);  
            $p->setCity($obj->city);
            $p->setLatitude($obj->lat);
            $p->setLongitude($obj->lng);
            array_push($res, $p);
        }
       
        return $res;
    }

    public function moviesByCustomerID($idCustomer){
        $requete = $this->cnx->prepare("SELECT DISTINCT m.movie_title, m.genre FROM Customers c LEFT JOIN Sales s ON c.id = s.customer_id LEFT JOIN Rentals r ON c.id = r.customer_id AND s.movie_id != r.movie_id LEFT JOIN Movies m ON s.movie_id = m.id OR r.movie_id = m.id WHERE c.id = :idCustomer ORDER BY m.movie_title;");
        $requete->bindParam(':idCustomer', $idCustomer);
        $requete->execute();
        $answer = $requete->fetchAll(PDO::FETCH_OBJ);
        return $answer;
    }

    public function save($product){
        // Not implemented ! TODO when needed !          
        return false;
    }

    public function delete($id){
        // Not implemented ! TODO when needed !
        return false;
    }

    public function update($product){
        // Not implemented ! TODO when needed !
        return false;
    }

   
    
}