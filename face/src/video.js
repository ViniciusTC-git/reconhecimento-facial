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

async function predict() {
    let interval = null;
    const video = document.querySelector("video");

    if (!video) return;
    
    video.addEventListener("play", async () => {
      const displaySize = { width: video.width, height: video.height }
      const canvas = faceapi.createCanvasFromMedia(video);

      containerElement.append(canvas)
      faceapi.matchDimensions(canvas, displaySize)

      interval = setInterval(async () => {
        const detections = await faceapi.detectAllFaces(video);
        const extractedFaces = detections
            .filter(({ score }) => score > 0.60)
            .map(detection => extractFace(detection.box, video, factory))
    
        const maskPredictions = await Promise.all(extractedFaces.map(face => model['mask'].predict(face)))
        
        maskPredictions.forEach((predict, i) => {
            const { nome,  probabilidade } = getHighestPredict(predict);
            const label = `${ nome }: ${ probabilidade.toFixed(2) }`;    
            const resizedDetections = faceapi.resizeResults(detections[i], displaySize)
            const box = resizedDetections.box;
            const drawBox = new faceapi.draw.DrawBox(box, { label: label, lineWidth: 2 });
        
            canvas.getContext('2d').clearRect(0,0,canvas.width,canvas.height);
            drawBox.draw(canvas);

            if ((nome === "Sem Mascara" && probabilidade >= 0.99)) {
                firebaseService.sendImg({ 
                    data: new Date().toISOString(), 
                    img: getDataImg(video) 
                })
            }
        })    
      
      },100)  

    });
    video.addEventListener('canplay', () => video.play())
    video.addEventListener('ended', () => clearInterval(interval))
    video.defaultPlaybackRate = 0.5;
    video.load();
}


init().then(() => {
    fileElement.addEventListener('change', (e) => {
        uploadFile(e).then(ok => !ok || predict())
    })
});
