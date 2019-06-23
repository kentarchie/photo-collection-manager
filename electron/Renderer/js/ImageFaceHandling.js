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
				,jImage : null
				,canvas : null
				,Jcanvas : null
				,ctx : null
        };
 
      	// Allow overriding the default config
			$.extend( Config, settings );

			this.showConfig();
		 } // init

	 var setup = function()
	 {
		//Config.wrapperTag = createDOM();
		Config.wrapperTag = $('#pictureDisplay');

		setTimeout(function(){
			Config.jImage  = $('#' + IFH_ImageElementID);
			Config.jCanvas = $('#'+IFH_CanvasElementID);
			Config.canvas  = Config.jCanvas.get(0);
			Config.ctx     = Config.canvas.getContext('2d');
			Config.image   = Config.jImage.get(0);
      	logger ('ImageFaceHandling.setup: The Config.canvas.top is %s left %s',Config.jCanvas.css('top'),Config.jCanvas.css('left'));
      	logger ('ImageFaceHandling.setup: The Config.image.id is %s',Config.jImage.attr('id'));

			// the canvas and image must be in the same place and the same size
			Config.wrapperTag.width(Config.displayBoxWidth);
			Config.wrapperTag.height(Config.displayBoxHeight);
			Config.jCanvas.width  = Config.displayBoxWidth;
			Config.jCanvas.height = Config.displayBoxHeight;
			Config.jCanvas.css('top',Config.jCanvas.css('top'));
			Config.jCanvas.css('left', Config.jCanvas.css('left'));

			Config.ctx.lineWidth   = Config.lineWidth;
			Config.ctx.strokeStyle = Config.strokeStyle;

			//Config.jCanvas.single_double_click(onImageClick,onImageDoubleClick);
			Config.jCanvas.click(onImageClick);
			Config.jCanvas.dblclick(onImageDoubleClick);
		},100);
	 } // setup
 
	/*
	<!-- the pictureDisplay div and class is passed in by the user -->
	<div id="pictureDisplay" class="pictureDisplay IFH_WrapperClass">
		<div class="IHF_Buttons_Block">
			<button id="IFH_UndoDelete" class="IFH_ButtonBaseClass IFH_UndoButtonClass">
				⎌ Delete
			</button>
			<button id="IFH_UndoCreate" class="IFH_ButtonBaseClass IFH_UndoButtonClass">
				⎌ Create
			</button>
			<button id="IFH_CreateFace" class="IFH_ButtonBaseClass IFH_CreateButtonClass">
				Mark Face
			</button>
			<button id="IFH_DeleteFace" class="IFH_ButtonBaseClass IFH_DeleteButtonClass">
				Delete Face
			</button>
		</div> <!-- IHF_Buttons_Block -->
		<div class="IFH_ImageGroupClass">
			<img id="IFH_ImageTag" src="TestAlbum/PD0005.jpg" alt="image to display" class="IFH_ImageTagClass" data-file="PD0005.jpg" />>>
			<canvas id="IFH_CanvasTag" class="IFH_CoveringCanvas""></canvas>
		</div> <!-- IFH_ImageGroupClass -->
	</div> <!-- pictureDisplay -->
	*/
	function createDOM()
	{
		var pd = $('#'+Config.wrapperID);
		pd.addClass('IFH_WrapperClass');
		logger('ImageFaceHandling.createDOM: got pd');

		let buttons = makeElement('div', {
				'class' : IFH_BUTTONS_BLOCK
					},'');
				
		buttons.append(makeElement('button',{
				'id' : IFH_UndoDeleteID,
				'class' : IFH_ButtonBaseClass +' ' + IFH_UndoButtonClass
				},
				'&#x238C; Delete'));
		buttons.append(makeElement('button',{
				'id' : IFH_UndoCreateID,
				'class' : IFH_ButtonBaseClass +' ' + IFH_UndoButtonClass
				},
				'&#x238C; Create'));
		buttons.append(makeElement('button',{
				'id' : IFH_CreateFaceID,
				'class' : IFH_ButtonBaseClass +' ' + IFH_CreateButtonClass
				},
				'Mark Face'));
		buttons.append(makeElement('button',{
				'id' : IFH_DeleteFaceID,
				'class' : IFH_ButtonBaseClass +' ' + IFH_DeleteButtonClass
				},
				'Delete Face'));
					
		let images = makeElement('div', {
				'class' : IFH_ImageGroupClass
					},'');
			
		images.append(makeElement('img', {
				'id': IFH_ImageElementID,
				'src':'#',
				'alt':'image to display',
				'class': IFH_ImageElementClass,
      		'width': Config.displayBoxWidth+'px',
      		'height': Config.displayBoxHeight+'px',
				'data-file':''
					},''
				) 
			);
				
		images.append(makeElement('canvas',{
				'id':IFH_CanvasElementID,
				'class': IFH_CanvasClass,
				'width' : Config.displayBoxWidth,
				'height' : Config.displayBoxHeight
				},'')
			);
				  
		pd.append(buttons);
		pd.append(images);
		return pd;
	 } // createDOM
	 
	 // called as part of the main page picture select onChange
	var showPicture = function(fname)
	{
		logger('ImageFaceHandling.showPicture: Config.albumName :%s: fname :%s: ',Config.albumName,fname);
		Config.jImage.attr('src', Config.albumName + '/' + fname);
		logger('ImageFaceHandling.showPicture: jImage.src :%s:',Config.jImage.src);
		logger('ImageFaceHandling.showPicture: image.src :%s:',Config.image.src);
		Config.jImage.attr('data-File',fname);
	} // showPicture

	// the position and size of teh box around a face is
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

	var showConfig = function()
	{
		logger('ImageFaceHandling.showConfig :' + JSON.stringify(Config,null,'\t'));
	} // showConfig

	// go through the album data for the displayed image
	// and draw the boxes arond all the faces
	var drawFaces = function(fname)
	{
		logger('ImageFaceHandling.drawFaces fname %s',fname);
		const faceData = Album_Data['images'][fname]['faces']['faceList'];

			//logger('ImageFaceHandling.drawFaces fname %s faceData %s:',fname, JSON.stringify(faceData,null,'\t'));
			//logger ('ImageFaceHandling.drawFaces: The image id is :%s:',Config.jImage.attr('id'));
			//logger('ImageFaceHandling.drawFaces: scrollX,scrollY %s,%s',window.scrollX, window.scrollY);
			//logger('ImageFaceHandling.drawFaces: canvas width,height %s,%s',Config.jCanvas.width, Config.jCanvas.height);
			//logger ('ImageFaceHandling.drawFaces: albumName is :%s:',Config.albumName);

		let im = new Image();
		im.src = Config.albumName + '/' + fname;
      	//logger ('ImageFaceHandling.drawFaces: The box sizes are %f * %f',Config.displayBoxHeight,Config.displayBoxWidth);
			//logger ('ImageFaceHandling.drawFaces: The im natural sizes are %f(height) * %f(width)',im.naturalHeight,im.naturalWidth);
			//logger ('ImageFaceHandling.drawFaces: The canvas left offset %f  top offset %f',Config.jCanvas.offset().left,Config.jCanvas.offset().top);

		let deltaWidth = Config.displayBoxWidth / im.naturalWidth;
		let deltaHeight = Config.displayBoxHeight / im.naturalHeight;
      	logger ('ImageFaceHandling.drawFaces: The delta size is (width) %f  (height) %f',deltaWidth,deltaHeight);

		//let colors = ['#FF0000','#00FF00'];  // used during debugging
		faceData.forEach((fd, i) => {
				//logger('ImageFaceHandling.drawFaces: fd ' + JSON.stringify(fd,null,'\t'));
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

	// if a face box is single clicked, display the name information for editting
	var onImageClick = function(e)
	{
		logger('ImageFaceHandling.onImageClick : START');

		let target = e.currentTarget;
		//let fname = Config.jImage.attr('data-file');
		let fname = $('#pictureFileName').text();
		let deltaWidth = Config.displayBoxWidth / Config.image.naturalWidth;
		let deltaHeight = Config.displayBoxHeight / Config.image.naturalHeight;
		var rect = target.getBoundingClientRect();

		logger('ImageFaceHandling.onImageClick: fname :%s: target.id :%s: target.tag :%s:',fname,target.id,target.tagName);
		logger('ImageFaceHandling.onImageClick: image.id :%s:',Config.image.id );
		logger('ImageFaceHandling.onImageClick: boundingbox top %d,right %d,bottom %d,left %d',rect.top, rect.right, rect.bottom, rect.left);

		logger('ImageFaceHandling.onImageClick: e.clientX %d e.clientY %d',e.clientX, e.clientY);
  		const pos = {
    			x: Math.floor(e.clientX  - rect.left)
    			,y: Math.floor(e.clientY -  rect.top)
  		};
				logger('ImageFaceHandling.onImageClick pos = ' + JSON.stringify(pos,null,'\t'));
		let face = isFaceClicked(fname,pos,rect,deltaWidth,deltaHeight);
		if(face != -1) {
			let first = Album_Data['images'][fname]['faces']['faceList'][face].firstName;
			let last = Album_Data['images'][fname]['faces']['faceList'][face].lastName;
			logger('ImageFaceHandling. onImageClick: first name = :%s: last name = :%s:',first,last);
		}
		else 
			logger('ImageFaceHandling.onImageClick: clicked NOT ON face %d', face);
	} // onImageClick

	// double click on a face box to delete it
	// the chosen one gets removed fron the album data
	// and the faces get redrawn
	var onImageDoubleClick = function(ev)
	{
		logger('ImageFaceHandling.onImageDoubleClick : START');
		ev.stopPropagation();
		let target = ev.currentTarget;
		let fname = Config.jImage.attr('data-file');
		var rect = target.getBoundingClientRect();
		logger('onImageDoubleClick: fname %s target.id %s target.tag %s',fname,target.id,target.tagName);

		let deltaWidth = Config.displayBoxWidth / Config.image.naturalWidth;
		let deltaHeight = Config.displayBoxHeight / Config.image.naturalHeight;
      logger ('ImageFaceHandling.onImageDoubleClick: The delta size is (width) %f  (height) %f',deltaWidth,deltaHeight);
		logger('ImageFaceHandling.onImageDoubleClick: boundingbox %d,%d,%d,%d',rect.top, rect.right, rect.bottom, rect.left);

  		const pos = {
    			x: Math.floor(ev.clientX  - rect.left)
    			,y: Math.floor(ev.clientY -  rect.top)
  		};
		logger('ImageFaceHandling.onImageDoubleClick pos :' + JSON.stringify(pos,null,'\t'));
		let face = isFaceClicked(fname,pos,rect,deltaWidth,deltaHeight);
		logger('ImageFaceHandling.onImageDoubleClick: after isFaceClicked face %d',face);
		if(face != -1) {
			let faceData = Album_Data['images'][fname]['faces']['faceList']
			let fd = faceData[face];
			if (window.confirm('Do you want to delete this face information (' + fd.firstName + ' ' + fd.lastName + ')?')) { 
				faceData.splice(face,1);
				logger('ImageFaceHandling.onImageDoubleClick faceData after splice :' + JSON.stringify(faceData,null,'\t'));
				logger('ImageFaceHandling.onImageDoubleClick: Yes delete face box');
				logger('ImageFaceHandling.onImageDoubleClick face :' + JSON.stringify(fd,null,'\t'));
				Config.ctx.clearRect(0, 0, Config.canvas.width, Config.canvas.height);
				drawFaces(fname);
			}
			else {
				logger('ImageFaceHandling.onImageDoubleClick: NO  do not delete face box');
			}
		}
		else {
			logger('ImageFaceHandling.onImageDoubleClick: Not a face');
		}
	} // onImageDoubleClick

	// see if we clicked on one of the displayed face boxes
	// rect is the boundingBox of the canvas
	var isFaceClicked	= function (picFileName, pos,rect,deltaWidth,deltaHeight)
		{
			logger('imageFaceHandling.isFaceClicked: x=%d y=%d',pos.x,pos.y);
			logger('imageFaceHandling.isFaceClicked: picFileName=:%s:',picFileName);
			let faceData = Album_Data['images'][picFileName]['faces']['faceList'];
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
						 logger('imageFaceHandling.isFaceClicked: clicked in face %s',fd.firstName);
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
		//Canvas
		var canvas = Config.canvas;
		var ctx = canvas.getContext('2d');
		//Variables
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
		let fname = Config.jImage.attr('data-file');
		var rect = target.getBoundingClientRect();
		logger('ImageFaceHandling.faceEdit: fname :%s: target.id :%s: target.tag :%s:',fname,target.id,target.tagName);

		let deltaWidth = Config.displayBoxWidth / Config.image.naturalWidth;
		let deltaHeight = Config.displayBoxHeight / Config.image.naturalHeight;
      	logger ('ImageFaceHandling.faceEdit: The delta size is (width) %f  (height) %f',deltaWidth,deltaHeight);
		logger('ImageFaceHandling.faceEdit: boundingbox %d,%d,%d,%d',rect.top, rect.right, rect.bottom, rect.left);

  		const pos = {
    			x: Math.floor(ev.clientX  - rect.left)
    			,y: Math.floor(ev.clientY -  rect.top)
  		};
		logger('ImageFaceHandling.faceEdit pos :' + JSON.stringify(pos,null,'\t'));
		let face = isFaceClicked(fname,pos,rect,deltaWidth,deltaHeight);
		logger('ImageFaceHandling.faceEdit: after isFaceClicked face %d',face);
		if(face != -1) {
			let faceData = Album_Data['images'][fname]['faces']['faceList']
			let fd = faceData[face];
			if (window.confirm('Do you want to delete this face information (' + fd.firstName + ' ' + fd.lastName + ')?')) { 
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