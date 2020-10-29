const express = require('express')
const app = express();

app.use('/', express.static(__dirname+'/face'));

app.get('/', (req,res) => {
    res.sendFile(__dirname+'/face/index.html');  
});
app.get('/testeWebcam', (req,res) => {
    res.sendFile(__dirname+'/face/webcam.html');  
});


app.listen(3000,'0.0.0.0', () => {
  console.log('Example app listening on port 3000!')
});