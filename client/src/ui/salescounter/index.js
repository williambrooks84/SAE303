
const templateFile = await fetch("src/ui/salescounter/template.html");
const template = await templateFile.text();


let SalesCounterView = {};

SalesCounterView.render = function(){
    return template;
}

export {SalesCounterView};