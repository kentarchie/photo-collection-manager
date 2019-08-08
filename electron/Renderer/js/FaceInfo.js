var FaceInfo = (function () {

   var faceData = {};
	var init = function(fd)
	{
      logger('FaceInfo.init: START');
		document.getElementById('FaceInfoBlackout').addEventListener('click', (e) => { closeNoSave();})
		document.getElementById('FaceInfoClose').addEventListener('click', (e) => { closeNoSave();})
		document.getElementById('DeleteFaceBox').addEventListener('click',(e) => { deleteFaceBox(e);});
   } // init

	var setFaceBox = function(fd)
	{
      logger('FaceInfo.init: START');
      faceData = fd;
   } // setFaceBox

	var openFaceInfo = function()
	{
		logger('FaceInfo.openFaceInfo: Start');
		console.log('FaceInfo. openFaceInfo: first name = :%s: last name = :%s:',faceData.firstName,faceData.lastName);
		document.getElementById('FaceInfoFirstName').value = faceData.firstName;
		document.getElementById('FaceInfoSecondName').value = faceData.lastName;
		document.getElementById('FaceInfo').style.display='block';
   	document.getElementById('FaceInfoBlackout').style.display='block';
	}  // openFaceInfo


	var closeNoChange = function()
	{
		document.getElementById('FaceInfo').style.display='none';
		document.getElementById('FaceInfoBlackout').style.display='none';
	} // closeNoChange

	var closeSave = function()
	{
      faceData.firstName = document.getElementById('FaceInfoFirstName').value;
      faceData.lastName = document.getElementById('FaceInfoSecondName').value;
      closeNoChange();
	} // closeSave

   return {
	 init: init
	 ,openFaceInfo  : openFaceInfo
	 ,closeNoChange : closeNoChange
	 ,closeSave : closeSave
  };
})();
