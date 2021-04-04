import { model } from '../../enviroments/enviroment.js';

export async function loadModel() {
    const { ROOT, URL, METADATA_URL } = model;
    const models = [ faceapi.nets.ssdMobilenetv1.loadFromUri(ROOT), mobilenet.load(URL, METADATA_URL) ]
    const [_, maskModel] = await Promise.all(models)

    return maskModel 
}

export function extractFace(box, img) {
    const canvasFace = document.createElement("canvas")
    const x =  box.x - 10;
    const y = box.y - 15;
    const width = box.width + 100;
    const height = box.height + 100;

    canvasFace.width = width;
    canvasFace.height = height;
    canvasFace.getContext('2d').drawImage(img,x,y,width,height,0,0,width,height);

    return canvasFace;
}

export function getDataImg(img) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0,img.width,img.height);

    return canvas.toDataURL('image/jpeg');
}

export function uploadFile(e) {
    return new Promise((resolve) => {
        if (!e.target.files[0]) return;

        const containerElement = document.querySelector('.container');

        containerElement.innerHTML = '';

        const file =  e.target.files[0];
        const elementType = (file.type.includes('mp4') ? createVideoElement : createImgElement);
        const reader = new FileReader();
    
        reader.addEventListener('load', async (e) => {
            containerElement.appendChild(elementType(e.target.result));
            resolve(true)
        });
    
        reader.readAsDataURL(file);
    })
}

function createVideoElement(src) {
    const videoElement = document.createElement('video')
    const source = document.createElement('source')
    
    videoElement.width = 500;
    videoElement.height = 500;
    videoElement.muted = true;
    source.width = 600;
    source.height = 600;
    source.src = src;
    videoElement.appendChild(source)

    return videoElement;
}


function createImgElement(src) {
    const img = document.createElement('img')

    img.width = 450;
    img.height = 450;
    img.src = src;

    return img;
}
