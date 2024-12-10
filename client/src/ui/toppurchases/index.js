
const templateFile = await fetch("src/ui/toppurchases/template.html");
const template = await templateFile.text();


let TopPurchasesView = {};

TopPurchasesView.render = function(){
    return template;
}

export {TopPurchasesView};