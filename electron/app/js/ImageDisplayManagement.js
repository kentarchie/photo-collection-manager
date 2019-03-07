
class ImageDisplayManagement 
{
    constructor()
    {
        console.log('ImageDisplayManagement.constructor START ');
		this.DISPLAY_BOX_WIDTH = 450;
    	this.DISPLAY_BOX_HEIGHT = 450;
		this.LINE_WIDTH = 2;
		this.STROKE_STYLE = '#FF0000';
    	this.AlbumPath = '';
	} // constructor

    init(albumPath)
    {
        this.AlbumPath = albumPath;
        console.log('ImageDisplayManagement.init albumPath (%s)',albumPath);
		// the canvas and image must be in the same place and the same size
		let imageTag  = $('#IFH_ImageTag');
		let canvasTag = $('#IFH_CanvasTag');
		let imagePos = imageTag.offset();
        console.log('ImageDisplayManagement.init imagePos.top (%s) imagePos.left (%s)',imagePos.top,imagePos.left);
		imageTag.width(this.DISPLAY_BOX_WIDTH+'px');
		imageTag.height(this.DISPLAY_BOX_HEIGHT+'px');
		canvasTag.width  = this.DISPLAY_BOX_WIDTH+'px';
		canvasTag.height = this.DISPLAY_BOX_HEIGHT+'px';
		canvasTag.css('top',imagePos.top+'px');
		canvasTag.css('left', imagePos.left+'px');
		imageTag.css('top',imagePos.top+'px');
		imageTag.css('left', imagePos.left+'px');
        console.log('ImageDisplayManagement.init canvas.top (%s) canvas.left (%s)',canvasTag.css('top'),canvasTag.css('left'));
        console.log('ImageDisplayManagement.init image.top (%s) image.left (%s)',imageTag.css('top'),imageTag.css('left'));
    } // init

	// from https://stackoverflow.com/questions/55677/how-do-i-get-the-coordinates-of-a-mouse-click-on-a-canvas-element
	getClickPosition(evt,canvasElement)
	{
		let clickX,clickY;
		if (evt.pageX || evt.pageY) { 
			clickX = evt.pageX;
			clickY = evt.pageY;
			console.log('ImageDisplayManagement.getClickedPosition: using pageX,Y');
		}
		else { 
			clickX = evt.clientX + document.body.scrollLeft + document.documentElement.scrollLeft; 
			clickY = evt.clientY + document.body.scrollTop + document.documentElement.scrollTop; 
			console.log('ImageDisplayManagement.getClickedPosition: using clientX,Y');
		} 
		clickX -= canvasElement.offsetLeft;
		clickY -= canvasElement.offsetTop;
		console.log('ImageDisplayManagement.getClickedPosition: canvasElement.offsetLeft= %d canvasElement.offsetTop=%d',canvasElement.offsetLeft,  canvasElement.offsetTop);
		let newPos =  {
			x : clickX
			,y : clickY
		};
		console.log('ImageDisplayManagement.getClickedPosition: ' + JSON.stringify(newPos,null,'\t'));
		return newPos;
	} // getClickPosition

	// adjust the canvas size to match the image
	adjustCanvas(canvas,width,height) 
	{
		console.log('ImageDisplayManagement.adjustCanvas: width= %d height= %d', width,height);
		//$('.outsideWrapper').css('width',width);
		//$('.outsideWrapper').css('height',height);
		//canvas.width =  width + 'px';
		//canvas.height = height + 'px';
		//canvas.css('height',height+'px');
		//canvas.css('width',width+'px');
		canvas.attr('height',height+'px');
		canvas.attr('width',width+'px');
		console.log('ImageDisplayManagement.adjustCanvas: Canvas.id= %s ', canvas.id);
		console.log('ImageDisplayManagement.adjustCanvas: canvas.width= %s canvas.height= %s', canvas.width,canvas.height);
		//console.log('ImageDisplayManagement.adjustCanvas: Canvas.top= %d Canvas.left= %d', canvas.css('top'),canvas.left);
	} // adjustCanvas

	adjustFaceBox(boxSpec,deltaWidth,deltaHeight)
	{
		let result = {};
		result['startX'] = Math.floor(deltaWidth  * boxSpec.startX);
		result['startY'] = Math.floor(deltaHeight * boxSpec.startY);
		result['width']  = Math.floor(deltaWidth  * boxSpec.width);
		result['height'] = Math.floor(deltaHeight * boxSpec.height);
		return result;
	} // adjustFaceBox

