const fs = require("fs");
const {createCanvas, loadImage } = require("canvas");

const console = require("console");
//Size of the .png
const canvas = createCanvas(1000,1000);
const ctx = canvas.getContext("2d");

const {layers, width, height} = require("./input/config.js");
//Select how many verisons
const edition = 1;
//Once you selected the layers, you export it in the output section
const saveLayer = (_canvas, _edition)=> {
    fs.writeFileSync(`./output/./${_edition}.png`,_canvas.toBuffer("image/png"));
}
//Go through the layers and draw each of them
const drawLayer = async(_layer, _edition) => {
    //Pick a random element from the list of possible sections
    let element = _layer.elements[Math.floor(Math.random()* _layer.elements.length)];
    const image = await loadImage(`${_layer.location}${element.fileName}`);
    ctx.drawImage(image,_layer.position.x,_layer.position.y,_layer.size.width,_layer.size.height);
    console.log(`I created the ${_layer.name} layer, and choose element ${element.name}`);
    saveLayer(canvas, _edition);
}
//Make all the different editions
for(let i = 1; i <= edition; i++){
    layers.forEach(layer => {
        drawLayer(layer, i);
    });
    console.log("Creating edition "+ i);
}
