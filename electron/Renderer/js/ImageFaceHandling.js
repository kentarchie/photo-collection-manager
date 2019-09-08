var ImageFaceHandling = (function () {
    	const IFH_ImageElementID  = 'IFH_ImageTag';
    	const IFH_CanvasElementID = 'IFH_CanvasTag';

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

			//Config.canvas.addEventListener('click',(e) => { onImageClick(e);});
			Config.canvas.addEventListener('click',onImageClick);
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
	var getConfig = () => { return Config; }

	// go through the album data for the displayed image
	// and draw the boxes around all the faces
	var drawFaces = function(fname)
	{
		console.log('ImageFaceHandling.drawFaces fname %s',fname);
		//let faceData = Album_Data['images'][fname]['faces']['faceList'];
		let faceData = AlbumData.getFaceList(fname);

			console.log('ImageFaceHandling.drawFaces faceData %s:',JSON.stringify(faceData,null,'\t'));
			//logger ('ImageFaceHandling.drawFaces: The image id is :%s:',Config.inage.getAttribute('id'));
			//logger('ImageFaceHandling.drawFaces: scrollX,scrollY %s,%s',window.scrollX, window.scrollY);
			//logger('ImageFaceHandling.drawFaces: canvas width,height %s,%s',Config.canvas.width, Config.canvas.height);
			console.log ('ImageFaceHandling.drawFaces: albumName is :%s:',Config.albumName);

		let imageTag = document.getElementById('IFH_ImageTag');
		console.log ('ImageFaceHandling.drawFaces: imageTag.width,height is :%d,%d:',imageTag.width,imageTag.height);
		console.log ('ImageFaceHandling.drawFaces: imageTag.src is :%s:',imageTag.src);
		console.log ('RENDERER: ImageFaceHandling.drawFaces: The imageTag natural sizes are %f(height) * %f(width)',imageTag.naturalHeight,imageTag.naturalWidth);

		let deltaHeight = Config.displayBoxHeight / imageTag.naturalHeight;
		let deltaWidth = Config.displayBoxWidth / imageTag.naturalWidth;
      	console.log ('ImageFaceHandling.drawFaces: The delta size is (width) %f  (height) %f',deltaWidth,deltaHeight);

		//let colors = ['#FF0000','#00FF00'];  // used during debugging
		faceData.forEach((fd, i) => {
				console.log('ImageFaceHandling.drawFaces: fd ' + JSON.stringify(fd,null,'\t'));
			let newFaceBox = adjustFaceBox(fd,deltaWidth,deltaHeight);
				console.log('ImageFaceHandling.drawFaces newFaceBox = ' + JSON.stringify(newFaceBox,null,'\t'));
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
		let fnamePath = document.getElementById('IFH_ImageTag').dataset.filename;
		console.log('ImageFaceHandling.getFileName: fnamePath :' + fnamePath + ':');
    	//let pathParts = pathLib.parse(fnamePath);
    	//let fname = pathParts.base;
		//console.log('ImageFaceHandling.getFileName: fname :' + fname + ':');
		//return fname;
		return fnamePath;
	} // getFileName

	function deleteFaceBox(ev)
	{
		logger('ImageFaceHandling.deleteFaceBox: START');
		let target = CurrentFace.currentTarget;
    	let fname = getFileName();
		logger('ImageFaceHandling.deleteFaceBox: fname=:'+fname+':');
		//let faceData = Album_Data['images'][fname]['faces']['faceList']
		let faceData = AlbumData.getFaceList(fname);
		let face = isFaceClicked(CurrentFace);
		if(face != -1) {
			logger('ImageFaceHandling.deleteFaceBox: face=:'+face+':');
			let fd = faceData[face];
			if (window.confirm('Do you want to delete this face information (' + fd.firstName + ' ' + fd.lastName + ')?')) { 
				logger('ImageFaceHandling.deleteFaceBox: Yes delete face box');
				//Album_Data['images'][fname]['faces']['faceList'].splice(face,1);  // delete face object from list
            AlbumData.deleteFaceData(fname,face);
		      faceData = AlbumData.getFaceList(fname);
				logger('ImageFaceHandling.deleteFaceBox: faceData after splice :' + JSON.stringify(faceData,null,'\t'));
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

	// if a face box is single clicked, display the name information for editing
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
			let faceData = AlbumData.getFaceList(fname);
			console.log('ImageFaceHandling. onImageClick: first name = :%s: last name = :%s:',faceData[face].firstName,faceData[face].lastName);
			FaceInfo.openFaceInfo(faceData[face]);
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
			console.log('imageFaceHandling.isFaceClicked: x=%d y=%d',pos.x,pos.y);

			//logger('ImageFaceHandling.isFaceClicked Album_Data:' + JSON.stringify(Album_Data,null,'\t'));
         console.log('imageFaceHandling.isFaceClicked: image fname :%s:',fname);
			//let faceData = AlbumData['images'][fname]['faces']['faceList'];
			let faceData = AlbumData.getFaceList(fname);
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
			FaceInfo.openFaceInfo(fd);
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

	var addFaceBox = function(faceBox)
	{
		let fname = getFileName();
      logger('ImageFaceHandling.addFaceBox new FaceBox :' + JSON.stringify(faceBox,null,'\t'));
		logger('ImageFaceHandling.faceEdit: fname :' + fname + ':');
      let newFace = {
            'lastName'   : (faceBox['lastName'] != "") ? faceBox['lastName'] : ''
            ,'firstName' : (faceBox['firstName'] != "") ? faceBox['firstName'] : ''
            ,'height': Math.abs(faceBox['start_y'] - faceBox['end_y'])
            ,'width': Math.abs(faceBox['start_x'] - faceBox['end_x'])
            ,'startY': faceBox['start_y']
            ,'startX': faceBox['start_x']
      };

		let faceData = AlbumData.getFaceList(fname);
      AlbumData.addFaceData(fname,newFace);
		AlbumData.save();

		faceData = AlbumData.getFaceList(fname);
      FaceInfo.init(faceData);
      FaceInfo.openFaceInfo(newFace);
      logger('ImageFaceHandling.addFaceBox new face list :' + JSON.stringify( faceData ,null,'\t'));
	} //addFaceBox

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
	 init           : init
	 ,setup         : setup
	 ,showConfig    : showConfig
	 ,getConfig     : getConfig
	 ,drawFaces     : drawFaces
	 ,showPicture   : showPicture
	 ,faceEdit      : faceEdit
    ,addFaceBox    : addFaceBox
	 ,deleteFaceBox : deleteFaceBox
  };
})();
