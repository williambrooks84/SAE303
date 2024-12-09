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
        $p->setMovieTitle($answer->movie_title);
        $p->setGenre($answer->genre);
        $p->setReleaseDate($answer->release_date);
        $p->setDurationMinutes($answer->duration_minutes);
        $p->setRating($answer->rating);
        return $p;
    }

    public function findAll(): array {
        $requete = $this->cnx->prepare("SELECT * FROM Movies");
        $requete->execute();
        $answer = $requete->fetchAll(PDO::FETCH_OBJ);  // Fetch all rows as an array of objects
    
        $res = [];
        foreach ($answer as $obj) {
            $p = new Movies($obj->id);  // Access properties of each object
            $p->setMovieTitle($obj->movie_title);
            $p->setGenre($obj->genre);
            $p->setReleaseDate($obj->release_date);
            $p->setDurationMinutes($obj->duration_minutes);
            $p->setRating($obj->rating);
            array_push($res, $p);  // Add the movie object to the result array
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