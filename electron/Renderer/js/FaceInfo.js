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
		document.getElementById('IFH_SaveChanges').addEventListener('click',faceInfoSave);
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
		let faceData = AlbumData.getFaceList(fName);
		let newFaceBox = ImageFaceHandling.adjustFaceBox(faceData[faceNumber]);
		ImageFaceHandling.drawFaceBox(
			ImageFaceHandling.FaceBoxBaseColor // line color
			,ImageFaceHandling.FaceBoxBaseWidth // line width
			,newFaceBox);
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

	var clearWhoList = function()
	{
		const myNode = document.getElementById("whoList");
		while (myNode.firstChild) {
	  		myNode.removeChild(myNode.firstChild);
		}
	} // clearWhoList

	var displayFaceData = function(faceNumber, firstName, secondName)
	{
   		console.log('RENDERER: FaceInfo.displayFaceData: START face number = :%s:',faceNumber);
		let fName = document.getElementById('pictureFileName').innerHTML;

		let el = document.createElement('li');  // wrapper
		var fnum = faceNumber;
		el.dataset.faceNumber = faceNumber;
		el.dataset.fName = fName;
		console.log('RENDERER: FaceInfo.displayFaceData: fName = :%s: faceNumber=:%d:',fName,faceNumber);
		el.className = 'FaceInfoBlock';

		let first = document.createElement('span');
		first.innerText = firstName;
		let second = document.createElement('span');
		second.innerText = secondName;

		[first,second].map(el => 
		{
			el.dataset.faceNumber = fnum;
			el.dataset.fName = fName;

      		el.addEventListener('click', function(evt) {
				evt.preventDefault();
				let faceNumber = evt.target.dataset.faceNumber;
				let fName = evt.target.dataset.fName;
   				console.log('RENDERER: FaceInfo.displayFaceData: el click target content = :%s:',evt.target.innerHTML);
   				console.log('RENDERER: FaceInfo.displayFaceData: el click face number = :%s:',evt.target.dataset.faceNumber);
				evt.target.setAttribute('contenteditable',true);
				ImageFaceHandling.highLightFace(fName,faceNumber);
      		});
      		el.addEventListener('blur', function(evt) {
         		evt.preventDefault();
				console.log('RENDERER: FaceInfo.displayFaceData: el blur');
        		evt.target.setAttribute('contenteditable',false);
			});
		})

		el.appendChild(first);
		el.appendChild(second);
		document.getElementById('whoList').append(el);
	} // displayFaceData

	var faceSelected = function(fd,faceNumber)
	{
		console.log('RENDERER: FaceInfo.faceSelected: START: first name = :%s: last name = :%s: faceNumber = :%d:',fd.firstName,fd.lastName,faceNumber);
      	faceData = fd;
		let whoList = document.getElementById('whoList');
		var faceList = whoList.querySelectorAll('li');
   		console.log('RENDERER: FaceInfo.faceSelected: faceList.length = :%d:',faceList.length);
		//var chosenFace = whoList.querySelector('[data-face-number="'+faceNumber+'"]');

		faceList.forEach((item) =>  {
   			///console.log('RENDERER: FaceInfo.faceSelected: f= :%s:',JSON.stringify(f,null,'\t'));
   			console.log('RENDERER: FaceInfo.faceSelected: item.classList = :%s:',item.classList);
			item.classList.remove('highlightWhoList');
			if(item.dataset.faceNumber == faceNumber)
				item.classList.add('highlightWhoList');
		});
	} // faceSelected


   return {
	 init: init
	 ,openFaceInfo    : openFaceInfo
	 ,faceSelected    : faceSelected
	 ,closeNoChange   : closeNoChange
	 ,closeSave       : closeSave
	 ,displayFaceData : displayFaceData
	 ,clearWhoList    : clearWhoList
  };
})();

/*
   let faceInfoList = document.querySelectorAll('FaceInfoBlock');
   console.log('RENDERER: PhotoCollectionManager.setupEventHandlers: faceInfoList.length :%d',faceInfoList.length);
   for (const faceData of faceInfoList) {
      faceData.addEventListener('dblclick', function(evt) {
         evt.preventDefault();
        evt.target.setAttribute('contentEditable',true);
      })
   }
   */
