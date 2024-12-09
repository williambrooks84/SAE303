import { genericRenderer } from "../../lib/utils.js"; 

const templateFile = await fetch("src/ui/header/template.html");
const template = await templateFile.text();


let HeaderView = {
    render: function(data){
        let combinedData = { items: data };
        let html = genericRenderer(template, combinedData);
        return html;
    }
}

export {HeaderView};