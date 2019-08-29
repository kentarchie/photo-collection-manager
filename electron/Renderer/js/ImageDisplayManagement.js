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
	
   imgStatus(img)
	{
      let status = '';
      console.log('ImageDisplayManagement.imgStatus: Where (%s)',img.whereTaken);
      if(img.whereTaken == '') status += 'L';
      if(img.whenTaken == '') status += 'T';
      if(img.notes == '') status += 'N';
      return(status);
   } // imgStatus

   createImageList(listElement)
	{
      let iList = AlbumData.getImageList();
      console.log('ImageDisplayManagement.createImageList: number of images is :%d:',iList.length);
      let imgList = [];
      for(var img in iList) {
         logger('ImageDisplayManagement.createImageList adding (%s)',iList[img])
         imgList.push('<li data-filename="'+iList[img].name+'" data-path="'+iList[img].link+'">' + iList[img].name + ' (<span class="imgStatus">'+this.imgStatus(iList[img])+'</span>)</>');
      }
      document.getElementById(listElement).innerHTML = imgList.join('');
   } // createImageList

   pictureSelected(evt)
	{
      logger('ImageDisplayManagment.pictureSelected: evt.target.innerHTML:' + evt.target.innerHTML);
      //let imageName = evt.target.innerHTML.replace('/',''); // hack, remove this later
      let imageName = evt.target.dataset.filename;
      let filePath = evt.target.dataset.path;
      logger('ImageDisplayManagment.pictureSelected: filePath :' + filePath + ':')
      logger('ImageDisplayManagment.pictureSelected: imageName :' + imageName + ':')

      if (fsLib.statSync(filePath).isDirectory()) { // skip directories
         logger('ImageDisplayManagment.pictureSelected: : clicked on directory filePath = :'+filePath+':');
         return;
      }
      document.getElementById('pictureFileName').innerHTML = imageName;  // display the filename
		let imageTag = document.getElementById('IFH_ImageTag'); // where to display the image

      imageTag.addEventListener('load', function() {
         console.log('ImageDisplayManagement.pictureSelected: image object loaded this.src = :%s:', this.src);
         ImageFaceHandling.drawFaces(imageName);
		}); // load event

      imageTag.setAttribute('data-path', filePath);
      imageTag.setAttribute('data-filename', imageName);
      imageTag.setAttribute('src',filePath);
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
	} // nextPrevPicture

} // ImageDisplayManagement

module.exports = ImageDisplayManagement;
