import { api } from '../enviroments/enviroment.js'
import { 
    loadModel, 
    extractFace,
    getDataImg
} from './utils/face.util.js';

const video = document.querySelector("video");
let model = null;

async function init() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false })

        video.srcObject = stream
        
        model = await loadModel()

        predict();
    } catch(e) {
        console.error(e);
    }
}

async function predict() {
   let pending = null;
   const init = firebase.initializeApp(api);
   const firestore = init.firestore();

   video.addEventListener("play", async () => {
        const displaySize = { width: video.width, height: video.height }
        const canvas = faceapi.createCanvasFromMedia(video);
    
        containerElement.append(canvas)
        faceapi.matchDimensions(canvas, displaySize)
    
        setInterval(async () => {
            const detections = await faceapi.detectAllFaces(video);
            const extractedFaces = detections
                .filter(({ score }) => score > 0.60)
                .map(detection => extractFace(detection.box, video))
        
            const predictions = await Promise.all(extractedFaces.map(face => model.predict(face)))
        
            predictions.forEach((predict, i) => {
                const { className: nome, probability: probabilidade } = predict.reduce((acc, curr) => { 
                    if (!acc.probability || +curr.probability > +acc.probability) Object.assign(acc ,curr);
            
                    return acc;
                }, {});
        
                const label = `${ nome }: ${ probabilidade.toFixed(2) }`;    
                const resizedDetections = faceapi.resizeResults(detections[i], displaySize)
                const box = resizedDetections.box;
                const drawBox = new faceapi.draw.DrawBox(box, { label: label, lineWidth: 2 });
            
                canvas.getContext('2d').clearRect(0,0,canvas.width,canvas.height);
                drawBox.draw(canvas);

                if (!pending && (nome === "Sem Mascara" && probabilidade >= 0.99)) {
                    const payload = { data: new Date().toISOString(), img: getDataImg(video) }
                      
                    pending = new Promise(resolve => resolve(firestore.collection('portaria').add(payload)));
                    pending.then(() => pending = null).catch((e)=> console.error(e));
                }
            })    
        
        }, 100)  
    });    
}

init();