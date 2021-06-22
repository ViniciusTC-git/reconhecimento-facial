import { FirebaseService } from './services/firebase.service.js';
import { 
    loadModel, 
    extractFace,
    uploadFile,
    getHighestPredict,
    getDataImg
} from './utils/face.util.js';

const fileElement = document.querySelector("#file")
const containerElement =  document.body.querySelector('.container')
const factory = [10,15,100,100];
const firebaseService = new FirebaseService();

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

    const extractedFaces = detections.map(detection => extractFace(detection.box, img, factory))

    const predictions = await Promise.all(extractedFaces.map(face => model['mask'].predict(face)))

    predictions.forEach((predict, i) => {
        const { nome,  probabilidade } = getHighestPredict(predict);

        const canvas = faceapi.createCanvasFromMedia(img);
        const label = `${ nome }: ${ probabilidade.toFixed(2) }`;    
        const resizedDetections = faceapi.resizeResults(detections[i], displaySize)
        const box = resizedDetections.box;
        const drawBox = new faceapi.draw.DrawBox(box, { label: label, lineWidth: 2 });
    
        containerElement.append(canvas)
        faceapi.matchDimensions(canvas, displaySize)
        canvas.getContext('2d').clearRect(0,0,canvas.width,canvas.height);
        drawBox.draw(canvas);

        if ((nome === "Sem Mascara" && probabilidade >= 0.99)) {
            firebaseService.sendImg({ 
                data: new Date().toISOString(), 
                img: getDataImg(img) 
            })
        }
    })
}

init().then(() => {
    fileElement.addEventListener('change', (e) => {
        uploadFile(e).then(ok => !ok || predict())
    })
});




