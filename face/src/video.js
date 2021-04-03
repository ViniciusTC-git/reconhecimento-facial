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
