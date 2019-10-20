var DrawBox = (function () {
	var DrawBoxConfig = {};

	var Config = null;
	var AlbumFile = null;
	var ImageFaceHandling = null;

	var CurrentImageName = '';
   	var start_mousex = start_mousey = 0;
   	var canvasx = canvasy = 0;
   	var current_mousex = current_mousey = 0;
	var mousedown = false;
	let DrewBox = false;

   	var result = {
				'firstName' : ''
				,'lastName' : ''
				,'end_x' : 0
				,'end_y' : 0
				,'start_x' : 0
				,'start_y' : 0
   	};

	var init = function(Album_Data,config,filename,faceHandling)
	{
      	console.log('RENDERER: DrawBox.init: START');
		DrewBox = false;
      	console.log ('RENDERER: DrawBox.init: DrawBox.DrewBox (%s)',DrewBox);
		Config = config;
		AlbumFile = filename
		ImageFaceHandling = faceHandling;
		CurrentImageName = document.getElementById('pictureFileName').innerHTML.trim();
      	console.log ('RENDERER: DrawBox.init: CurrentImageName (%s)',CurrentImageName);
      	console.log('RENDERER: DrawBox.init: DrawBoxConfig.canvas is %s' , (Config.canvas == null) ? 'null' : 'not null');

    	canvasx = Config.canvas.getBoundingClientRect().left;
    	canvasy = Config.canvas.getBoundingClientRect().top;
    	console.log('RENDERER: DrawBox.init: DrawBox: canvasx,y (%d,%d)',canvasx,canvasy);
	}; // init

		function makeDelta(imageTag,faceData)
		{
			let deltas = { 'width' : 0,'height' : 0};
			let image = document.getElementById(imageTag);
			let imageWidth =  parseInt(image.getAttribute('width'));
			let imageHeight = parseInt(image.getAttribute('height'));
      		//console.log ('RENDERER: DrawBox.makeDelta: The image  (width) %f  (height) %f',imageWidth,imageHeight);
			deltas['width'] =  imageWidth / parseInt(faceData['originalWidth']);
			deltas['height'] = imageHeight / parseInt(faceData['originalHeight']);
        	//console.log('RENDERER: DrawBox.makeDelta : deltas: %s',JSON.stringify(deltas,null,'\t'));
			return deltas;
		} // makeDelta

		function mouseDown(e) {
         	console.log('RENDERER: DrawBox.mouseDown: START');
         	e.preventDefault();
    		start_mousex = parseInt(e.clientX - canvasx);
			start_mousey = parseInt(e.clientY - canvasy);
    		mousedown = true;
        	Config.ctx.strokeStyle = Config.strokeStyle;
        	Config.ctx.lineWidth = Config.lineWidth;
         	console.log('RENDERER: DrawBox.mouseDown: DONE: x,y (%d,%d)',start_mousex,start_mousey);
		} //mouseDown

		function mouseUp(e)
		{
        	console.log('RENDERER: DrawBox.mouseUp START:');
        	e.preventDefault();
      		//console.log ('RENDERER: DrawBox.mouseUp: The current mouse position is (x) %f  (y) %f',current_mousex,current_mousey);
			DrewBox = true;
    		mousedown = false;
         	console.log('RENDERER: DrawBox.mouseUp : DrewBox :%s:',DrewBox);
      		console.log ('RENDERER: DrawBox.mouseUp: CurrentImageName (%s)',CurrentImageName);
			let faceData = AlbumData.getImageData(CurrentImageName);
         	console.log('RENDERER: DrawBox.mouseUp : faceData: %s',JSON.stringify(faceData,null,'\t'));
			let delta = makeDelta('IFH_ImageTag',faceData);
			result['end_x']   = Math.floor(current_mousex / delta.width);
			result['end_y']   = Math.floor(current_mousey / delta.height);
			result['start_x'] = Math.floor(start_mousex / delta.width);
			result['start_y'] = Math.floor(start_mousey / delta.height);
         	console.log('RENDERER: DrawBox.mouseUp : %s' , JSON.stringify(result,null,'\t'));
		} // mouseUp

		function mouseMove(e)
		{
        	e.preventDefault();
    		current_mousex = parseInt(e.clientX - canvasx);
			current_mousey = parseInt(e.clientY - canvasy);
         	//console.log('RENDERER: DrawBox.mouseMove: x,y (%d,%d)',current_mousex,current_mousey);
    		if(mousedown) {
        		var width = current_mousex - start_mousex;
        		var height = current_mousey - start_mousey;
        		Config.ctx.clearRect(start_mousex,start_mousey,width,height);
        		Config.ctx.beginPath();
        		Config.ctx.rect(start_mousex,start_mousey,width,height);
        		Config.ctx.stroke();
    		}
		} // mouseMove

   var boxDrawn = () => { 
	   console.log('RENDERER: DrawBox.boxDrawn : DrewBox = %s' ,DrewBox ); 
	   return DrewBox;
	}
   var showConfig = () => { console.log('RENDERER: DrawBox.showConfig : %s' , JSON.stringify(Config,null,'\t')); }
   var getNewBoxInfo = () => { 
       console.log('RENDERER: DrawBox.getNewBoxInfo : %s' , JSON.stringify(result,null,'\t'));
       return result;
   }

   var startDrawing = function() {
    	console.log('RENDERER: DrawBox.startDrawing: START');
		Config.canvas.addEventListener('mousedown', mouseDown);
		Config.canvas.addEventListener('mouseup', mouseUp);
		Config.canvas.addEventListener('mousemove', mouseMove);
		DrewBox = false;
    	console.log('RENDERER: DrawBox.startDrawing: DONE DrewBox= %s',DrewBox);
   }; // startDrawing

   var stopDrawing = function() {
    	console.log('RENDERER: DrawBox.stopDrawing: START');
		Config.canvas.removeEventListener('mousedown', mouseDown);
		Config.canvas.removeEventListener('mouseup', mouseUp);
		Config.canvas.removeEventListener('mousemove', mouseMove);
		DrewBox = false;
		console.log('RENDERER: DrawBox.stopDrawing: DONE');
   }; // stopDrawing

   return {
	 init: init
	 ,startDrawing  : startDrawing
	 ,stopDrawing   : stopDrawing
	 ,getNewBoxInfo : getNewBoxInfo
	 ,showConfig    : showConfig
	 ,boxDrawn      : boxDrawn
  };
})();