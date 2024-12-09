<?php

require_once("Repository/EntityRepository.php");
require_once("Class/Movies.php");


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
class MoviesRepository extends EntityRepository {

    public function __construct(){
        // appel au constructeur de la classe mère (va ouvrir la connexion à la bdd)
        parent::__construct();
    }

    public function find($id): ?Movies{
        /*
            La façon de faire une requête SQL ci-dessous est "meilleur" que celle vue
            au précédent semestre (cnx->query). Notamment l'utilisation de bindParam
            permet de vérifier que la valeur transmise est "safe" et de se prémunir
            d'injection SQL.
        */
        $requete = $this->cnx->prepare("select * from Movies where id=:value"); // prepare la requête SQL
        $requete->bindParam(':value', $id); // fait le lien entre le "tag" :value et la valeur de $id
        $requete->execute(); // execute la requête
        $answer = $requete->fetch(PDO::FETCH_OBJ);
        
        if ($answer==false) return null; // may be false if the sql request failed (wrong $id value for example)
        
        $p = new Movies($answer->id);
        $p->setMovieTitle($answer->title);
        $p->setGenre($answer->genre);
        $p->setReleaseDate($answer->release_date);
        $p->setDurationMinutes($answer->duration_minutes);
        $p->setRating($answer->rating);
        return $p;
    }

    public function findAll(): array {
        $requete = $this->cnx->prepare("select * from Movies");
        $requete->execute();
        $answer = $requete->fetchAll(PDO::FETCH_OBJ);

        $res = [];
        foreach($answer as $obj){
            $p = new Movies($obj->id);
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