import { createCanvas, loadImage,  Image } from 'canvas';
import * as path from "path";

const canvas = createCanvas(0, 95);
const ctx = canvas.getContext("2d");

const imageDir = path.join(__dirname, "../assets/chars");
let theme: string;
let treeImg: Image;
let startImg: Image;
let endImg: Image;


loadTheme('overworld');

function loadTheme (newTheme: string){
    theme = newTheme;
    treeImg = new Image();
    treeImg.src = `${imageDir}/${theme}/tree.png`;

    startImg = new Image();
    startImg.src = `${imageDir}/${theme}/start.png`;

    endImg = new Image();
    endImg.src = `${imageDir}/${theme}/end.png`;
}

function displayImage (images:Image[], drawTree:boolean) {
    if (drawTree){
        images = [treeImg, startImg].concat(images, [endImg]);
    }
    else {
        images = [startImg].concat(images, [endImg])
    }    

    ctx.clearRect(0, 0, canvas.width, canvas.height); 

    let imageWidth = 0; 
    for (let i = 0; i < images.length; i++) {
        imageWidth += images[i].width;
    }
    canvas.width = imageWidth;

    let x = 0;
    for (let i = 0; i < images.length; i++) {
        ctx.drawImage(images[i], x, 0);
        x += images[i].width;
    }    
}

async function stringToImage (text: string, charImages:Image[]=[]): Promise<Image[]> {
    if (text.length == 0) {
        return charImages;
    }
    const asciiVal = text[0].charCodeAt(0);    
    const imagePath = `${imageDir}/${theme}/${asciiVal}.png`;
    const image = await loadImage(imagePath);
    charImages.push(image);
    return await stringToImage(text.slice(1, text.length), charImages);
}

export async function createLogo(text: string, drawTree: boolean): Promise<Buffer> {
    const images = await stringToImage(text);
    displayImage(images, drawTree);
    const dataURL = canvas.toDataURL('image/png');
    const data = dataURL.replace(/^data:image\/\w+;base64,/, "");
    return Buffer.from(data, 'base64');
}