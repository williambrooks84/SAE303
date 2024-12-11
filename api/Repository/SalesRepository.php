<?php

require_once("Repository/EntityRepository.php");
require_once("Class/Sales.php");


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
class SalesRepository extends EntityRepository {

    public function __construct(){
        // appel au constructeur de la classe mère (va ouvrir la connexion à la bdd)
        parent::__construct();
    }

    public function find($id): ?Sales{
        /*
            La façon de faire une requête SQL ci-dessous est "meilleur" que celle vue
            au précédent semestre (cnx->query). Notamment l'utilisation de bindParam
            permet de vérifier que la valeur transmise est "safe" et de se prémunir
            d'injection SQL.
        */
        $requete = $this->cnx->prepare("select * from Sales where id=:value"); // prepare la requête SQL
        $requete->bindParam(':value', $id); // fait le lien entre le "tag" :value et la valeur de $id
        $requete->execute(); // execute la requête
        $answer = $requete->fetch(PDO::FETCH_OBJ);
        
        if ($answer==false) return null; // may be false if the sql request failed (wrong $id value for example)
        
        $p = new Sales($answer->id);
        $p-> setCustomerId($answer->customer_id);
        $p-> setMovieId($answer->movie_id);
        $p-> setPurchaseDate($answer->purchase_date);
        $p-> setPurchasePrice($answer->purchase_price);
        return $p;
    }

    public function findAll(): array {
        $requete = $this->cnx->prepare("select * from Sales");
        $requete->execute();
        $answer = $requete->fetchAll(PDO::FETCH_OBJ);

        $res = [];
        foreach($answer as $obj){
            $p = new Sales($obj->id);
            $p-> setCustomerId($obj->customer_id);
            $p-> setMovieId($obj->movie_id);
            $p-> setPurchaseDate($obj->purchase_date);
            $p-> setPurchasePrice($obj->purchase_price);
            array_push($res, $p);
        }
       
        return $res;
    }

    public function salesThisMonth(){
        $requete = $this->cnx->prepare("SELECT sum(purchase_price) from Sales where MONTH(purchase_date)=MONTH(CURRENT_DATE()) && YEAR(purchase_date)=YEAR(CURRENT_DATE())");
        $requete->execute();
        $answer = $requete->fetchAll(PDO::FETCH_OBJ);
        return $answer;
    }

    public function topSalesThisMonth(){
        $requete = $this->cnx->prepare("SELECT m.movie_title FROM ( SELECT s.movie_id, SUM(s.purchase_price) AS total_sales FROM Sales s WHERE s.purchase_date >= DATE_SUB(CURRENT_DATE, INTERVAL 1 MONTH) GROUP BY s.movie_id ORDER BY total_sales DESC LIMIT 3 ) AS sub_query JOIN Movies m ON sub_query.movie_id = m.id;");
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