const fs = require("fs");
const dir = __dirname;
const width = 1000;
const height = 1000;
console.log(__dirname);


//Different rarity which can be selected from here
const rarity = [
    {key: "", val: "original"},
    {key: "_r", val: "rare"},
    {key: "_sr", val: "super rare"},
    {key: "_s", val: "only one"},
];

//Custom rarity to each png file
const addRarity = _str => {
    let itemRarity;
  
    rarity.forEach((r) => {
      if (_str.includes(r.key)) {
        itemRarity = r.val;
      }
    });
    return itemRarity;
  };


//Remove .png and the rarity from it 
const cleanName = _str => {
    let name = _str.slice(0, -4);
    rarity.forEach((r) => {
      name = name.replace(r.key, "");
    });
    return name;
  };

//Each element has a id, name, original file name and rarity
const getElements = path => {
    return fs
      .readdirSync(path)
      .filter((item) => !/(^|\/)\.[^\/\.]/g.test(item))
      .map((i, index) => {
        return {
          id: index+1,
          name: cleanName(i),
          fileName: i,
          rarity: addRarity(i)
        };
      });
  };
//Each layer on the project
const layers = [
    {
    id: 1,
    name: "background",
    location: `${dir}/background/`,
    elements: getElements(`${dir}/background/`),
    position: {x:0 ,y:0},
    size:{ width:width, height:height}
 },
 {
    id: 2,
    name: "eyeball",
    location: `${dir}/Eyeball/`,
    elements: getElements(`${dir}/Eyeball/`),
    position: {x:0 ,y:0},
    size:{ width:width, height:height}
},
{
    id: 3,
    name: "eye color",
    location: `${dir}/Eye Color/`,
    elements: getElements(`${dir}/Eye Color/`),
    position: {x:0 ,y:0},
    size:{ width:width, height:height}
},
{
    id: 4,
    name: "iris",
    location: `${dir}/Iris/`,
    elements: getElements(`${dir}/Iris/`),
    position: {x:0 ,y:0},
    size:{ width:width, height:height }
},
{
    id: 5,
    name: "shine",
    location: `${dir}/Shine/`,
    elements: getElements(`${dir}/Shine/`),
    position: {x:0 ,y:0},
    size:{ width:width, height:height}
},
{
    id: 6,
    name: "bottom lid",
    location: `${dir}/Bottom lid/`,
    elements: getElements(`${dir}/Bottom lid/`),
    position: {x:0 ,y:0},
    size:{ width:width, height:height}
},
{
    id: 7,
    name: "top lid",
    location: `${dir}/Top lid/`,
    elements: getElements(`${dir}/Top lid/`),
    position: {x:0 ,y:0},
    size:{ width:width, height:height}
 },
 {
    id: 8,
    name: "goo",
    location: `${dir}/Goo/`,
    elements: getElements(`${dir}/Goo/`),
    position: {x:0 ,y:0},
    size:{ width:width, height:height}
},
];

//Bring layers, width and height to the index file
module.exports = {layers, width, height}