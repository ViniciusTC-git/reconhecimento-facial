import { 
    loadModel, 
    extractFace,
    uploadFile
} from './utils/face.util.js';

const fileElement = document.querySelector("#file")
const containerElement =  document.body.querySelector('.container')
let model = null;

async function init() {
    try {
        model = await loadModel()
    } catch(e) {
        console.error(e);
    }
}

async function predict(){
    const img = document.querySelector("img");
    
    if (!img) return;

    const displaySize = { width: img.width, height: img.height }

    const detections = await faceapi.detectAllFaces(img);

    const extractedFaces = detections.map(detection => extractFace(detection.box, img))

    const predictions = await Promise.all(extractedFaces.map(face => model.predict(face)))

    predictions.forEach((predict, i) => {
        const { className: nome, probability: probabilidade } = predict.reduce((acc, curr) => { 
            if (!acc.probability || +curr.probability > +acc.probability) Object.assign(acc ,curr);
    
            return acc;
        }, {});

        const canvas = faceapi.createCanvasFromMedia(img);
        const label = `${ nome }: ${ probabilidade.toFixed(2) }`;    
        const resizedDetections = faceapi.resizeResults(detections[i], displaySize)
        const box = resizedDetections.box;
        const drawBox = new faceapi.draw.DrawBox(box, { label: label, lineWidth: 2 });
    
        containerElement.append(canvas)
        faceapi.matchDimensions(canvas, displaySize)
        canvas.getContext('2d').clearRect(0,0,canvas.width,canvas.height);
        drawBox.draw(canvas);
    })
}

init().then(() => {
    fileElement.addEventListener('change', (e) => {
        uploadFile(e).then(ok => !ok || predict())
    })
});


