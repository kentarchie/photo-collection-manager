var FaceDetectionCode = (function () 
{
	// a bunch of the code is adapted from the face-api package browser example.
	//https://github.com/justadudewhohacks/face-api.js
    // check if needed const SSD_MOBILENETV1 = 'weights';
    // check if needed let InputImgEl = '';
    // check if needed let Canvas     = '';
   
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
    } // printBounding
   
    function printShape(when,what,obj)
    {
        console.log('FaceDetectionCode.printShape: %s:\n\t\t%s.top = :%s: \n\t\t%s.left=:%s: \n\t\t%s.width = :%s: \n\t\t%s.height = :%s: \n\t\t%s.zindex :%s:',
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
        console.log('FaceDetectionCode.updateResult: START: minConfidence = :%f:', minConfidence);
        if (!isFaceDetectionModelLoaded()) {
            return;
        }
   
        const options = new faceapi.SsdMobilenetv1Options(minConfidence);
   
        const facesList = await faceapi.detectAllFaces(inputImgEl, options)
          console.log('FaceDetectionCode.updateResult: facesList length = :%d:', facesList.length);
        facesList.forEach((face) =>  {
            //console.log('FaceDetectionCode.updateResult: results BEFORE: face.score = :%s:', face.score);
            //console.log('FaceDetectionCode.updateResult: face BEFORE: face = :%s:', JSON.stringify(face,null,'\t'));
            face['_score'] = ""; // clear the score value so it isn't drawn near the face
            //console.log('FaceDetectionCode.updateResult: results AFTER: face.score = :%s:', face.score);
            console.log('FaceDetectionCode.updateResult: face AFTER: face = :%s:', JSON.stringify(face,null,'\t'));
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
       console.log('FaceDetectionCode.index: run: after updateResults');
    } //run
   
    //document.addEventListener("DOMContentLoaded", function()
    function init()
    {
        console.log('FaceDetectionCode.init: ready: START');
        InputImgEl = document.getElementById('inputImg');
        Canvas     = document.getElementById('overlay');
   
        /*
        document.getElementById('confidence').addEventListener("change", function()
        {
            console.log('FaceDetectionCode.confidence Changed');
            let min = parseFloat(this.value);
            console.log('FaceDetectionCode.init.confidence change: min=',min);
            updateResults(Canvas,InputImgEl,min);
        });
        */
   
        document.getElementById('IFH_ImageTag').addEventListener("change", function()
        {
            console.log('FaceDetectionCode.init.Picture Changed');
            let min = parseFloat( document.getElementById('confidence').value);
            InputImgEl.src = this.value;
            updateResults(Canvas,InputImgEl,min);
        });
   
        //let min = parseFloat( document.getElementById('confidence').value);
        //console.log('FaceDetectionCode.init: confidence change: min=',min);
        run(0);
    } // init

   return {
	 init: init
    ,updateResults : updateResults
  };
})();