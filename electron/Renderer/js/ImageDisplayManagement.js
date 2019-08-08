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
    	this.FileList = []
	} // constructor

    init(albumPath)
    {
      this.AlbumPath = albumPath;
      console.log('ImageDisplayManagement.init albumPath (%s)',albumPath);
		// the canvas and image must be in the same place and the same size
		let imageTag  = $('#IFH_ImageTag');
		let canvasTag = $('#IFH_CanvasTag');
		imageTag.width(this.DISPLAY_BOX_WIDTH+'px');
		imageTag.height(this.DISPLAY_BOX_HEIGHT+'px');
		canvasTag.width(this.DISPLAY_BOX_WIDTH+'px');
		canvasTag.height(this.DISPLAY_BOX_HEIGHT+'px');
		// put the canvas on top of the image
		canvasTag.position({ 
  			my: "left top",
  			at: "left top",
  			of: "#IFH_ImageTag"
		});
      console.log('ImageDisplayManagement.init canvas.top (%s) canvas.left (%s)',canvasTag.css('top'),canvasTag.css('left'));
      console.log('ImageDisplayManagement.init image.top (%s) image.left (%s)',imageTag.css('top'),imageTag.css('left'));
	} // init
	
	setFileList(fileList)
	{
      console.log('ImageDisplayManagement.setFileList fileList length (%d)',fileList.length);
		this.FileList = fileList;
      console.log('ImageDisplayManagement.setFileList this.FileList length (%d)',this.FileList.length);
	}

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
		const ctx = canvas.getContext('2d');
		console.log('ImageDisplayManagement.drawImage: picFileName= %s', picFileName);
      console.log('ImageDisplayManagement.drawImage this.FileList length (%d)',this.FileList.length);

		const faceData = Album_Data['images'][picFileName]['faces']['faceList']

		let height = chosenImage.naturalHeight;
		let width = chosenImage.naturalWidth;
		console.log ('ImageDisplayManagement.drawImage: The image natural size is %d(width) * %d(height)',width,height);
		let deltaWidth = this.DISPLAY_BOX_WIDTH / width;
		let deltaHeight = this.DISPLAY_BOX_HEIGHT / height;
		console.log ('ImageDisplayManagement.onload: The delta size is %f * %f',deltaWidth,deltaHeight);

		ctx.clearRect(0, 0, canvas.width, canvas.height);
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

   pictureSelected(imageName,fullPath)
	{
		console.log('ImageDisplayManagement.pictureSelected: START imageName = :%s: ',imageName);
      console.log('ImageDisplayManagement.pictureSelected this.FileList length (%d)',this.FileList.length);
      $('#pictureFileName').html(imageName);
		let that=this;
      let filename = Album_Data['images'][imageName].filename;
		let imageTag = $('#IFH_ImageTag'); // where to display the image

      imageTag.on('load', function() {
         console.log('ImageDisplayManagement.pictureSelected: image object loaded this.src = :%s:', this.src);
			that.drawImage(imageName,this);
		}); // onload

      imageTag.attr('filename', fullPath);
      imageTag.attr('src',fullPath);
	} // pictureSelected

	findPicture(picture)
	{
    	console.log('ImageDisplayManagement.findPicture: START ');
    	return(this.FileList.indexOf(picture));
	} // findPicture

	nextPrevPicture(evt)
	{
		let id = evt.target.id;
    	console.log('ImageDisplayManagement.nextPrevPicture: START button id = %s' , id);
    	let index = this.findPicture(CurrentPicture);
    	console.log('ImageDisplayManagement.nextPrevPicture: initial index= %d' , index);
    	index = (id.startsWith('prev')) ? index -1 : index +1;
    	if(index <= 0) index = this.FileList.length-1;
    	if(index >= this.FileList.length) index = 0;
		console.log('ImageDisplayManagement.nextPrevPicture: final index= %d' , index);

    	let path = AlbumPath + '/' + this.FileList[index];
    	console.log('ImageDisplayManagement.nextPrevPicture: path= %s' , path);
    	CurrentPicture = this.FileList[index];
		this.pictureSelected(CurrentPicture);
    	this.drawImage(CurrentPicture,$('#IFH_ImageTag'));
	} // nextPrevPicture

} // ImageDisplayManagement

module.exports = ImageDisplayManagement;
