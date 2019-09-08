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

	var init = function(fd)
	{
      logger('FaceInfo.init: START');
		document.getElementById('FaceInfoBlackout').addEventListener('click', closeNoChange);
		document.getElementById('FaceInfoClose').addEventListener('click', closeNoChange);
		document.getElementById('DeleteFaceBox').addEventListener('click',deleteFaceBox);
   } // init

	var setFaceBox = function(fd)
	{
      logger('FaceInfo.init: START');
      faceData = fd;
   } // setFaceBox

	var openFaceInfo = function(faceData)
	{
		logger('FaceInfo.openFaceInfo: Start');
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