	drawImage(picFileName,chosenImage)
	{
		const canvas = $('#IFH_CanvasTag').get(0);
		const Jcanvas = $('#IFH_CanvasTag');
		const ctx = canvas.getContext('2d');

		const faceData = Album_Data['images'][picFileName]['faces']['faceList']
		console.log('ImageDisplayManagement.drawImage.setup: Canvas.tagName = %s id=%s', Jcanvas.prop("tagName"), Jcanvas.prop("id"));
		console.log('ImageDisplayManagement.drawImage.setup: Canvas.width= %d Canvas.height= %d', canvas.width,canvas.height);
		console.log('ImageDisplayManagement.drawImage.setup: Canvas.top= %s Canvas.left= %s', Jcanvas.css('top'),Jcanvas.css('left'));
		console.log ('ImageDisplayManagement.drawImage.setup The canvas left offset %f  top offset %f',Jcanvas.offset().left,Jcanvas.offset().top);

		console.log('ImageDisplayManagement.drawImage: code start ');
				//var rect = canvas.getBoundingClientRect();
				//console.log('ImageDisplayManagement.drawImage.canvas boundingbox BEFORE %s',JSON.stringify(rect,null,'\t'));
				//rect = chosenImage.getBoundingClientRect();
				//console.log('ImageDisplayManagement.drawImage.chosenImage boundingbox BEFORE %s',JSON.stringify(rect,null,'\t'));

		console.log ('ImageDisplayManagement.drawImage: DISPLAY values  %d (width),%d (height)',this.DISPLAY_BOX_WIDTH,this.DISPLAY_BOX_HEIGHT);
		let height = chosenImage.naturalHeight;
		let width = chosenImage.naturalWidth;
		console.log ('ImageDisplayManagement.drawImage: The image natural size is %d(width) * %d(height)',width,height);
		//this.adjustCanvas(canvas,this.DISPLAY_BOX_WIDTH,this.DISPLAY_BOX_HEIGHT);
				//rect = canvas.getBoundingClientRect();
				//console.log('ImageDisplayManagement.drawImage.canvas boundingbox AFTER %s',JSON.stringify(rect,null,'\t'));
				//console.log('ImageDisplayManagement.drawImage: Canvas.top= %d Canvas.left= %d', canvas.css('top'),canvas.css('left'));
		let deltaWidth = this.DISPLAY_BOX_WIDTH / width;
		let deltaHeight = this.DISPLAY_BOX_HEIGHT / height;
		Album_Data['images'][picFileName]['deltaWidth'] = deltaWidth;
		Album_Data['images'][picFileName]['deltaHeight'] = deltaHeight;
		console.log ('ImageDisplayManagement.onload: The delta size is %f * %f',deltaWidth,deltaHeight);

		ctx.strokeStyle = '#0000FF';
		ctx.lineWidth = 2;
		ctx.beginPath();
		ctx.strokeRect(0, 0, 235, 142);
		ctx.closePath();

		faceData.forEach((fd, i) => {
			console.log('ImageDisplayManagement.drawImage ' + JSON.stringify(fd,null,'\t'));
			let newFaceBox = this.adjustFaceBox(fd,deltaWidth,deltaHeight);
			console.log('ImageDisplayManagement.newFaceBox = ' + JSON.stringify(newFaceBox,null,'\t'));
			// draw rectangle
			ctx.lineWidth = this.LINE_WIDTH;
			ctx.strokeStyle = this.STROKE_STYLE;
			ctx.beginPath();
			ctx.strokeRect(newFaceBox.startX, newFaceBox.startY, newFaceBox.width, newFaceBox.height);
			ctx.closePath();
		});
		console.log('ImageDisplayManagement.drawImage: boxes drawn');
	} // drawImage

    pictureSelected(imageName)
	{
		console.log('ImageDisplayManagement.pictureSelected: START imageName = :%s: ',imageName);
		let that=this;
        let imagePath = this.AlbumPath + '/' + imageName;
        let filename = Album_Data['images'][imageName].filename;
        console.log('ImageDisplayManagement.pictureSelected: filename is :%s: imagePath = :%s:',filename,imagePath);
		let imageTag = $('#IFH_ImageTag'); // where to display the image

        imageTag.on('load', function() {
            console.log('ImageDisplayManagement.pictureSelected: image object loaded');
			console.log('ImageDisplayManagement.pictureSelected: this.src = :%s:', this.src);
          	let height = this.naturalHeight;
      		let width = this.naturalWidth;
      		console.log ('ImageDisplayManagement.pictureSelected: The image natural size is %d(width) %d(height)',width,height);
			//imageTag.attr('src',this.src);
			//imageTag.src = this;
			//console.log('ImageDisplayManagement.pictureSelected: imageTag src after attr set = :%s:', imageTag.attr('src'));
			that.drawImage(imageName,this);
		}); // onload

        imageTag.attr('filename', filename);
        imageTag.css('width',this.DISPLAY_BOX_WIDTH+'px');
        imageTag.css('height',this.DISPLAY_BOX_HEIGHT+'px');
		console.log('ImageDisplayManagement.pictureSelected: imageTag width = :%s: height = :%s:' ,this.DISPLAY_BOX_WIDTH,this.DISPLAY_BOX_HEIGHT);

        console.log('ImageDisplayManagement.pictureSelected: imageTag src before = :%s:', imageTag.src);
        console.log('ImageDisplayManagement.pictureSelected: imageTag attr src before = :%s:', imageTag.attr('src'));
        imageTag.src = filename;
        imageTag.attr('src',filename);
        console.log('ImageDisplayManagement.pictureSelected: imageTag src after = :%s:', imageTag.src);
        console.log('ImageDisplayManagement.pictureSelected: imageTag attr src after = :%s:', imageTag.attr('src'));
        //var newImg = new Image();
        //console.log('ImageDisplayManagement.pictureSelected: after image object creation');
        //newImg.src= filename;
        //console.log('ImageDisplayManagement.pictureSelected: image src set');
        //imageTag.src = newImg.src;
        //console.log('ImageDisplayManagement.pictureSelected: imageTag src after copy = :%s:', imageTag.attr('src'));

	} // pictureSelected

} // ImageDisplayManagement

module.exports = ImageDisplayManagement;