import { getRequest, postRequest } from "../lib/api-request.js";

let RentalData = {
    rentals: [],
};

RentalData.get = function () {
    return {
        rentals: [...this.rentals],
    };
};

RentalData.add = function(item){
        this.rentals.push(item);
};

RentalData.save = async function (data) {
    try {
        let response = await postRequest("movies", JSON.stringify(data)); // Use postRequest here

        if (!response) {
            console.error("Server responded with an error");
            return false;
        }

        return response;
    } catch (error) {
        console.error("Error in RentalData.save:", error);
        return false;
    }
};

// genere une méthode delete qui supprime un élément d'identifiant itemid
RentalData.delete = async function (itemid) {
    let data = await deleteRequest("rentals/" + itemid);
    return data === false ? [] : [data];
};

RentalData.update = async function (itemid) {
    let data = await patchRequest("rentals/" + itemid);
    return data === false ? [] : [data];
};

RentalData.fetch = async function (id) {
    let data = await getRequest("rentals/" + id);
    return data === false ? [] : [data];
};

RentalData.fetchAll = async function () {
    let data = await getRequest("rentals");
    return data;
};

RentalData.fetchCurrentMonth = async function(){
    let data = await getRequest("rentals?stat=rentalsThisMonth");
    return data;
}

RentalData.fetchTopRentalsCurrentMonth = async function(){
    let data = await getRequest("rentals?stat=topRentalsThisMonth");
    return data;
}

RentalData.fetchTotalRentalsByMonth = async function(){
    let data = await getRequest("rentals?stat=totalRentalsByMonth");
    return data;
}

RentalData.fetchTotalRentalsByMonthAndGenre = async function(){
    let data = await getRequest("rentals?stat=totalRentalsByMonthAndGenre");
    return data;
}


export { RentalData };