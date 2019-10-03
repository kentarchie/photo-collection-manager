var FaceInfo = (function () {

   var faceData = {};

	var closeNoChange = function(evt)
	{
		console.log('RENDERER: FaceInfo.closeNoChange: START');
		document.getElementById('FaceInfo').style.display='none';
		document.getElementById('FaceInfoBlackout').style.display='none';
	} // closeNoChange

	var closeSave = function(evt)
	{
      console.log('RENDERER: FaceInfo.closeSave: START');
      faceData.firstName = document.getElementById('FaceInfoFirstName').value;
      faceData.lastName = document.getElementById('FaceInfoSecondName').value;
      closeNoChange();
	} // closeSave

	var deleteFaceBox = function(evt)
	{
       ImageFaceHandling.deleteFaceBox(evt);
	} // deleteFaceBox

	var init = function()
	{
		console.log('RENDERER: FaceInfo.init: START');
		document.getElementById('FaceInfoBlackout').addEventListener('click', closeNoChange);
		document.getElementById('FaceInfoClose').addEventListener('click', closeNoChange);
		document.getElementById('DeleteFaceBox').addEventListener('click',deleteFaceBox);
		document.getElementById('FaceInfoSave').addEventListener('click',faceInfoSave);
   } // init

	var faceInfoSave = function(evt)
	{
		console.log('RENDERER: FaceInfo.faceInfoSave: START');
		let face = getFaceInfo();
		console.log('FaceInfo.faceInfoSave: face = :%s:',JSON.stringify(face,null,'\t'));
		let fName = document.getElementById('pictureFileName').innerHTML;
		console.log('RENDERER: FaceInfo.faceInfoSave: fName = :%s:',fName);
		let faceNumber = parseInt(document.getElementById('FaceInfo').dataset.faceNumber);
		console.log('RENDERER: FaceInfo.faceInfoSave: faceNumber = int(%d) string(%s)',faceNumber,faceNumber);
    	AlbumData.updateFaceData(fName,faceNumber,face['firstName'],face['lastName']);
    	AlbumData.save();
		closeNoChange();
	}  // faceInfoSave

	var getFaceInfo = function()
	{
       faceData['firstName'] = document.getElementById('FaceInfoFirstName').value;
       faceData['lastName']  = document.getElementById('FaceInfoSecondName').value;
       return faceData;
	}  // getFaceInfo

	var openFaceInfo = function(fd,faceNumber)
	{
		console.log('RENDERER: FaceInfo.openFaceInfo: START: first name = :%s: last name = :%s: faceNumber = :%d:',fd.firstName,fd.lastName,faceNumber);
      	faceData = fd;
		document.getElementById('FaceInfoFirstName').value = faceData.firstName;
		document.getElementById('FaceInfoSecondName').value = faceData.lastName;
		document.getElementById('FaceInfo').style.display='block';
   		document.getElementById('FaceInfoBlackout').style.display='block';
		document.getElementById('FaceInfo').dataset.faceNumber = faceNumber;
	}  // openFaceInfo

   return {
	 init: init
	 ,openFaceInfo  : openFaceInfo
	 ,closeNoChange : closeNoChange
	 ,closeSave     : closeSave
  };
})();