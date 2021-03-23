import { createCanvas, loadImage,  Image } from 'canvas';
import * as path from "path";

var canvas = createCanvas(0, 95);
var ctx = canvas.getContext("2d");

let imageDir = path.join(__dirname, "../assets/chars");
let theme: String;
let treeImg: Image;
let startImg: Image;
let endImg: Image;


loadTheme('overworld-extended');

function loadTheme (newTheme: String){
    theme = newTheme;
    treeImg = new Image();
    treeImg.src = `${imageDir}/${theme}/tree.png`;

    startImg = new Image();
    startImg.src = `${imageDir}/${theme}/start.png`;

    endImg = new Image();
    endImg.src = `${imageDir}/${theme}/end.png`;
}

function displayImage (images:Image[], drawTree:Boolean) {
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

async function stringToImage (text: String, charImages:Image[]=[]): Promise<Image[]> {
    if (text.length == 0) {
        return charImages;
    }
    var asciiVal = text[0].charCodeAt(0);    
    var imagePath = `${imageDir}/${theme}/${asciiVal}.png`;
    const image = await loadImage(imagePath);
    charImages.push(image);
    return await stringToImage(text.slice(1, text.length), charImages);
}

export async function createLogo(text: String, drawTree: Boolean): Promise<Buffer> {
    const images = await stringToImage(text);
    displayImage(images, drawTree);
    var dataURL = canvas.toDataURL('image/png');
    var data = dataURL.replace(/^data:image\/\w+;base64,/, "");
    return Buffer.from(data, 'base64');
}