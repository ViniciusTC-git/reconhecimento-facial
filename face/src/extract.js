import { 
    loadModel, 
    extractFace,
    uploadMultipleFiles,
    createImgExtract
} from './utils/face.util.js';

const fileElement = document.querySelector("#file")
const containerElement =  document.body.querySelector('.container')
const btnClear = document.querySelector("#clear");
const btnDownload = document.querySelector("#download");

let model = null;

async function extract(imgs) {
    const detections = await Promise.all(imgs.map(img => faceapi.detectAllFaces(img)));
    const mappedDetections = imgs
        .reduce((acc, curr, i) => {
            detections[i] = detections[i].filter(({ score }) => +score >= 0.90);

            if (!detections[i].length) return acc;

            acc.push({ img: curr, detections: detections[i] })

            return acc;
        }, [])
    const extractedFaces = mappedDetections
     .map(({ img, detections }) => detections.map(detection => extractFace(detection.box, img, [])))
     .reduce((acc, curr) => acc.concat(curr) ,[])
    const imgsElements = extractedFaces.map(extractedFace => createImgExtract(extractedFace.toDataURL()))

    imgsElements.forEach(img => containerElement.appendChild(img))
}

function download() {
    const imgs = containerElement.querySelectorAll('img');

    if (!imgs.length) return;

    const zip = new JSZip();

    imgs.forEach((img, i) => zip.file("img" + i+".jpg", img.src.replace(/data:.*?;base64,/, ""), { base64: true }))

    zip
    .generateAsync({ type: "blob" })
    .then(data => {
        saveAs(data, 'data.zip');            
    })
}

async function init() {
    try {
        model = await loadModel()
    } catch(e) {
        console.error(e);
    }
}

init().then(() => {
    fileElement.addEventListener('change', (e) => {
        uploadMultipleFiles(e).then(imgs => extract(imgs));
    })
    btnClear.addEventListener('click', () => {
        containerElement.innerHTML = "";
        fileElement.value = null;

    });
    btnDownload.addEventListener('click', download);
    containerElement.addEventListener('click', (e) => {
        if (e.target.nodeName === 'IMG') {
            e.target.remove();
        }
    })
});

