<?php
/**
 *  Class Product
 * 
 *  Représente un produit avec uniquement 3 propriétés (id, name, category)
 * 
 *  Implémente l'interface JsonSerializable 
 *  qui oblige à définir une méthode jsonSerialize. Cette méthode permet de dire comment les objets
 *  de la classe Product doivent être converti en JSON. Voire la méthode pour plus de détails.
 */
class Sales implements JsonSerializable {
    private int $id; // id du produit
    private int $customer_id;
    private int $movie_id;
    private DateTime $purchase_date;
    private float $purchase_price;



    public function __construct(int $id){
        $this->id = $id;
    }

    /**
     * Get the value of id
     */ 
    public function getId(): int
    {
        return $this->id;
    }

    /**
     *  Define how to convert/serialize a Product to a JSON format
     *  This method will be automatically invoked by json_encode when apply to a Product
     * 
     *  En français : On sait qu'on aura besoin de convertir des Product en JSON pour les
     *  envoyer au client. La fonction json_encode sait comment convertir en JSON des données
     *  de type élémentaire. A savoir : des chaînes de caractères, des nombres, des booléens
     *  des tableaux ou des objets standards (stdClass). 
     *  Mais json_encode ne saura pas convertir un objet de type Product dont les propriétés sont
     *  privées de surcroit. Sauf si on définit la méthode JsonSerialize qui doit retourner une
     *  représentation d'un Product dans un format que json_encode sait convertir (ici un tableau associatif)
     * 
     *  Le fait que Product "implémente" l'interface JsonSerializable oblige à définir la méthode
     *  JsonSerialize et permet à json_encode de savoir comment convertir un Product en JSON.
     * 
     *  Parenthèse sur les "interfaces" : Une interface est une classe (abstraite en générale) qui
     *  regroupe un ensemble de méthodes. On dit que "une classe implémente une interface" au lieu de dire 
     *  que "une classe hérite d'une autre" uniquement parce qu'il n'y a pas de propriétés dans une "classe interface".
     * 
     *  Voir aussi : https://www.php.net/manual/en/class.jsonserializable.php
     *  
     */
    public function JsonSerialize(): mixed{
        return ["id" => $this->id, "customer_id" => $this->customer_id , "movie_id" => $this->movie_id , "purchase_date" => $this->purchase_date , "purchase_price" => $this->purchase_price];
    }


    public function setId(int $id): self {
        $this->id = $id;
        return $this;
    }

    
    /**
     * Get the value of name
     */ 
    public function getCustomerId()
    {
        return $this->customer_id;
    }

    /**
     * Set the value of name
     *
     * @return  self
     */ 
    public function setCustmerId($customer_id): self
    {
        $this->customer_id = $customer_id;
        return $this;
    }

    /**
     * Get the value of category
     */
    public function getMovieId()    {
        return $this->movie_id;
    }

    /**
     * Set the value of category
     *
     * @return  self
     */ 

    public function setMovieId($movie_id): self   {
        $this->movie_id = $movie_id;
        return $this;
    }

    public function getPurchaseDate()    {
        return $this->purchase_date;
    }

    /**
     * Set the value of category
     *
     * @return  self
     */

    public function setPurchaseDate($purchase_date): self   {
        $this->purchase_date = $purchase_date;
        return $this;
    }

    public function getPurchasePrice()    {
        return $this->purchase_price;
    }

    /**
     * Set the value of category
     *
     * @return  self
     */ 

    public function setPurchasePrice($purchase_price): self   {
        $this->purchase_price = $purchase_price;
        return $this;
    }


}