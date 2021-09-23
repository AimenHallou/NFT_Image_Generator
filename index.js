const fs = require("fs");
const myArgs = process.argv.slice(2);
const {
    createCanvas,
    loadImage
} = require("canvas");
const {
    layers,
    width,
    height
} = require("./input/config.js");

const console = require("console");
//Size of the .png
const canvas = createCanvas(1000, 1000);
const ctx = canvas.getContext("2d");

//Select how many verisons
const editionSize = myArgs.length > 0 ? Number(myArgs[0]) : 1;

var metaDataList = [];
var attributesList = [];

var dnaList = [];


//Once you selected the layers, you export it in the output section
const saveImage = (_editionCount) => {
    fs.writeFileSync(`./output/./${_editionCount}.png`, canvas.toBuffer("image/png"));
}

//Able to add the adition to the final product  
const signImage = (_sig) =>{
    ctx.fillStyle = "#000000";
    ctx.font = "bold 30pt Courier";
    ctx.textBaseline = "top";
    ctx.textAlign = "left";
    ctx.fillText(_sig, 40 , 40);
}

//Creates a random color to be draw
const genColor = () =>{
    let hue = Math.floor(Math.random() *360);
    let pastel = `hsl(${hue},100%, 85%)`;
    return pastel;
}
//Allows the user to draw a random background
const drawBackground = () =>{
    ctx.fillStyle = genColor();
    ctx.fillrect(0,0,width,height);

}

//Add the metadata to the file
const addMetadata = (_dna, _edition) => {
    let dateTime = Date.now();
    let tempMetadata = {
        dna: _dna,
        edition: _edition,
        date: dateTime,
        attributes: attributesList,
    };
    metaDataList.push(tempMetadata);
    attributesList = [];
};

//Add attributes to each element
const addAttributes = (_element) => {
    let selectedElement = _element.layer.selectedElement;
    attributesList.push({
        name: selectedElement.name,
        rarity: selectedElement.rarity
    });
};

//Go through the layers and draw each of them
const loadLayerImg = async (_layer) => {
    return new Promise(async (resolve) => {
        const image = await loadImage(`${_layer.location}${_layer.selectedElement.fileName}`);
        resolve({
            layer: _layer,
            loadedImage: image
        });
    });
}

//Able to draw every layer available
const drawElement = (_element) => {
    ctx.drawImage(_element.loadedImage,
        _element.layer.position.x,
        _element.layer.position.y,
        _element.layer.size.width,
        _element.layer.size.height
    );
    addAttributes(_element);
};

//Create a dna to follow each image
const constructLayerToDna = (_dna, _layers) => {
    let DnaSegment = _dna.toString().match(/.{1,2}/g);
    let mappedDnaToLayers = _layers.map((layer) => {
        let selectedElement = layer.elements[parseInt(DnaSegment) % layer.elements.length];
        return {
            location: layer.location,
            position: layer.position,
            size: layer.size,
            selectedElement: selectedElement,
        };
    });
    return mappedDnaToLayers;
};

//Make sure each dna is unique to the other ones
const isDnaUnique = (_DnaList = [], _dna) => {
    let foundDna = dnaList.find((i) => i === _dna)
    return foundDna == undefined ? true : false;
}

//Create a random dna code that follows each image 
const createDna = (_len) => {
    let randNum = Math.floor(Number(`1e${_len}`) + Math.random() * Number(`9e${_len}`));
    return randNum;
};

//Write to the meta data file 
const writeMetaData = (_data) => {
    fs.writeFileSync("./output/_metadata.json", _data);

}

//Make all the different editions
const startCreating = async () => {
    writeMetaData("");
    let editionCount = 1;
    while (editionCount <= editionSize) {
        console.log(`RandomNum ${createDna(layers.length*2-1)}`);
        let newDna = createDna(layers.length * 2 - 1);
        if (isDnaUnique(dnaList, newDna)) {
            let results = constructLayerToDna(newDna, layers);
            let loadedElements = [];
            results.forEach(layer => {
                loadedElements.push(loadLayerImg(layer));
            });
            await Promise.all(loadedElements).then(elementArry => {
                drawBackground();
                elementArry.forEach(element => {
                    drawElement(element);
                })
                signImage(`#${editionCount}`);
                saveImage(editionCount);
                addMetadata(newDna, editionCount);
                console.log(`Created edition ${editionCount} with dna ${newDna}`);
            });
            // console.log("Creating edition " + i);
            dnaList.push(newDna);
            editionCount++;
        } else {
            console.log("DNA exists!");
        }
    }
    writeMetaData(JSON.stringify(metaDataList));
};
startCreating();