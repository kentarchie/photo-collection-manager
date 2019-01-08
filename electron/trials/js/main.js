let ImageHandlingSettings = {
      wrapperID: 'pictureDisplay'
      ,albumName: 'TestAlbum'
		,lineWidth : 1
		,strokeStyle : '#FF0000'
};

$(document).ready(() => {
		var style = getComputedStyle(document.body);
		ImageHandlingSettings['displayBoxWidth'] = parseInt(style.getPropertyValue('--image-width').replace('px',''));
		ImageHandlingSettings['displayBoxHeight'] = parseInt(style.getPropertyValue('--image-height').replace('px',''));

		// set up the picture selector
		select = document.getElementById('choosePicture');
		for(f in Album_Data) {
				console.log('main.ready: image name = :%s: filename = :%s:', f,Album_Data[f]['filename']);
				var opt = document.createElement('option');
    			opt.value = f;
    			opt.innerHTML = f;
				select.appendChild(opt);
		}
		ImageFaceHandling.init(ImageHandlingSettings);
		ImageFaceHandling.showConfig();
		ImageFaceHandling.setup();

		$('#choosePicture').change(pictureSelected);
}); // on ready

function pictureSelected()
{
	let fname = $(this).val();
	var newImg = new Image();
	let filename = Album_Data[fname]['filename'];
	console.log('main.pictureSelected: fname = :%s: filename is :%s:',fname,filename);
	newImg.src=  ImageHandlingSettings.albumName + '/' + fname;
   newImg.onload = function() {
		ImageFaceHandling.showPicture(fname);
		console.log ('main.pictureSelected: The image natural size is %s(width) %s (height)',
			newImg.naturalWidth , newImg.naturalHeight);
		ImageFaceHandling.drawFaces(fname);
	} 
} // pictureSelected