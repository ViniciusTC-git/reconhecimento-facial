import {api} from '../enviroments/enviroment.js'

const video = document.getElementById('video');
const URL = "./models/";
const modelURL = URL + "model.json";
const metadataURL = URL + "metadata.json";

function loadModel(){
  Promise.all([
    faceapi.nets.ssdMobilenetv1.loadFromUri('./models'),//ROSTO
    mobilenet.load(modelURL, metadataURL)//MASCARA
  ]).then((values)=> { 
    detectVideo(values[1]); 
  });
}

function extractFace(box,video){
  const canvasFace = document.createElement("canvas")
  const x =  box.x - 10;
  const y = box.y - 15;
  const width = box.width + 100;
  const height = box.height + 100;
  canvasFace.width = width;
  canvasFace.height = height;
  canvasFace.getContext('2d').drawImage(video,x,y,width,height,0,0,width,height);
  return canvasFace;
}
function getDataImg(img) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = img.width;
  canvas.height = img.height;
  ctx.drawImage(img, 0, 0,img.width,img.height);
  return canvas.toDataURL('image/jpeg');
}

async function detectVideo(model){
  //video.playbackRate = 0.3;
   const init = firebase.initializeApp(api);
   const firestore = init.firestore();
   let pending = null;
  if (navigator.mediaDevices.getUserMedia) {
	navigator.mediaDevices
		.getUserMedia({ video: true,audio:false })
		.then(function (stream) {
		video.srcObject = stream;
	}).catch(function (e) {
		console.log(e);
	});
  }
  video.addEventListener("play", async ()=> {
    const displaySize = { width: video.width, height: video.height }
    const canvas = faceapi.createCanvasFromMedia(video);
    document.querySelector('.container').append(canvas)
    faceapi.matchDimensions(canvas, displaySize)
    setInterval(async () =>{
      await faceapi.detectAllFaces(video)
        .then(async (detections)=> {
          detections.forEach(async (detection)=> {
            const extractedFace = extractFace(detection.box,video);
            const predictions = await model.predict(extractedFace);
            const result = predictions.reduce((comMascara,semMascara) => { 
              return comMascara.probability > semMascara.probability ? comMascara : semMascara;
            });
            const label =  result.className+" "+result.probability.toFixed(2);
            const resizedDetections = faceapi.resizeResults(detection, displaySize)
            const box = resizedDetections.box;
            const drawBox = new faceapi.draw.DrawBox(box,{label:label,lineWidth:2});
            canvas.getContext('2d').clearRect(0,0,canvas.width,canvas.height);
            drawBox.draw(canvas);
		        if(!pending && (result.className === "Sem Mascara" && result.probability >= 0.99)){
              pending = new Promise(resolve => {
                resolve(firestore.collection('portaria').add({
                  data:new Date().toISOString(),
                  img:getDataImg(video)
                }));
              });
              pending.then(()=>{ 
                pending = null;
              }).catch((e)=> console.log(e));
            }
          });
      });
    },100)  
  });
}
loadModel();


//TESTE DETECÇÃO IMAGEM
async function detectImg(model){
  const img = document.querySelector('img');
  const displaySize = { width: img.width, height: img.height }
  await faceapi.detectAllFaces(img)
    .then(async (detections)=> {
      detections.forEach(async (detection)=> {
        const extractedFace = extractFace(detection.box,img);
        const predictions = await model.predict(extractedFace);
        const result = predictions.reduce((comMascara,semMascara) => { 
          return comMascara.probability > semMascara.probability ? comMascara : semMascara;
        });
        const canvas = faceapi.createCanvasFromMedia(img);
        const label =  result.className+" "+result.probability.toFixed(2);
        const resizedDetections = faceapi.resizeResults(detection, displaySize)
        const box = resizedDetections.box;
        const drawBox = new faceapi.draw.DrawBox(box,{label:label,lineWidth:2});
        document.querySelector('.container').append(canvas)
        faceapi.matchDimensions(canvas, displaySize)
        canvas.getContext('2d').clearRect(0,0,canvas.width,canvas.height);
        drawBox.draw(canvas);
      });
  });
}


