
const templateFile = await fetch("src/ui/rentalscounter/template.html");
const template = await templateFile.text();


let RentalsCounterView = {};

RentalsCounterView.render = function(){
    return template;
}

export {RentalsCounterView};