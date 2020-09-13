var FaceDetectionCode = (function () {

			 // a bunch of the code is adapted from the face-api package browser example.
			 //https://github.com/justadudewhohacks/face-api.js
             const SSD_MOBILENETV1 = 'weights';
             let InputImgEl = '';
             let Canvas     = '';
   
               async function setFaceDetector()
               {
                     $('#loader').show();
   
                     if (!isFaceDetectionModelLoaded()) {
                       await faceapi.nets.ssdMobilenetv1.load('/')
                     }
   
                     $('#loader').hide()
               } //setFaceDetector
   
               function isFaceDetectionModelLoaded()
               {
                    // the !! forces the result of the faceapi call to be a Boolean
                     return (!! faceapi.nets.ssdMobilenetv1.params)
               } // isFaceDetectionModelLoaded
   
           function printBounding(obj)
           {
                 return(JSON.stringify(obj.getBoundingClientRect(),null,'\t'));
           }
   
           function printShape(when,what,obj)
           {
               console.log('printShape: %s:\n\t\t%s.top = :%s: \n\t\t%s.left=:%s: \n\t\t%s.width = :%s: \n\t\t%s.height = :%s: \n\t\t%s.zindex :%s:',
               when
               ,what,obj.style['top']
               ,what,obj.style['left']
               ,what,obj.style['width']
               ,what,obj.style['height']
               ,what,obj.style['z-index']);
   
               return({
                  'top'     : obj.style['top']
                  ,'left'   : obj.style['left']
                  ,'width'  : obj.style['width']
                  ,'height' : obj.style['height']
                 ,'zIndex' : obj.style['z-index']
               });
           } // printShape
   
       async function updateResults(canvas,inputImgEl,minConfidence=0.001)
        {
          console.log('updateResult: START: minConfidence = :%f:', minConfidence);
          if (!isFaceDetectionModelLoaded()) {
           return;
          }
   
         const options = new faceapi.SsdMobilenetv1Options(minConfidence);
   
         const facesList = await faceapi.detectAllFaces(inputImgEl, options)
          console.log('updateResult: facesList length = :%d:', facesList.length);
         facesList.forEach((face) =>  {
                  //console.log('updateResult: results BEFORE: face.score = :%s:', face.score);
                  //console.log('updateResult: face BEFORE: face = :%s:', JSON.stringify(face,null,'\t'));
               face['_score'] = ""; // clear the score value so it isn't drawn near the face
                  //console.log('updateResult: results AFTER: face.score = :%s:', face.score);
                  console.log('updateResult: face AFTER: face = :%s:', JSON.stringify(face,null,'\t'));
         });
   
         faceapi.matchDimensions(canvas, inputImgEl,false);
   
         var results = faceapi.resizeResults(facesList, inputImgEl);
         faceapi.draw.drawDetections(canvas, results);
       } //updateResults
   
       async function run(min)
        {
         // load face detection
         await setFaceDetector();
   
         // start processing image
         updateResults(Canvas,InputImgEl,min);
          console.log('index: run: after updateResults');
       } //run
   
       document.addEventListener("DOMContentLoaded", function()
       {
           console.log('index: ready: START');
         InputImgEl = document.getElementById('inputImg');
         Canvas     = document.getElementById('overlay');
   
          document.getElementById('confidence').addEventListener("change", function()
           {
               console.log('confidence Changed');
               let min = parseFloat(this.value);
               console.log('confidence change: min=',min);
             updateResults(Canvas,InputImgEl,min);
           });
   
          document.getElementById('picture').addEventListener("change", function()
           {
               console.log('Picture Changed');
               let min = parseFloat( document.getElementById('confidence').value);
             InputImgEl.src = this.value;
             updateResults(Canvas,InputImgEl,min);
           });
   
           let min = parseFloat( document.getElementById('confidence').value);
           console.log('ONLOAD: confidence change: min=',min);
         run(min);
       });

   return {
	 init: init
	 ,openFaceInfo    : openFaceInfo
	 ,faceSelected    : faceSelected
	 ,closeNoChange   : closeNoChange
	 ,closeSave       : closeSave
	 ,displayFaceData : displayFaceData
	 ,clearWhoList    : clearWhoList
  };
})();