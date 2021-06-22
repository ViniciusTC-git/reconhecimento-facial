import { model } from '../../enviroments/enviroment.js';

export async function loadModel() {
    const { URL_FACE, URL_MASK, URL_PESSOA } = model;
    const models = [ 
        faceapi.nets.ssdMobilenetv1.loadFromUri(URL_FACE), 
        mobilenet.load(URL_MASK.URL, URL_MASK.METADATA_URL),
        mobilenet.load(URL_PESSOA.URL, URL_PESSOA.METADATA_URL)
    ]
    const [_, mask, person] = await Promise.all(models)

    return { mask, person }; 
}

export function extractFace(box, img, factory) {
    const [ x_factory, y_factory, width_factory, height_factory ] = factory;
    const canvasFace = document.createElement("canvas")
    const x =  !x_factory ? box.x : (box.x - x_factory);
    const y = !y_factory ? box.y : (box.y - y_factory);
    const width = !width_factory ? box.width : (box.width + width_factory);
    const height = !height_factory ? box.height : (box.height + height_factory);

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


export function uploadMultipleFiles(e) {
    return new Promise((resolve) => {
        if (!e.target.files.length) return;

        let i = 0;
        const filesLength = e.target.files.length;
        const imgs = [];
        const files = e.target.files;
        const reader = new FileReader();

        reader.addEventListener('load', async (e) => {

            imgs.push(createImgElement(e.target.result));

            if (imgs.length === filesLength) {
                resolve(imgs)
            } else {
                i += + 1;
                reader.readAsDataURL(files[i]);
            }
        });
        
        reader.readAsDataURL(files[i]);
    });
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

export function createImgExtract(src) {
    const img = document.createElement('img')

    img.width = 255;
    img.height = 255;
    img.src = src;

    return img;
}

export function isPerson({ nome, probabilidade }) {
    return nome !== "Random" && probabilidade >= 0.99;
}

export function getHighestPredict(predict) {
    const { className: nome, probability: probabilidade } = predict.reduce((acc, curr) => { 
        if (!acc.probability || +curr.probability > +acc.probability) Object.assign(acc ,curr);

        return acc;
    }, {});

    return { nome, probabilidade };
}
