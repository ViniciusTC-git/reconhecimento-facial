# Reconhecimento de pessoas com mascara/sem mascara

# Implementação

- TensorFlow.js e face-api.js<br>
  <img width="450" height="350" src="https://github.com/ViniciusTC-git/reconhecimento-facial/blob/main/img-app/1.jpg">
 <br>

- CNN (Convolutional Neural Network) e R-CNN (Region Based Convolutional Network)
<div>
  <img width="450" height="350" src="https://github.com/ViniciusTC-git/reconhecimento-facial/blob/main/img-app/2.jpeg">
  <img width="450" height="350" src="https://github.com/ViniciusTC-git/reconhecimento-facial/blob/main/img-app/3.png">
</div>

- Teste com 4 pessoas Sem Mascara
<img width="350" height="350" src="https://github.com/ViniciusTC-git/reconhecimento-facial/blob/main/img-app/4.jpg">

- Há uma função que realiza a extração do rosto dentro da imagem, 
  para que o modelo CNN tenha uma maior precisão na classificação 
  sobre a área alvo
<img width="350" height="150" src="https://github.com/ViniciusTC-git/reconhecimento-facial/blob/main/img-app/5.jpg">

- A classificação retorna um resultado com/sem mascara e a taxa de probabilidade, para então ter o seguinte resultado no HTML:
<img width="350" height="350" src="https://github.com/ViniciusTC-git/reconhecimento-facial/blob/main/img-app/6.jpg">

- Outro exemplo
<div>
  <img width="350" height="350" src="https://github.com/ViniciusTC-git/reconhecimento-facial/blob/main/img-app/7.jpg">
  <img width="350" height="350" src="https://github.com/ViniciusTC-git/reconhecimento-facial/blob/main/img-app/8.jpg">
</div>

- Nos testes em video foram utilizados dois computadores 
  - DELL OptiPlex 3070 Small Desktop
    <ul>
      <li>Processador Intel Core i5-9500 9ª geração (6 núcleos, cache de 9 MB, 3,0 GHz a 4,4 GHz)</li>
      <li>Placa de vídeo integrada Intel® Integrated Graphics</li>
      <li>Memória de 8 GB (1X8GB) DDR4</li>
   </ul>
   
   <br>
   
  - PC Comum
     <ul>
      <li>Processador AMD Athlon 3000G (2 núcleos, cache de 4 MB, 3.5GHz, 4 Threads)</li>
      <li>Placa de vídeo GTX 1660 Ti</li>
      <li>Memória de 8 GB (1X8GB) DDR4</li>
   </ul>

# Instalação
 <h5>Localize o local onde a pasta se encontra Exemplo: "C:/caminho/reconhecimento-facial"</h5>

- "npm i" para instalar as dependencias <br>
- após isso execute o comando no prompt "node index.js" <br>

- Rotas
  - reconhecimento facial localhost:3000
  - testar se a webcam funciona localhost:3000/testeWebcam
