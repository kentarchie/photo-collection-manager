var FaceInfo = (function () {

   var faceData = {};

	var closeNoChange = function(evt)
	{
		document.getElementById('FaceInfo').style.display='none';
		document.getElementById('FaceInfoBlackout').style.display='none';
	} // closeNoChange

	var closeSave = function(evt)
	{
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
      logger('FaceInfo.init: START');
		document.getElementById('FaceInfoBlackout').addEventListener('click', closeNoChange);
		document.getElementById('FaceInfoClose').addEventListener('click', closeNoChange);
		document.getElementById('DeleteFaceBox').addEventListener('click',deleteFaceBox);
		document.getElementById('FaceInfoSave').addEventListener('click',faceInfoSave);
   } // init

	var faceInfoSave = function(evt)
	{
       let face = getFaceInfo();
       let fName = document.getElementById('pictureFileName').innerHTML;
       AlbumData.addFaceData(fName,face);
       AlbumData.save();
	}  // faceInfoSave

	var getFaceInfo = function()
	{
       faceData['firstName'] = document.getElementById('FaceInfoFirstName').value;
       faceData['lastName']  = document.getElementById('FaceInfoSecondName').value;
       return faceData;
	}  // getFaceInfo

	var openFaceInfo = function(fd)
	{
		logger('FaceInfo.openFaceInfo: Start');
      faceData = fd;
		console.log('FaceInfo. openFaceInfo: first name = :%s: last name = :%s:',faceData.firstName,faceData.lastName);
		document.getElementById('FaceInfoFirstName').value = faceData.firstName;
		document.getElementById('FaceInfoSecondName').value = faceData.lastName;
		document.getElementById('FaceInfo').style.display='block';
   	document.getElementById('FaceInfoBlackout').style.display='block';
	}  // openFaceInfo

   return {
	 init: init
	 ,openFaceInfo  : openFaceInfo
	 ,closeNoChange : closeNoChange
	 ,closeSave     : closeSave
  };
})();
