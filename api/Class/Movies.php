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
class Movies implements JsonSerializable {
    private int $id; // id du produit
    private string $movie_title;
    private string $genre;
    private string $release_date;
    private int $duration_minutes;
    private float $rating;


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
        return ["id" => $this->id, "movie_title" => $this->movie_title , "genre" => $this->genre , "release_date" => $this->release_date , "duration_minutes" => $this->duration_minutes , "rating" => $this->rating];
    }

    /**
     * Get the value of name
     */ 
    public function getMovieTitle()
    {
        return $this->movie_title;
    }

    /**
     * Set the value of name
     *
     * @return  self
     */ 
    public function setMovieTitle($movie_title): self
    {
        $this->movie_title = $movie_title;
        return $this;
    }

    /**
     * Set the value of id
     *
     * @return  self
     */ 
    public function setId($id): self
    {
        $this->id = $id;
        return $this;
    }

 /**
     * Set the value of id
     *
     * @return  self
     */ 

    public function getGenre(): string  {
        return $this->genre;
    }  

    public function setGenre($genre): self
    {
        $this->genre = $genre;
        return $this;
    }

    public function getReleaseDate(): string
    {
        return $this->release_date;
    }

    public function setReleaseDate($release_date): self
    {
        $this->release_date = $release_date;
        return $this;
    }

    public function getDurationMinutes(): int
    {
        return $this->duration_minutes;
    }

    public function setDurationMinutes($duration_minutes): self
    {
        $this->duration_minutes = $duration_minutes;
        return $this;
    }

    public function getRating(): float
    {
        return $this->rating;
    }

    public function setRating($rating): self
    {
        $this->rating = $rating;
        return $this;
    }

}