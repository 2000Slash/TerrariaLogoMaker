const { createCanvas, Image } = require('canvas');
const path = require("path");

var canvas = createCanvas(0, 95);
var ctx = canvas.getContext("2d");

var imageDir = path.join(__dirname, "./assets/chars");
var theme;
var treeImg;
var startImg;
var endImg;


loadTheme('overworld-extended');

function loadTheme (newTheme){
    theme = newTheme;
    treeImg = new Image();
    treeImg.src = `${imageDir}/${theme}/tree.png`;

    startImg = new Image();
    startImg.src = `${imageDir}/${theme}/start.png`;

    endImg = new Image();
    endImg.src = `${imageDir}/${theme}/end.png`;
}

function displayImage (images, drawTree) {
    if (drawTree){
        images = [treeImg, startImg].concat(images, [endImg]);
    }
    else {
        images = [startImg].concat(images, [endImg])
    }    

    ctx.clearRect(0, 0, canvas.width, canvas.height); 

    var imageWidth = 0; 
    for (let i = 0; i < images.length; i++) {
        imageWidth += images[i].width;
    }
    canvas.width = imageWidth;

    var x = 0;
    var y = 0;
    for (let i = 0; i < images.length; i++) {
        ctx.drawImage(images[i], x, y);
        x += images[i].width;
    }    
}

function stringToImage (text, drawTree, charImages=[]) {
    if (text.length == 0) {
        displayImage(charImages, drawTree);
        return;
    }
    var asciiVal = text[0].charCodeAt(0);    
    var imagePath = `${imageDir}/${theme}/${asciiVal}.png`;
    var img = new Image();
    img.onerror = function () {
        img.onload = null;
        stringToImage(text.slice(1, text.length), drawTree, charImages);
    }
    img.onload = function () {
        charImages.push(img);
        stringToImage(text.slice(1, text.length), drawTree, charImages);
    }   
    img.src = imagePath;
}

module.exports = function createLogo(text, drawTree) {
    stringToImage(text, drawTree);
    var dataURL = canvas.toDataURL('image/png');
    var data = dataURL.replace(/^data:image\/\w+;base64,/, "");
    return Buffer.from(data, 'base64');
}