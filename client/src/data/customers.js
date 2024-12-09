import { getRequest, postRequest } from "../lib/api-request.js";

let CustomerData = {
    customers: [],
};

CustomerData.get = function () {
    return {
        customers: [...this.customers],
    };
};

CustomerData.add = function(item){
        this.customers.push(item);
};

CustomerData.save = async function (data) {
    try {
        let response = await postRequest("customers", JSON.stringify(data)); // Use postRequest here

        if (!response) {
            console.error("Server responded with an error");
            return false;
        }

        return response;
    } catch (error) {
        console.error("Error in CustomerData.save:", error);
        return false;
    }
};

// genere une méthode delete qui supprime un élément d'identifiant itemid
CustomerData.delete = async function (itemid) {
    let data = await deleteRequest("customers/" + itemid);
    return data === false ? [] : [data];
};

CustomerData.update = async function (itemid) {
    let data = await patchRequest("customers/" + itemid);
    return data === false ? [] : [data];
};

CustomerData.fetch = async function (id) {
    let data = await getRequest("customers/" + id);
    return data === false ? [] : [data];
};

CustomerData.fetchAll = async function () {
    let data = await getRequest("customers");
    return data;
};

export { CustomerData };