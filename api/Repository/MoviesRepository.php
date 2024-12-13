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
        $requete = $this->cnx->prepare("SELECT * FROM Movies ORDER BY movie_title;");
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

    public function getGenres(){
        $requete = $this->cnx->prepare("SELECT DISTINCT genre FROM Movies;");
        $requete->execute();
        $answer = $requete->fetchAll(PDO::FETCH_OBJ);
        return $answer;
    }

    public function getDataConsumedByCountry(){
        $requete = $this->cnx->prepare("WITH MovieData AS (SELECT id AS movie_id, duration_minutes / 60.0 * 2.7 AS data_consumption_gb FROM Movies), Transactions AS (SELECT customer_id, movie_id, DATE_FORMAT(rental_date, '%Y-%m') AS month, 'rental' AS transaction_type FROM Rentals WHERE rental_date >= DATE_SUB(CURDATE(), INTERVAL 12 MONTH) UNION ALL SELECT customer_id, movie_id, DATE_FORMAT(purchase_date, '%Y-%m') AS month, 'purchase' AS transaction_type FROM Sales WHERE purchase_date >= DATE_SUB(CURDATE(), INTERVAL 12 MONTH)), CustomerTransactions AS (SELECT t.customer_id, c.country, t.month, m.data_consumption_gb FROM Transactions t JOIN Customers c ON t.customer_id = c.id JOIN MovieData m ON t.movie_id = m.movie_id) SELECT country, month, ROUND(SUM(data_consumption_gb), 2) AS total_data_consumed_gb FROM CustomerTransactions GROUP BY country, month ORDER BY country, month;");
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