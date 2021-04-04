const express = require('express')
const app = express();

app.use('/', express.static(__dirname+'/face'));
app.use('/video', express.static(__dirname+'/face'));
app.use('/webcam', express.static(__dirname+'/face'));

app.get('/', (req,res) =>  res.sendFile(__dirname+'/face/imagem.html'));
app.get('/video', (req,res) => res.sendFile(__dirname+'/face/video.html'));
app.get('/webcam', (req,res) => res.sendFile(__dirname+'/face/webcam.html'))
app.listen(3000,'0.0.0.0', () => console.log('App listening on port 3000!'));