var ImageFaceHandling = (function () {
    	const IFH_ImageElementID  = 'IFH_ImageTag';
		const IFH_CanvasElementID = 'IFH_CanvasTag';
		const FaceBoxBaseColor = '#0000FF';
		const FaceBoxHighLightColor = '#FF0000';
		const FaceBoxBaseWidth = 2;
		const FaceBoxHighLightWidth = 4;

		let Config = {};
		let CurrentFace = {};

		var init = function( settings )
		{
			console.log('RENDERER: ImageFaceHandling.init: START');
      		Config = {
         	wrapperID: 'IFH_pictureDisplay'
        		,wrapperClass: 'IFH_WrapperClass'
        		,albumName: 'testAlbum'
				,lineWidth : FaceBoxBaseWidth
				,strokeStyle : FaceBoxBaseWidth
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

		setTimeout(() => {
			Config.canvas  = document.getElementById(IFH_CanvasElementID);
			Config.ctx     = Config.canvas.getContext('2d');
			Config.image  = document.getElementById(IFH_ImageElementID);
      		console.log('RENDERER: ImageFaceHandling.setup: The Config.canvas.top is %s left %s',Config.canvas.style.top,Config.canvas.style.left);
      		console.log('RENDERER: ImageFaceHandling.setup: The Config.image.id is %s',Config.image.getAttribute('id'));

			// the canvas and image must be in the same place and the same size
			Config.wrapperTag.width = Config.displayBoxWidth;
			Config.wrapperTag.height = Config.displayBoxHeight;

			Config.canvas.width  = Config.displayBoxWidth;
			Config.canvas.height = Config.displayBoxHeight;

			Config.ctx.lineWidth   = FaceBoxBaseWidth;
			Config.ctx.strokeStyle = FaceBoxBaseColor;

			Config.canvas.addEventListener('click',onImageClick);
		},100);
	 } // setup
	 
	 // called as part of the main page picture select onChange
	var showPicture = function(fname)
	{
		console.log('RENDERER: ImageFaceHandling.showPicture: Config.albumName :%s: fname :%s: ',Config.albumName,fname);
		Config.image.setAttribute('src', Config.albumName + '/' + fname);

		console.log('RENDERER: ImageFaceHandling.showPicture: image.src :%s:',Config.image.src);
		Config.image.setAttribute('data-File',fname);
	} // showPicture

	// the position and size of the box around a face is
	// based on the original image size and has to be 
	// adjusted to the size of the display

	function adjustFaceBox(boxSpec)
	{
		let [deltaWidth, deltaHeight] = getDeltas();
		console.log('RENDERER: ImageFaceHandling.adjustFaceBox: The delta size is (width) %.4f (height) %.4f',deltaWidth,deltaHeight);
		let result = {
				 'startX' : Math.floor(deltaWidth  * boxSpec.startX)
				,'startY' : Math.floor(deltaHeight * boxSpec.startY)
				,'width'  : Math.floor(deltaWidth  * (boxSpec.width))
				,'height' : Math.floor(deltaHeight * (boxSpec.height))
		};
		return result;
	} // adjustFaceBox

	var showConfig = () => { console.log('RENDERER: ImageFaceHandling.showConfig :%s:',JSON.stringify(Config,null,'\t')); }
	var getConfig = () => { return Config; }

	var getDeltas = function()
	{
		let imageTag = document.getElementById('IFH_ImageTag');
		let [displayBoxWidth , displayBoxHeight] = [450,450];
		let deltaWidth = displayBoxWidth / imageTag.naturalWidth;
		let deltaHeight = displayBoxHeight / imageTag.naturalHeight;
		console.log('RENDERER: ImageFaceHandling.getDeltas: The delta size is (width) %.4f  (height) %.4f',deltaWidth,deltaHeight);
		return [ deltaWidth ,deltaHeight ];
	} // getDeltas

	// go through the album data for the displayed image
	// and draw the boxes around all the faces
	var drawFaces = function(fname)
	{
		console.log('RENDERER: ImageFaceHandling.drawFaces fname %s',fname);
		let faceData = AlbumData.getFaceList(fname);

			console.log('RENDERER: ImageFaceHandling.drawFaces faceData :%s:',JSON.stringify(faceData,null,'\t'));
			//console.log ('RENDERER: ImageFaceHandling.drawFaces: The image id is :%s:',Config.inage.getAttribute('id'));
			//console.log('RENDERER: ImageFaceHandling.drawFaces: scrollX,scrollY %s,%s',window.scrollX, window.scrollY);
			//console.log('RENDERER: ImageFaceHandling.drawFaces: canvas width,height %s,%s',Config.canvas.width, Config.canvas.height);
			console.log ('RENDERER: ImageFaceHandling.drawFaces: albumName is :%s:',Config.albumName);

		let imageTag = document.getElementById('IFH_ImageTag');
		console.log ('RENDERER: ImageFaceHandling.drawFaces: imageTag.width,height is :%d,%d:',imageTag.width,imageTag.height);
		console.log ('RENDERER: ImageFaceHandling.drawFaces: imageTag.src is :%s:',imageTag.src);
		console.log ('RENDERER: ImageFaceHandling.drawFaces: The imageTag natural sizes are %f(height) * %f(width)',imageTag.naturalHeight,imageTag.naturalWidth);

		let [deltaWidth, deltaHeight] = getDeltas();
      	console.log('RENDERER: ImageFaceHandling.drawFaces: The delta size is (width) %.4f  (height) %.4f',deltaWidth,deltaHeight);
		Config.ctx.clearRect(0, 0, Config.canvas.width, Config.canvas.height);

		FaceInfo.clearWhoList();
		if(faceData.length == 0) {
			FaceDetectionCode.updateResults(Config.canvas,imageTag,0.5);
		}

		faceData.forEach((fd, i) => {
			console.log('RENDERER: ImageFaceHandling.drawFaces: fd %s',JSON.stringify(fd,null,'\t'));
			let newFaceBox = adjustFaceBox(fd);
			console.log('RENDERER: ImageFaceHandling.drawFaces newFaceBox = :%s ',JSON.stringify(newFaceBox,null,'\t'));
			// draw rectangle
			drawFaceBox(FaceBoxBaseColor,FaceBoxBaseWidth,newFaceBox);

			FaceInfo.displayFaceData(i, fd.firstName, fd.lastName);
		});
			console.log('RENDERER: ImageFaceHandling.drawFaces: boxes drawn');
	} // drawFaces

	function getFileName()
	{
		let fnamePath = document.getElementById('IFH_ImageTag').dataset.filename;
		console.log('RENDERER: ImageFaceHandling.getFileName: fnamePath :%s:', fnamePath);
		return fnamePath;
	} // getFileName

	function deleteFaceBox(ev)
	{
		console.log('RENDERER: ImageFaceHandling.deleteFaceBox: START');
		let target = CurrentFace.currentTarget;
    	let fname = getFileName();
		console.log('RENDERER: ImageFaceHandling.deleteFaceBox: fname=:%s:',fname);
		//let faceData = Album_Data['images'][fname]['faces']['faceList']
		let faceData = AlbumData.getFaceList(fname);
		let face = isFaceClicked(CurrentFace);
		if(face != -1) {
			console.log('RENDERER: ImageFaceHandling.deleteFaceBox: face=:%s:',face);
			let fd = faceData[face];
			if (window.confirm('Do you want to delete this face information (' + fd.firstName + ' ' + fd.lastName + ')?')) { 
				console.log('RENDERER: ImageFaceHandling.deleteFaceBox: Yes delete face box');
            	AlbumData.deleteFaceData(fname,face);
		      	faceData = AlbumData.getFaceList(fname); // get the revised face list
				console.log('RENDERER: ImageFaceHandling.deleteFaceBox: faceData after delete : %s',JSON.stringify(faceData,null,'\t'));
				console.log('RENDERER: ImageFaceHandling.deleteFaceBox: face info : %s',JSON.stringify(faceData[face],null,'\t'));

				// clear the face box canvas and readraw after delete
				Config.ctx.clearRect(0, 0, Config.canvas.width, Config.canvas.height);
				drawFaces(fname);
				FaceInfo.closeNoChange();
			}
			else {
				console.log('RENDERER: ImageFaceHandling.deleteFaceBox: NO  do not delete face box');
			}
		}
		else {
				console.log('RENDERER: ImageFaceHandling.deleteFaceBox: Not a face');
		}
	} // deleteFaceBox


	var highLightFace = function(fname,faceNumber)
	{
		drawFaces(fname);
		let faceData = AlbumData.getFaceList(fname);
		let fd = faceData[faceNumber];
		let newFaceBox = adjustFaceBox(fd);
		console.log('RENDERER: ImageFaceHandling.highLightFace: face = :%d: first name = :%s: last name = :%s:'
			,faceNumber,fd.firstName,fd.lastName);
		console.log('RENDERER: ImageFaceHandling.highLightFace (181): Calling FaceInfo.openFaceInfo face = %d',faceNumber);
		drawFaceBox( FaceBoxHighLightColor
			,FaceBoxBaseWidth
			,newFaceBox);
		FaceInfo.faceSelected (fd,faceNumber);
   		document.getElementById('IFH_DeleteFace').style.visibility='visible';
   		document.getElementById('IFH_SaveChanges').style.visibility='visible';
	} // highLightFace

	// if a face box is single clicked, display the name information for editing
	var onImageClick = function(ev)
	{
		console.log('RENDERER: ImageFaceHandling.onImageClick.onImageClick: START DrawBox.boxDrawn() :%s:',DrawBox.boxDrawn());
		if(DrawBox.boxDrawn()) return;
		CurrentFace.currentTarget = ev.currentTarget; // save for later use
    	CurrentFace.clientX = ev.clientX;
    	CurrentFace.clientY = ev.clientY;
		// let [deltaWidth, deltaHeight] = getDeltas();

		// let target = ev.currentTarget;
    	let fname = getFileName();
		console.log('RENDERER: ImageFaceHandling.onImageClick.onImageClick: fname :%s:',fname);

		let face = isFaceClicked(ev);
		if(face != -1) {  // we have clicked on a face box
			highLightFace(fname,face);
		}
		else 
			console.log('RENDERER: ImageFaceHandling.onImageClick: clicked NOT ON face %d', face);
	} // onImageClick

	// see if we clicked on one of the displayed face boxes
	// rect is the boundingBox of the canvas
	var isFaceClicked = function (ev)
	{
			console.log('RENDERER: ImageFaceHandling.isFaceClicked: START'); 
			let fname = getFileName();
			let target = ev.currentTarget;
			console.log('RENDERER: ImageFaceHandling.onImageClick: fname :%s: target.id :%s: target.tag :%s:',fname,target.id,target.tagName);
			let [deltaWidth, deltaHeight] = getDeltas();
      		console.log('RENDERER: ImageFaceHandling.isFaceClicked: The delta size is (width) %.4f  (height) %.4f',deltaWidth,deltaHeight);

			var rect = target.getBoundingClientRect();
			console.log('RENDERER: ImageFaceHandling.onImageClick: boundingbox top %d,right %d,bottom %d,left %d',rect.top, rect.right, rect.bottom, rect.left);


			console.log('RENDERER: ImageFaceHandling.onImageClick: e.clientX %d e.clientY %d',ev.clientX, ev.clientY);
  			const pos = {
    			x: Math.floor(ev.clientX  - rect.left)
    			,y: Math.floor(ev.clientY -  rect.top)
  			};
			console.log('RENDERER: ImageFaceHandling.isFaceClicked: x=%d y=%d',pos.x,pos.y);

			//console.log('RENDERER: ImageFaceHandling.isFaceClicked Album_Data:' + JSON.stringify(Album_Data,null,'\t'));
         	console.log('RENDERER: ImageFaceHandling.isFaceClicked: image fname :%s:',fname);
			//let faceData = AlbumData['images'][fname]['faces']['faceList'];
			let faceData = AlbumData.getFaceList(fname);
			let i = 0;
			for(var fd of faceData) {
				let newFaceBox = adjustFaceBox(fd);
				console.log('RENDERER: ImageFaceHandling.isFaceClicked: newFaceBox %s',JSON.stringify(newFaceBox,null,'\t'));
				let faceBoxXMax =  (newFaceBox.startX)+newFaceBox.width+(2 * FaceBoxBaseWidth);
				let faceBoxYMax =  (newFaceBox.startY)+newFaceBox.height+(2 * FaceBoxBaseWidth);
				console.log('RENDERER: ImageFaceHandling.isFaceClicked: faceBoxXMax= %d faceBoxYMax=%d',faceBoxXMax, faceBoxYMax);
				if(
					(pos.x >= (newFaceBox.startX)) && (pos.x < faceBoxXMax)
					 && (pos.y >= (newFaceBox.startY)) && (pos.y < faceBoxYMax)
					)
					{
						console.log('RENDERER: ImageFaceHandling.isFaceClicked: clicked in face %s',fd.firstName);
						return i;
					}
					else {
						console.log('RENDERER: ImageFaceHandling.isFaceClicked: NOT clicked in face');
					}
				++i;
			}
			return -1;
		} // isFaceClicked

	var faceEdit = function(ev)
	{
		ev.preventDefault();
		console.log('RENDERER: ImageFaceHandling.faceEdit : START');
		let target = ev.currentTarget;
		let fname = getFileName();
		console.log('RENDERER: ImageFaceHandling.faceEdit: fname :%s:',fname);
		let face = isFaceClicked(ev);
		console.log('RENDERER: ImageFaceHandling.faceEdit: after isFaceClicked face %d',face);
		if(face != -1) {
			console.log('RENDERER: ImageFaceHandling.faceEdit fname :%s:',fname);

			let faceData = AlbumData.getFaceList();
			let fd = faceData[face];
			console.log('RENDERER: ImageFaceHandling.faceEdit (253): Calling FaceInfo.openFaceInfo face = %d',face);
			FaceInfo.openFaceInfo(fd,face);
			if (window.confirm('faceEdit: Do you want to delete this face information (' + fd.firstName + ' ' + fd.lastName + ')?')) { 
				faceData.splice(face,1);
				console.log('RENDERER: ImageFaceHandling.faceEdit faceData after splice : %s',JSON.stringify(faceData,null,'\t'));
				console.log('RENDERER: ImageFaceHandling.faceEdit: Yes delete face box');
				console.log('RENDERER: ImageFaceHandling.faceEdit face :%s',JSON.stringify(fd,null,'\t'));
				Config.ctx.clearRect(0, 0, Config.canvas.width, Config.canvas.height);
				drawFaces(fname);
			}
			else {
				console.log('RENDERER: ImageFaceHandling.faceEdit: NO  do not delete face box');
			}
		}
		else {
			console.log('RENDERER: ImageFaceHandling.faceEdit: Not a face');
		}
	} // faceEdit

	var addFaceBox = function(faceBox)
	{
		let fname = getFileName();
		console.log('RENDERER: ImageFaceHandling.addFaceBox new FaceBox :%s' , JSON.stringify(faceBox,null,'\t'));
		console.log('RENDERER: ImageFaceHandling.addFaceBox: fname :%s:' , fname);
    	let newFace = {
            'lastName'   : (faceBox['lastName'] != "") ? faceBox['lastName'] : ''
            ,'firstName' : (faceBox['firstName'] != "") ? faceBox['firstName'] : ''
            ,'height'    : Math.abs(faceBox['start_y'] - faceBox['end_y'])
            ,'width'     : Math.abs(faceBox['start_x'] - faceBox['end_x'])
            ,'startY'    : faceBox['start_y']
            ,'startX'    : faceBox['start_x']
      	};

		let faceData = AlbumData.getFaceList(fname);
      	let newFaceNum = AlbumData.addNewFaceData(fname,newFace);
		AlbumData.save();

      	FaceInfo.init(faceData);
		console.log('RENDERER: ImageFaceHandling.addFaceBox (292): Calling FaceInfo.openFaceInfo face = -1');
      	//FaceInfo.openFaceInfo(newFace,newFaceNum);
		console.log('RENDERER: ImageFaceHandling.addFaceBox new face list :%s',JSON.stringify( faceData ,null,'\t'));
		return newFaceNum;
	} //addFaceBox

	var drawFaceBox = function(color,width,box)
	{
		console.log('RENDERER: ImageFaceHandling.drawFaceBox color :%s:' ,color);
      	console.log('RENDERER: ImageFaceHandling.drawFaceBox box :%s',JSON.stringify( box ,null,'\t'));
		let ctx  = document.getElementById(IFH_CanvasElementID).getContext('2d');
		ctx.lineWidth = width;
		ctx.strokeStyle = color;

		ctx.beginPath();
		ctx.strokeRect(box.startX, box.startY, box.width, box.height);
		ctx.closePath();
	} //drawFaceBox

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
	,adjustFaceBox : adjustFaceBox
	,showPicture   : showPicture
	,faceEdit      : faceEdit
    ,addFaceBox    : addFaceBox
	,deleteFaceBox : deleteFaceBox
	,drawFaceBox   : drawFaceBox
	,highLightFace : highLightFace
	,FaceBoxBaseColor      : FaceBoxBaseColor 
	,FaceBoxHighLightColor : FaceBoxHighLightColor
	,FaceBoxBaseWidth      : FaceBoxBaseWidth
	,FaceBoxHighLightWidth : FaceBoxHighLightWidth
  };
})();
