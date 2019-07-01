var ImageFaceHandling = (function () {
		const IFH_DeleteFaceID = 'IFH_DeleteFace';
		const IFH_CreateFaceID = 'IFH_CreateFace'
		const IFH_UndoCreateID = 'IFH_UndoCreate';
		const IFH_UndoDeleteID = 'IFH_UndoDelete';
		const IFH_BUTTONS_BLOCK = 'IHF_Buttons_Block';
		const IFH_ButtonBaseClass = 'IFH_ButtonBaseClass';
		const IFH_UndoButtonClass = 'IFH_UndoButtonClass';
		const IFH_CreateButtonClass = 'IFH_CreateButtonClass';
		const IFH_DeleteButtonClass = 'IFH_DeleteButtonClass';
    	const IFH_ImageElementID  = 'IFH_ImageTag';
    	const IFH_ImageElementClass = 'IFH_ImageTagClass';
    	const IFH_ImageGroupClass = 'IFH_ImageGroupClass';
    	const IFH_CanvasElementID = 'IFH_CanvasTag';
		const IFH_CanvasClass = 'IFH_CoveringCanvas';

		let Config = {};
		let CurrentFace = {};

		var init = function( settings )
		{
			logger('ImageFaceHandling.init: START');
      		Config = {
         	wrapperID: 'IFH_pictureDisplay'
        		,wrapperClass: 'IFH_WrapperClass'
        		,albumName: 'testAlbum'
				,lineWidth : 2
				,strokeStyle : '#FF0000'
				,displayBoxWidth : 450
				,displayBoxHeight : 450
				,wrapperTag : null
				,image : null
				,canvas : null
				,ctx : null
        };
 
      	// Allow overriding the default config
			$.extend( Config, settings );

			this.showConfig();
		 } // init

	 var setup = function()
	 {
		Config.wrapperTag = document.getElementById('pictureDisplay');
		document.getElementById('FaceInfoBlackout').addEventListener('click', (e) => { FaceInfoHide();})
		document.getElementById('FaceInfoClose').addEventListener('click', (e) => { FaceInfoHide();})

		setTimeout(function(){

			Config.canvas  = document.getElementById(IFH_CanvasElementID);
			Config.ctx     = Config.canvas.getContext('2d');
			Config.image  = document.getElementById(IFH_ImageElementID);
      	logger ('ImageFaceHandling.setup: The Config.canvas.top is %s left %s',Config.canvas.style.top,Config.canvas.style.left);
      	logger ('ImageFaceHandling.setup: The Config.image.id is %s',Config.image.getAttribute('id'));

			// the canvas and image must be in the same place and the same size
			Config.wrapperTag.width = Config.displayBoxWidth;
			Config.wrapperTag.height = Config.displayBoxHeight;

			Config.canvas.width  = Config.displayBoxWidth;
			Config.canvas.height = Config.displayBoxHeight;
			//Config.canvas.style.top = Config.canvas.style.top;
			//Config.canvas.style.left =  Config.canvas.style.left;

			Config.ctx.lineWidth   = Config.lineWidth;
			Config.ctx.strokeStyle = Config.strokeStyle;

			Config.canvas.addEventListener('click',(e) => { onImageClick(e);});
			document.getElementById('DeleteFaceBox').addEventListener('click',(e) => { deleteFaceBox(e);});
		},100);
	 } // setup
	 
	 // called as part of the main page picture select onChange
	var showPicture = function(fname)
	{
		logger('ImageFaceHandling.showPicture: Config.albumName :%s: fname :%s: ',Config.albumName,fname);
		Config.image.setAttribute('src', Config.albumName + '/' + fname);

		logger('ImageFaceHandling.showPicture: image.src :%s:',Config.image.src);
		Config.image.setAttribute('data-File',fname);
	} // showPicture

	// the position and size of the box around a face is
	// based on the original image size and has to be 
	// adjusted to the size of the display

	function adjustFaceBox(boxSpec,deltaWidth,deltaHeight)
	{
      logger ('ImageFaceHandling.adjustFaceBox: The delta size is (width) %.3f (height) %.3f',deltaWidth,deltaHeight);
		let result = {
				 'startX' : Math.floor(deltaWidth  * boxSpec.startX)
				,'startY' : Math.floor(deltaHeight * boxSpec.startY)
				,'width'  : Math.floor(deltaWidth  * (boxSpec.width))
				,'height' : Math.floor(deltaHeight * (boxSpec.height))
		};
		return result;
	} // adjustFaceBox

	var showConfig = () => { logger('ImageFaceHandling.showConfig :' + JSON.stringify(Config,null,'\t')); }

	// go through the album data for the displayed image
	// and draw the boxes arond all the faces
	var drawFaces = function(fname)
	{
		logger('ImageFaceHandling.drawFaces fname %s',fname);
		let faceData = Album_Data['images'][fname]['faces']['faceList'];

			logger('ImageFaceHandling.drawFaces faceData %s:',JSON.stringify(faceData,null,'\t'));
			//logger ('ImageFaceHandling.drawFaces: The image id is :%s:',Config.inage.getAttribute('id'));
			//logger('ImageFaceHandling.drawFaces: scrollX,scrollY %s,%s',window.scrollX, window.scrollY);
			//logger('ImageFaceHandling.drawFaces: canvas width,height %s,%s',Config.canvas.width, Config.canvas.height);
			console.log ('ImageFaceHandling.drawFaces: albumName is :%s:',Config.albumName);

		let im = new Image();
		im.src = '../' + Config.albumName + '/' + fname;
			console.log ('ImageFaceHandling.drawFaces: im.src is :%s:',im.src);
      	//logger ('ImageFaceHandling.drawFaces: The box sizes are %f * %f',Config.displayBoxHeight,Config.displayBoxWidth);
			//logger ('ImageFaceHandling.drawFaces: The im natural sizes are %f(height) * %f(width)',im.naturalHeight,im.naturalWidth);
			//logger ('ImageFaceHandling.drawFaces: The canvas left offset %f  top offset %f',Config.canvas.offset().left,Config.canvas.offset().top);

		let deltaWidth = Config.displayBoxWidth / im.naturalWidth;
		let deltaHeight = Config.displayBoxHeight / im.naturalHeight;
      	console.log ('ImageFaceHandling.drawFaces: The delta size is (width) %f  (height) %f',deltaWidth,deltaHeight);

		//let colors = ['#FF0000','#00FF00'];  // used during debugging
		faceData.forEach((fd, i) => {
				logger('ImageFaceHandling.drawFaces: fd ' + JSON.stringify(fd,null,'\t'));
			let newFaceBox = adjustFaceBox(fd,deltaWidth,deltaHeight);
				logger('ImageFaceHandling.drawFaces newFaceBox = ' + JSON.stringify(newFaceBox,null,'\t'));
			// draw rectangle
			Config.ctx.lineWidth = Config.lineWidth;
			Config.ctx.strokeStyle = Config.strokeStyle;

			Config.ctx.beginPath();
			Config.ctx.strokeRect(newFaceBox.startX, newFaceBox.startY, newFaceBox.width, newFaceBox.height);
			Config.ctx.closePath();
		});
			logger('ImageFaceHandling.drawFaces: boxes drawn');
	} // drawFaces

	function getFileName()
	{
		let fnamePath = document.getElementById('IFH_ImageTag').getAttribute('filename');
		console.log('ImageFaceHandling.getFileName: fnamePath :' + fnamePath + ':');
    	let pathParts = pathLib.parse(fnamePath);
    	let fname = pathParts.base;
		console.log('ImageFaceHandling.getFileName: fname :' + fname + ':');
		return fname;
	} // getFileName

	function deleteFaceBox(ev)
	{
		logger('ImageFaceHandling.deleteFaceBox: START');
		let target = CurrentFace.currentTarget;
    	let fname = getFileName();
		logger('ImageFaceHandling.deleteFaceBox: fname=:'+fname+':');
		let faceData = Album_Data['images'][fname]['faces']['faceList']
		let face = isFaceClicked(CurrentFace);
		if(face != -1) {
			logger('ImageFaceHandling.deleteFaceBox: face=:'+face+':');
			let fd = faceData[face];
			if (window.confirm('Do you want to delete this face information (' + fd.firstName + ' ' + fd.lastName + ')?')) { 
				logger('ImageFaceHandling.deleteFaceBox: Yes delete face box');
				Album_Data['images'][fname]['faces']['faceList'].splice(face,1);  // delete face object from list
				logger('ImageFaceHandling.deleteFaceBox: faceData after splice :' + JSON.stringify(Album_Data['images'][fname]['faces']['faceList'],null,'\t'));
				logger('ImageFaceHandling.deleteFaceBox: face info :' + JSON.stringify(faceData[--face],null,'\t'));
				Config.ctx.clearRect(0, 0, Config.canvas.width, Config.canvas.height);
				drawFaces(fname);
			}
			else {
				logger('ImageFaceHandling.deleteFaceBox: NO  do not delete face box');
			}
		}
		else {
				logger('ImageFaceHandling.deleteFaceBox: Not a face');
		}
	} // deleteFaceBox

	// if a face box is single clicked, display the name information for editting
	var onImageClick = function(ev)
	{
		logger('ImageFaceHandling.onImageClick : START');
		CurrentFace.currentTarget = ev.currentTarget; // save for later use
    	CurrentFace.clientX = ev.clientX;
    	CurrentFace.clientY = ev.clientY;

		let target = ev.currentTarget;
    	let fname = getFileName();
		console.log('onImageClick.faceEdit: fname :' + fname + ':');

		let face = isFaceClicked(ev);
		if(face != -1) {  // we have clicked on a face box
			let faceData = Album_Data['images'][fname]['faces']['faceList'];
			console.log('ImageFaceHandling. onImageClick: first name = :%s: last name = :%s:',faceData[face].firstName,faceData[face].lastName);
			openFaceInfo(faceData[face]);
		}
		else 
			logger('ImageFaceHandling.onImageClick: clicked NOT ON face %d', face);
	} // onImageClick

	// see if we clicked on one of the displayed face boxes
	// rect is the boundingBox of the canvas
	var isFaceClicked	= function (ev)
	{
			console.log('imageFaceHandling.isFaceClicked: START');
			let fname = getFileName();
			let target = ev.currentTarget;
			console.log('ImageFaceHandling.onImageClick: fname :%s: target.id :%s: target.tag :%s:',fname,target.id,target.tagName);
			let deltaWidth = Config.displayBoxWidth / Config.image.naturalWidth;
			let deltaHeight = Config.displayBoxHeight / Config.image.naturalHeight;
      	logger('ImageFaceHandling.isFaceClicked: The delta size is (width) %f  (height) %f',deltaWidth,deltaHeight);

			var rect = target.getBoundingClientRect();
			logger('ImageFaceHandling.onImageClick: boundingbox top %d,right %d,bottom %d,left %d',rect.top, rect.right, rect.bottom, rect.left);


			logger('ImageFaceHandling.onImageClick: e.clientX %d e.clientY %d',ev.clientX, ev.clientY);
  			const pos = {
    			x: Math.floor(ev.clientX  - rect.left)
    			,y: Math.floor(ev.clientY -  rect.top)
  			};
			logger('imageFaceHandling.isFaceClicked: x=%d y=%d',pos.x,pos.y);

			//logger('ImageFaceHandling.isFaceClicked Album_Data:' + JSON.stringify(Album_Data,null,'\t'));
			let faceData = Album_Data['images'][fname]['faces']['faceList'];
			let i = 0;
			for(var fd of faceData) {
				let newFaceBox = adjustFaceBox(fd,deltaWidth,deltaHeight);
				logger('ImageFaceHandling.isFaceClicked: newFaceBox' + JSON.stringify(newFaceBox,null,'\t'));
				let faceBoxXMax =  (newFaceBox.startX)+newFaceBox.width+(2*Config.lineWidth);
				let faceBoxYMax =  (newFaceBox.startY)+newFaceBox.height+(2*Config.lineWidth);
				logger('imageFaceHandling.isFaceClicked: faceBoxXMax=' + faceBoxXMax + ' faceBoxYMax=' + faceBoxYMax);
				if(
					(pos.x >= (newFaceBox.startX)) && (pos.x < faceBoxXMax)
					 && (pos.y >= (newFaceBox.startY)) && (pos.y < faceBoxYMax)
				  )
				  {
						 console.log('imageFaceHandling.isFaceClicked: clicked in face %s',fd.firstName);
						 return i;
					 }
					 else {
						 logger('imageFaceHandling.isFaceClicked: NOT clicked in face');
					 }
					 ++i;
				}
			return -1;
		} // isFaceClicked

	// if a face is not detected by the preprocessing, we can draw a new face box
	// basic drawing code from
	// https://jsfiddle.net/richardcwc/ukqhf54k/
	function drawBox()
	{
		var canvasx = $(Config.canvas).offset().left;
		var canvasy = $(Config.canvas).offset().top;
		var last_mousex = last_mousey = 0;
		var mousex = mousey = 0;
		var mousedown = false;

		//Mousedown
		$(Config.canvas).on('mousedown', function(e) {
    		last_mousex = parseInt(e.clientX-canvasx);
			last_mousey = parseInt(e.clientY-canvasy);
    		mousedown = true;
		});

		//Mouseup
		$(Config.canvas).on('mouseup', function(e) {
    		mousedown = false;
		});

		//Mousemove
		$(Config.canvas).on('mousemove', function(e) {
    		mousex = parseInt(e.clientX-canvasx);
			mousey = parseInt(e.clientY-canvasy);
    		if(mousedown) {
        		Config.ctx.clearRect(0,0,Config.canvas.width,canvas.height); //clear canvas
        		Config.ctx.beginPath();
        		var width = mousex-last_mousex;
        		var height = mousey-last_mousey;
        		Config.ctx.rect(last_mousex,last_mousey,width,height);
        		Config.ctx.strokeStyle = 'black';
        		Config.ctx.lineWidth = 10;
        		Config.ctx.stroke();
    		}
    		//Output
    		$('#output').html('current: '+mousex+', '+mousey+'<br/>last: '+last_mousex+', '+last_mousey+'<br/>mousedown: '+mousedown);
		});
	} // drawBox

	var faceEdit = function(ev)
	{
		logger('ImageFaceHandling.faceEdit : START');
		ev.stopPropagation();
		let target = ev.currentTarget;
		fname = getFileName();
		console.log('ImageFaceHandling.faceEdit: fname :' + fname + ':');
		let face = isFaceClicked(ev);
		logger('ImageFaceHandling.faceEdit: after isFaceClicked face %d',face);
		if(face != -1) {
			//logger('ImageFaceHandling.faceEdit Album_Data:' + JSON.stringify(Album_Data,null,'\t'));
			logger('ImageFaceHandling.faceEdit fname:' + fname);
			logger('ImageFaceHandling.faceEdit calling openFaceInfo');

			let faceData = Album_Data['images'][fname]['faces']['faceList'];
			let fd = faceData[face];
			openFaceInfo(fd);
			if (window.confirm('faceEdit: Do you want to delete this face information (' + fd.firstName + ' ' + fd.lastName + ')?')) { 
				faceData.splice(face,1);
				logger('ImageFaceHandling.faceEdit faceData after splice :' + JSON.stringify(faceData,null,'\t'));
				logger('ImageFaceHandling.faceEdit: Yes delete face box');
				logger('ImageFaceHandling.faceEdit face :' + JSON.stringify(fd,null,'\t'));
				Config.ctx.clearRect(0, 0, Config.canvas.width, Config.canvas.height);
				drawFaces(fname);
			}
			else {
				logger('ImageFaceHandling.faceEdit: NO  do not delete face box');
			}
		}
		else {
			logger('ImageFaceHandling.faceEdit: Not a face');
		}
	} // faceEdit

	function openFaceInfo(faceData)
	{
		logger('ImageFaceHandling.openFaceInfo: Start');
		console.log('ImageFaceHandling. openFaceInfo: first name = :%s: last name = :%s:',faceData.firstName,faceData.lastName);
		document.getElementById('FaceInfoFirstName').value = faceData.firstName;
		document.getElementById('FaceInfoSecondName').value = faceData.lastName;
		document.getElementById('FaceInfo').style.display='block';
   	document.getElementById('FaceInfoBlackout').style.display='block';
	}  // openFaceData


	function FaceInfoHide()
	{
		document.getElementById('FaceInfo').style.display='none';
		document.getElementById('FaceInfoBlackout').style.display='none';
	} // FaceInfoHide

	// construct a DOM element using the passed in parameters
	function makeElement(kind,params,content) {
			let el = document.createElement(kind);
			for (var attr in params) {
				el.setAttribute(attr,params[attr]);
			}
			$(el).html(content);
			return el;
	} // makeElement

  return {
	 init: init
	 ,setup: setup
	 ,showConfig: showConfig
	 ,drawFaces : drawFaces
	 ,showPicture : showPicture
	 ,faceEdit : faceEdit
  };
})();
