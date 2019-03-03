
const electron = require('electron');

class ImageDisplayManagement 
{
	LINE_WIDTH = 2;
	STROKE_STYLE = '#FF0000';
	DISPLAY_BOX_WIDTH = 450;
    DISPLAY_BOX_HEIGHT = 450;
    AlbumPath = '';

    constructor(albumPath)
    {
        this.AlbumPath = albumPath;
        console.log('ImageDisplayManagement.constructor START  albumPath (%s)',albumPath);
    } // constructor

    pictureSelected(imageName)
	{
        let imagePath = this.AlbumPath + '/' + imageName;
        let filename = Album_Data[imageName].filename;
        console.log('imageDisplay.pictureSelected: filename is :%s: imageName = :%s: imagePath = :%s:',filename,imageName,imagePath);
        let testImage = $('#imageTag');
        //let testImage = document.getElementById('imageTag');
        console.log('imageDisplay.pictureSelected: testImage src before = :%s:', testImage.src);
        console.log('imageDisplay.pictureSelected: testImage attr src before = :%s:', testImage.attr('src'));
        testImage.attr('filename', filename);
        testImage.css('width',DISPLAY_BOX_WIDTH+'px');
        testImage.css('height',DISPLAY_BOX_HEIGHT+'px');
        testImage.attr('src',imagePath);
        testImage.src = filename;
        console.log('imageDisplay.pictureSelected: testImage src = :%s:', testImage.attr('src'));
        var newImg = new Image();
        console.log('imageDisplay.pictureSelected: after image object creation');
        newImg.src= filename;
        console.log('imageDisplay.pictureSelected: image src set');
        testImage.src = newImg.src;
        console.log('imageDisplay.pictureSelected: testImage src after copy = :%s:', testImage.attr('src'));

        newImg.onload = function() {
            console.log('imageDisplay.pictureSelected: image object loaded');
			console.log('imageDisplay.pictureSelected: newImg.src = :%s:', this.src);
          	let height = this.naturalHeight;
      		let width = this.naturalWidth;
      		console.log ('imageDisplay.pictureSelected: The image natural size is %d(width) %d(height)',width,height);
			testImage.attr('src',this.src);
			testImage.src = this;
			console.log('imageDisplay.pictureSelected: testImage src after attr set = :%s:', testImage.attr('src'));
			run(imageName,this);
        } // onload
	} // pictureSelected
} // ImageDisplayManagement

// from https://stackoverflow.com/questions/55677/how-do-i-get-the-coordinates-of-a-mouse-click-on-a-canvas-element
function getClickPosition(evt,canvasElement)
{
    let clickX,clickY;
	if (evt.pageX || evt.pageY) { 
  		clickX = evt.pageX;
  		clickY = evt.pageY;
		console.log('imageDisplay.getClickedPosition: using pageX,Y');
	}
	else { 
  		clickX = evt.clientX + document.body.scrollLeft + document.documentElement.scrollLeft; 
  		clickY = evt.clientY + document.body.scrollTop + document.documentElement.scrollTop; 
		console.log('imageDisplay.getClickedPosition: using clientX,Y');
	} 
	clickX -= canvasElement.offsetLeft;
	clickY -= canvasElement.offsetTop;
	console.log('imageDisplay.getClickedPosition: canvasElement.offsetLeft= %d canvasElement.offsetTop=%d',canvasElement.offsetLeft,  canvasElement.offsetTop);
	let newPos =  {
		x : clickX
		,y : clickY
	};
	console.log('imageDisplay.getClickedPosition: ' + JSON.stringify(newPos,null,'\t'));
	return newPos;
} // getClickPosition

module.exports = ImageDisplayManagement;