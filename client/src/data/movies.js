import { getRequest, postRequest } from "../lib/api-request.js";

let MovieData = {
    movies: [],
};

MovieData.get = function () {
    return {
        movies: [...this.movies],
    };
};

MovieData.add = function(item){
        this.movies.push(item);
};

MovieData.save = async function (data) {
    try {
        let response = await postRequest("movies", JSON.stringify(data)); // Use postRequest here

        if (!response) {
            console.error("Server responded with an error");
            return false;
        }

        return response;
    } catch (error) {
        console.error("Error in MovieData.save:", error);
        return false;
    }
};

// genere une méthode delete qui supprime un élément d'identifiant itemid
MovieData.delete = async function (itemid) {
    let data = await deleteRequest("movies/" + itemid);
    return data === false ? [] : [data];
};

MovieData.update = async function (itemid) {
    let data = await patchRequest("movies/" + itemid);
    return data === false ? [] : [data];
};

MovieData.fetch = async function (id) {
    let data = await getRequest("movies/" + id);
    return data === false ? [] : [data];
};

MovieData.fetchAll = async function () {
    let data = await getRequest("movies");
    return data;
};

MovieData.fetchGenres = async function(){
    let data  = await getRequest("movies?type=getGenres");
    return data;
}

MovieData.fetchDataConsumedByCountry = async function(){
    let data = await getRequest("movies?stat=getDataConsumedByCountry");
    return data;
}

export { MovieData };