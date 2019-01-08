
		const LINE_WIDTH = 2;
		const STROKE_STYLE = '#FF0000';
		let DISPLAY_BOX_WIDTH = 450;
		let DISPLAY_BOX_HEIGHT = 450;

		function pictureSelected()
		{
			let fname = $(this).val();
			let imagePath = 'TestAlbum/' + fname;
			let filename = Album_Data[fname].filename;
			console.log('pictureSelected: filename is :%s: fname = :%s: imagePath = :%s:',filename,fname,imagePath);
         let testImage = $('#imageTag');
         //let testImage = document.getElementById('imageTag');
			console.log('pictureSelected: testImage src before = :%s:', testImage.src);
			console.log('pictureSelected: testImage attr src before = :%s:', testImage.attr('src'));
			testImage.attr('filename', fname);
         testImage.css('width',DISPLAY_BOX_WIDTH+'px');
         testImage.css('height',DISPLAY_BOX_HEIGHT+'px');
			testImage.attr('src',imagePath);
			testImage.src = imagePath;
			console.log('pictureSelected: testImage src = :%s:', testImage.attr('src'));
			var newImg = new Image();
      	console.log('pictureSelected: after image object creation');
			newImg.src= imagePath;
        	console.log('pictureSelected: image src set');
			testImage.src = newImg.src;
			console.log('pictureSelected: testImage src after copy = :%s:', testImage.attr('src'));
    		newImg.onload = function() {
        		console.log('pictureSelected: image object loaded');
				console.log('pictureSelected: newImg.src = :%s:', this.src);
          	let height = this.naturalHeight;
      		let width = this.naturalWidth;
      		console.log ('pictureSelected: The image natural size is %d(width) %d(height)',width,height);
				testImage.attr('src',this.src);
				testImage.src = this;
				console.log('pictureSelected: testImage src after attr set = :%s:', testImage.attr('src'));
				run(fname,this);
        	}
		} // pictureSelected
		
		// from https://stackoverflow.com/questions/55677/how-do-i-get-the-coordinates-of-a-mouse-click-on-a-canvas-element
		function getClickPosition(evt,canvasElement)
		{
			let clickX,clickY;
			if (evt.pageX || evt.pageY) { 
  				clickX = evt.pageX;
  				clickY = evt.pageY;
				console.log('getClickedPosition: using pageX,Y');
			}
			else { 
  				clickX = evt.clientX + document.body.scrollLeft + document.documentElement.scrollLeft; 
  				clickY = evt.clientY + document.body.scrollTop + document.documentElement.scrollTop; 
				console.log('getClickedPosition: using clientX,Y');
			} 
			clickX -= canvasElement.offsetLeft;
			clickY -= canvasElement.offsetTop;
			console.log('getClickedPosition: canvasElement.offsetLeft= %d canvasElement.offsetTop=%d',canvasElement.offsetLeft,  canvasElement.offsetTop);
			let newPos =  {
					x : clickX
				  ,y : clickY
			};
			console.log('getClickedPosition: ' + JSON.stringify(newPos,null,'\t'));
			return newPos;
		} // getClickPosition

		$(document).ready(() => {
			var style = getComputedStyle(document.body);
			DISPLAY_BOX_WIDTH = parseInt(style.getPropertyValue('--image-width').replace('px',''));
			DISPLAY_BOX_HEIGHT = parseInt(style.getPropertyValue('--image-height').replace('px',''));
			console.log('DISPLAY_BOX_WIDTH:  = '+DISPLAY_BOX_WIDTH);

			// set up the picture selector
			let select = document.getElementById('choosePicture');
			for(f in Album_Data) {
				console.log('image name = :%s: filename = :%s:',f,Album_Data[f]['filename']);
				var opt = document.createElement('option');
    			opt.value = f;
    			opt.innerHTML = f;
				select.appendChild(opt);
			}
			console.log('ready: after select setup');
			$('#choosePicture').change(pictureSelected);
			$('#overlay').click(onImageClick );
			$('#overlay').dblclick(onImageDoubleClick );
		}); // on ready

		// rect is the boundingBox of the canvas
		function isFaceClicked(picFileName, pos,rect)
		{
			console.log('faceClicked: x=%d y=%d' , pos.x,pos.y);
			let faceData = Album_Data[picFileName]['faces']['faceList'];
			let result = -1;
			let xOffSet = rect.left, yOffSet = rect.top;
			faceData.forEach((fd, i) => {
				console.log('isFaceClicked: i = '+i);
				let deltaWidth = Album_Data[picFileName]['deltaWidth'];
				let deltaHeight = Album_Data[picFileName]['deltaHeight'];
				let newPosX = (pos.x/deltaWidth);
				let newPosY = (pos.y/deltaHeight);
				//newPosX = pos.x + rect.left;
				//newPosY = pos.y + rect.top;
				let newFaceBox = adjustFaceBox(fd,deltaWidth,deltaHeight);
				let faceBoxXMax =  (newFaceBox.startX + xOffSet)+newFaceBox.width+(2*LINE_WIDTH);
				let faceBoxYMax =  (newFaceBox.startY + yOffSet)+newFaceBox.height+(2*LINE_WIDTH);
				console.log('isFaceClicked: pos.x= %d newFaceBox.startX=%d',pos.x,  newFaceBox.startX);
				console.log('isFaceClicked: pos.y= %d newFaceBox.startY=%d',pos.y,  newFaceBox.startY);
				console.log('isFaceClicked: newFaceBox.height= %d newFaceBox.width=%d',newFaceBox.height,  newFaceBox.width);
				console.log('isFaceClicked: faceBoxXMax= %d faceBoxYMax=%d',faceBoxXMax,  faceBoxYMax);
				console.log('isFaceClicked: newPosX= %d newPosY=%d',newPosX,  newPosY);
				console.log('isFaceClicked: xOffSet= %d yOffSet=%d',xOffSet,  yOffSet);
				console.log('isFaceClicked: rect %d,%d,%d,%d',rect.top, rect.right, rect.bottom, rect.left);
				if(
					(pos.x >= (newFaceBox.startX + xOffSet)) && (pos.x < faceBoxXMax)
					 && (pos.y >= (newFaceBox.startY + yOffSet)) && (pos.y < faceBoxYMax)
				  )
				  {
						 console.log('isFaceClicked: clicked in face');
						 result = i;
						 return;
					 }
					 else {
						 console.log('isFaceClicked: NOT clicked in face');
					 }
				})
			return result;
		} // isFaceClicked

		function adjustCanvas(canvas,width,height) 
		{
			console.log('adjustCanvas: width= %d height= %d', width,height);
			$('.outsideWrapper').css('width',width);
			$('.outsideWrapper').css('height',height);
			canvas.width = width;
			canvas.height = height;
			console.log('adjustCanvas: Canvas.id= %s ', canvas.id);
			console.log('adjustCanvas: canvas.width= %d canvas.height= %d', canvas.width,canvas.height);
			//console.log('adjustCanvas: Canvas.top= %d Canvas.left= %d', canvas.css('top'),canvas.left);
		} // adjustCanvas

		function adjustFaceBox(boxSpec,deltaWidth,deltaHeight)
		{
			let result = {};
			result['startX']	= Math.floor(deltaWidth * boxSpec.startX);
			result['startY']	= Math.floor(deltaHeight * boxSpec.startY);
			result['width']	= Math.floor(deltaWidth * boxSpec.width);
			result['height']	= Math.floor(deltaHeight * boxSpec.height);
			return result;
		} // adjustFaceBox

		function onImageClick(e)
		{
			let target = e.currentTarget;
			let fname = $('#testImage').attr('filename');
			let deltaWidth = Album_Data[fname]['deltaWidth'];
			let deltaHeight = Album_Data[fname]['deltaHeight'];
			var rect = target.getBoundingClientRect();
			console.log('onImageClick: boundingbox %d,%d,%d,%d',rect.top, rect.right, rect.bottom, rect.left);
			const canvas = $('#overlay').get(0);
			let newPos = getClickPosition(e,canvas)

			console.log('onImageClick: fname %s target.id %s target.tag %s',fname,target.id,target.tagName);
  			const pos = {
    				x: Math.floor(e.clientX * deltaWidth)
    				,y: Math.floor(e.clientY * deltaHeight)
  			};
			let face = isFaceClicked(fname,newPos,rect);
			console.log('onImageClick: clicked %s face %d',(face != -1) ? "on":'NOT ON' ,face)
		} // onImageClick

		function onImageDoubleClick(e)
		{
			console.log('onImageDoubleClick: START');
			let target = e.currentTarget;
			let fname = $('#testImage').attr('filename');
			let deltaWidth = Album_Data[fname]['deltaWidth'];
			let deltaHeight = Album_Data[fname]['deltaHeight'];
			const canvas = $('#overlay').get(0);
			const ctx = canvas.getContext('2d');
			var rect = target.getBoundingClientRect();
			console.log('onImageDoubleClick: boundingbox %d,%d,%d,%d',rect.top, rect.right, rect.bottom, rect.left);
			let newPos = getClickPosition(e,canvas)

			console.log('onImageDoubleClick: fname %s target.id %s target.tag %s',fname,target.id,target.tagName);
  			const pos = {
    				x: Math.floor(e.clientX * deltaWidth)
    				,y: Math.floor(e.clientY * deltaHeight)
  			};
			let face = isFaceClicked(fname,newPos,rect);
			console.log('onImageDoubleClick: clicked %s face %d',(face != -1) ? "on":'NOT ON' ,face)
			if(face != -1) {
				if (window.confirm("Do you want to delete this face box?")) { 
					console.log('onImageDoubleClick: Yes delete face box');
					let faceData = Album_Data[fname]['faces']['faceList']
					let fd = faceData[face];
					console.log('onImageDoubleClick face :' + JSON.stringify(fd,null,'\t'));
					let newFaceBox = adjustFaceBox(fd,deltaWidth,deltaHeight);
					console.log('onImageDoubleClick newFaceBox :' + JSON.stringify(newFaceBox,null,'\t'));
					ctx.lineWidth = LINE_WIDTH;
					ctx.strokeStyle = '#00FF00';
					ctx.clearRect(newFaceBox.startX, newFaceBox.startY, newFaceBox.width, newFaceBox.height);
				}
				else {
					console.log('onImageDoubleClick: NO  do not delete face box');
				}
			}
		} // onImageDoubleClick

		function run(picFileName,chosenImage)
		{
			const canvas = $('#overlay').get(0);
			const Jcanvas = $('#overlay');
			const ctx = canvas.getContext('2d');

			const faceData = Album_Data[picFileName]['faces']['faceList']
		console.log('run.setup: Canvas.tagName = %s id=%s', Jcanvas.prop("tagName"), Jcanvas.prop("id"));
		console.log('run.setup: Canvas.width= %d Canvas.height= %d', canvas.width,canvas.height);
		console.log('run.setup: Canvas.top= %s Canvas.left= %s', Jcanvas.css('top'),Jcanvas.css('left'));
		console.log ('run.setup The canvas left offset %f  top offset %f',Jcanvas.offset().left,Jcanvas.offset().top);

			console.log('run: code start ');
			//var rect = canvas.getBoundingClientRect();
			//console.log('run.canvas boundingbox BEFORE %s',JSON.stringify(rect,null,'\t'));
			//rect = chosenImage.getBoundingClientRect();
			//console.log('run.chosenImage boundingbox BEFORE %s',JSON.stringify(rect,null,'\t'));

      	console.log ('run: DISPLAY values  %d (width),%d (height)',DISPLAY_BOX_WIDTH,DISPLAY_BOX_HEIGHT);
      	let height = chosenImage.naturalHeight;
      	let width = chosenImage.naturalWidth;
      	console.log ('run: The image natural size is %d(width) * %d(height)',width,height);
			adjustCanvas(canvas,DISPLAY_BOX_WIDTH,DISPLAY_BOX_HEIGHT);
			//rect = canvas.getBoundingClientRect();
			//console.log('run.canvas boundingbox AFTER %s',JSON.stringify(rect,null,'\t'));
			//console.log('run: Canvas.top= %d Canvas.left= %d', canvas.css('top'),canvas.css('left'));
			let deltaWidth = DISPLAY_BOX_WIDTH / width;
			let deltaHeight = DISPLAY_BOX_HEIGHT / height;
			Album_Data[picFileName]['deltaWidth'] = deltaWidth;
			Album_Data[picFileName]['deltaHeight'] = deltaHeight;
			console.log ('onload: The delta size is %f * %f',deltaWidth,deltaHeight);

		ctx.strokeStyle = '#0000FF';
		ctx.lineWidth = 2;
		ctx.beginPath();
		ctx.strokeRect(0, 0, 235, 142);
		ctx.closePath();


			faceData.forEach((fd, i) => {
				console.log(JSON.stringify(fd,null,'\t'));
				let newFaceBox = adjustFaceBox(fd,deltaWidth,deltaHeight);
				console.log('newFaceBox = ' + JSON.stringify(newFaceBox,null,'\t'));
				// draw rectangle
				ctx.lineWidth = LINE_WIDTH;
				ctx.strokeStyle = STROKE_STYLE;
				ctx.beginPath();
				ctx.strokeRect(newFaceBox.startX, newFaceBox.startY, newFaceBox.width, newFaceBox.height);
				ctx.closePath();
			});
			console.log('run: boxes drawn');
		} // run