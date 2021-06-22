import { FirebaseService } from './services/firebase.service.js';
import { 
    loadModel, 
    extractFace,
    getDataImg
} from './utils/face.util.js';

const video = document.querySelector("video");
const factory = [10,15,100,100];
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
   const firebaseService = new FirebaseService();

   video.addEventListener("play", async () => {
        const displaySize = { width: video.width, height: video.height }
        const canvas = faceapi.createCanvasFromMedia(video);
    
        containerElement.append(canvas)
        faceapi.matchDimensions(canvas, displaySize)
    
        setInterval(async () => {
            const detections = await faceapi.detectAllFaces(video);
            const extractedFaces = detections
                .filter(({ score }) => score > 0.60)
                .map(detection => extractFace(detection.box, video, factory))
        
            const predictions = await Promise.all(extractedFaces.map(face => model.predict(face)))
        
            predictions.forEach((predict, i) => {
                const { nome, probabilidade } = getHighestPredict(predict);
                const label = `${ nome }: ${ probabilidade.toFixed(2) }`;    
                const resizedDetections = faceapi.resizeResults(detections[i], displaySize)
                const box = resizedDetections.box;
                const drawBox = new faceapi.draw.DrawBox(box, { label: label, lineWidth: 2 });
            
                canvas.getContext('2d').clearRect(0,0,canvas.width,canvas.height);
                drawBox.draw(canvas);

                if (nome === "Sem Mascara" && probabilidade >= 0.99) {
                    firebaseService.sendImg({ 
                        data: new Date().toISOString(), 
                        img: getDataImg(video) 
                    })
                }
            })    
        
        }, 100)  
    });    
}

init();