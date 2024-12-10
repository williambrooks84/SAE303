
const templateFile = await fetch("src/ui/toprentals/template.html");
const template = await templateFile.text();


let TopRentalsView = {};

TopRentalsView.render = function(){
    return template;
}

export {TopRentalsView};