import { getRequest, postRequest } from "../lib/api-request.js";

let SaleData = {
    sales: [],
};

SaleData.get = function () {
    return {
        sales: [...this.sales],
    };
};

SaleData.add = function(item){
        this.sales.push(item);
};

SaleData.save = async function (data) {
    try {
        let response = await postRequest("sales", JSON.stringify(data)); // Use postRequest here

        if (!response) {
            console.error("Server responded with an error");
            return false;
        }

        return response;
    } catch (error) {
        console.error("Error in SaleData.save:", error);
        return false;
    }
};

// genere une méthode delete qui supprime un élément d'identifiant itemid
SaleData.delete = async function (itemid) {
    let data = await deleteRequest("sales/" + itemid);
    return data === false ? [] : [data];
};

SaleData.update = async function (itemid) {
    let data = await patchRequest("sales/" + itemid);
    return data === false ? [] : [data];
};

SaleData.fetch = async function (id) {
    let data = await getRequest("sales/" + id);
    return data === false ? [] : [data];
};

SaleData.fetchAll = async function () {
    let data = await getRequest("sales");
    return data;
};

SaleData.fetchCurrentMonth = async function(){
    let data = await getRequest("sales?stat=salesThisMonth");
    return data;
}

SaleData.fetchTopSalesCurrentMonth = async function(){
    let data = await getRequest("sales?stat=topSalesThisMonth");
    return data;
}

SaleData.fetchTotalSalesByMonth = async function(){
    let data = await getRequest("sales?stat=totalSalesByMonth");
    return data;
}

SaleData.fetchTotalSalesByMonthAndGenre = async function(){
    let data = await getRequest("sales?stat=totalSalesByMonthAndGenre");
    return data;
}

SaleData.fetchSalesByCountry = async function(){
    let data = await getRequest("sales?stat=salesByCountry");
    return data;
}

SaleData.fetchSalesByMovieID = async function(idMovie){
    let data = await getRequest("sales?stat=salesByMovie&idMovie="+idMovie);
    return data;
}

export { SaleData };