class ImageDisplayManagement 
{
   constructor()
   {
		console.log('RENDERER: ImageDisplayManagement.constructor START ');
		this.DISPLAY_BOX_WIDTH = 450;
    	this.DISPLAY_BOX_HEIGHT = 450;
		this.LINE_WIDTH = 2;
		this.STROKE_STYLE = ImageFaceHandling.FaceBoxBaseColor
    	this.AlbumPath = '';
    	this.FileList = []
      this.CurrentPicture = '';
   } // constructor

   init(albumPath)
   {
      this.AlbumPath = albumPath;
      this.FileList = AlbumData.getImageList();
      console.log('RENDERER: ImageDisplayManagement.init albumPath (%s)',albumPath);
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
      console.log('RENDERER: ImageDisplayManagement.init canvas.top (%s) canvas.left (%s)',canvasTag.css('top'),canvasTag.css('left'));
      console.log('RENDERER: ImageDisplayManagement.init image.top (%s) image.left (%s)',imageTag.css('top'),imageTag.css('left'));
   } // init
	
   imgStatus(img)
	{
      let status = '';
      console.log('RENDERER: ImageDisplayManagement.imgStatus: Where (%s)',img.whereTaken);
      if(img.whereTaken == '') status += 'L';
      if(img.whenTaken == '') status += 'T';
      if(img.notes == '') status += 'N';
      return(status);
   } // imgStatus

   createImageList(listElement)
	{
      let iList = AlbumData.getImageList();
      console.log('RENDERER: ImageDisplayManagement.createImageList: number of images is :%d:',iList.length);
      let imgList = [];
      for(var img in iList) {
         console.log('RENDERER: ImageDisplayManagement.createImageList adding (%s)',iList[img])
         imgList.push('<li data-filename="'+iList[img].name+'" data-path="'+iList[img].link+'">' + iList[img].name + ' (<span class="imgStatus">'+this.imgStatus(iList[img])+'</span>)</>');
      }
      document.getElementById(listElement).innerHTML = imgList.join('');
   } // createImageList

   switchPicture(chosenElement)
	{
      console.log('RENDERER: ImageDisplayManagment.switchPicture: chosenElement.innerHTML= :%s:',chosenElement.innerHTML);
      if (chosenElement.tagName.toLowerCase() != 'li') return;
      let fileName = chosenElement.dataset.filename;
      let filePath = chosenElement.dataset.path;
      console.log('RENDERER: ImageDisplayManagment.switchPicture: fileName :%s:',fileName)
      console.log('RENDERER: ImageDisplayManagment.switchPicture: filePath :%s:',filePath)

      document.getElementById('pictureFileName').innerHTML = fileName;  // display the filename
		let imageTag = document.getElementById('IFH_ImageTag'); // where to display the image

      imageTag.addEventListener('load', () => {
         console.log('RENDERER: ImageDisplayManagement.switchPicture: image object loaded this.src = :%s:', this.src);
         ImageFaceHandling.drawFaces(fileName);
		}); // load event

      imageTag.setAttribute('data-path', filePath);
      imageTag.setAttribute('data-filename', fileName);
      imageTag.setAttribute('src',filePath);

      let imageData = AlbumData.getImageData(fileName);
      document.getElementById('whenTaken').value = imageData['whenTaken'];
      document.getElementById('whereTaken').value = imageData['whereTaken'];
      document.getElementById('notes').innerHTML = imageData['notes'];
	} // switchPicture

   pictureSelected(evt)
	{
      console.log('RENDERER: ImageDisplayManagment.pictureSelected: evt.target.innerHTML = :%s:',evt.target.innerHTML);
      console.log('RENDERER: ImageDisplayManagment.pictureSelected: evt.target.tagName = :%s:',evt.target.tagName);
      this.switchPicture(evt.target);
	} // pictureSelected


	findPicture(picture)
	{
    	console.log('RENDERER: ImageDisplayManagement.findPicture: picture = :%s:',picture);
    	return(this.FileList.indexOf(picture));
	} // findPicture

	nextPrevPicture(evt)
	{
		let id = evt.target.id;
    	console.log('RENDERER: ImageDisplayManagement.nextPrevPicture: START button id = %s' , id);
    	if(this.CurrentPicture == '') this.CurrentPicture = this.FileList[0];
    	let index = this.findPicture(this.CurrentPicture);
    	console.log('RENDERER: ImageDisplayManagement.nextPrevPicture: initial index= %d' , index);
    	index = (id.startsWith('prev')) ? index -1 : index +1;
    	if(index <= 0) index = this.FileList.length-1;
    	if(index >= this.FileList.length) index = 0;
		console.log('RENDERER: ImageDisplayManagement.nextPrevPicture: final index= %d' , index);

    	let path = AlbumPath + '/' + this.FileList[index];
    	console.log('RENDERER: ImageDisplayManagement.nextPrevPicture: path= %s' , path);
    	this.CurrentPicture = this.FileList[index];
		this.switchPicture(this.CurrentPicture);
	} // nextPrevPicture

} // ImageDisplayManagement

module.exports = ImageDisplayManagement;