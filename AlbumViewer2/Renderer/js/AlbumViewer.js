const remote = require('electron').remote;
const { ipcRenderer } = require('electron')
const fsLib = require('fs');
const pathLib = require('path');

// extensions of allowed image files
const ImageExtensions = [ 'tif' ,'tiff' ,'gif' ,'jpeg' ,'jpg' ,'jif'
                            ,'jfif' ,'jp2' ,'jpx' ,'j2k' ,'j2c' ,'png'
                           ];
const BackTag = 'BackOf';

let CliData = {};
let ImageData = new Map();
let ImageClicked=false;
let CurrentImage=0;
let ImagesKeys = [];

function logImageData(title)
{
	console.log(title);
	ImageData.forEach(function(value, key) {
		value.forEach(function(value2, key2) {
			console.log(`main key is :${key}: key2 is :${key2}: value2 is :${value2}:`);
		});
	});
} // logImageData

// check the filename extension against the list of image file extensions
function isImage(fname)
{
    let ext = pathLib.extname(fname).toLowerCase().replace('.','');
    //console.log('RENDERER: AlbumData.isImage: extension is :%s:',ext);
    return(ImageExtensions.indexOf(ext) > 0);
} // isImage

function nextPicture()
{
    console.log('nextPicture: START');
} // nextPicture

function prevPicture()
{
    console.log('prevPicture: START');
} // prevPicture

function nextPrevPicture(evt)
{
	 let id = evt.target.id;
    console.log('RENDERER: AlbumViewer2.nextPrevPicture: START button id = %s' , id);
    //if(this.CurrentPicture == '') this.CurrentPicture = this.FileList[0];
    //let index = this.findPicture(this.CurrentPicture);
    //console.log('RENDERER: AlbumViewer2.nextPrevPicture: initial index= %d' , index);
    //index = (id.startsWith('prev')) ? index -1 : index +1;
    //if(index <= 0) index = this.FileList.length-1;
    //if(index >= this.FileList.length) index = 0;
	 console.log('RENDERER: AlbumViewer2.nextPrevPicture: final index= %d' , index);

    //let path = AlbumPath + '/' + this.FileList[index];
    console.log('RENDERER: AlbumViewer2.nextPrevPicture: path= %s' , path);
    //this.CurrentPicture = this.FileList[index];
	 //this.switchPicture(this.CurrentPicture);
} // nextPrevPicture

function switchPicture(chosenElement)
{
   console.log('RENDERER: ImageDisplayManagment.switchPicture: chosenElement.innerHTML= :%s:',chosenElement.innerHTML);
   if (chosenElement.tagName.toLowerCase() != 'li') return;
   let fileName = chosenElement.dataset.filename;
   let filePath = chosenElement.dataset.path;
	let backFileName = "Nothing On Back";
	let imageTag = document.getElementById('IFH_ImageTag'); // where to display the front image
	let backImageTag = document.getElementById('IFH_BackImageTag');

   console.log('RENDERER: ImageDisplayManagment.switchPicture: fileName :%s:',fileName)
   console.log('RENDERER: ImageDisplayManagment.switchPicture: filePath :%s:',filePath)
   console.log('RENDERER: ImageDisplayManagment.switchPicture: album :%s:',CliData.album)

   document.getElementById('frontFileName').innerHTML = fileName;  // display the filename

   [imageTag,backImageTag].map((tag) => {
		tag.addEventListener('load', () => {
			console.log('RENDERER: ImageDisplayManagement.switchPicture: image object loaded this.src = :%s:', tag.src);
		}); // load event
	});

   imageTag.setAttribute('data-path', filePath);
   imageTag.setAttribute('data-filename', fileName);
   imageTag.setAttribute('src',CliData.album + filePath);

   backImageTag.setAttribute('src','images/NothingOnBack.png');
	if(ImageData.has(fileName)) backFileName = ImageData.get(fileName).get("backName");
   console.log('RENDERER: ImageDisplayManagment.switchPicture: backFileName :%s:',backFileName)
	document.getElementById('backFileName').innerHTML = backFileName;

	if(backFileName != "") {
   	backImageTag.setAttribute('src',CliData.album + backFileName);
	}
} // switchPicture

function  pictureSelected(evt)
{
	console.log('RENDERER: pictureSelected: evt.target.innerHTML = :%s:',evt.target.innerHTML);
	console.log('RENDERER: pictureSelected: evt.target.tagName = :%s:',evt.target.tagName);
	switchPicture(evt.target);
} // pictureSelected

function gatherImages(album)
{
	let fileList = null;
	let albumPath = pathLib.join(__dirname, album);
   console.log('RENDERER: AlbumViewer.gatherImages: __dirname (%s)',__dirname);
   console.log('RENDERER: AlbumViewer.gatherImages: albumPath (%s)',albumPath);
   try {
         fileList = fsLib.readdirSync(albumPath);
         console.log('RENDERER: AlbumViewer.gatherImages: fileContents length (%d)',fileList.length);
    		fileList.forEach(function (file) {
         	console.log('RENDERER: AlbumViewer.gatherImages: file (%s)',file);
          	if(!isImage(file)) return; // only show image files

          	let pathParts = pathLib.parse(file);
          	let imageName= pathParts.base;
         	console.log('RENDERER: AlbumViewer.gatherImages: imageName (%s)',imageName);

				if(imageName.startsWith(BackTag)) {
         		console.log('RENDERER: AlbumViewer.gatherImages: processing back of image');
					frontName = imageName.replace(BackTag,'');
         		console.log('RENDERER: AlbumViewer.gatherImages: frontName (%s)',frontName);
					if(!ImageData.has(frontName)) {
         			console.log('RENDERER: AlbumViewer.gatherImages: frontName NOT IN ImageData');
						ImageData.set(frontName,new Map().set('backName',imageName));
						//ImageData[frontName] = {'backName' : imageName};
					}
					else {
         			console.log('RENDERER: AlbumViewer.gatherImages: frontName IN ImageData');
						ImageData.get(frontName).set('backName',imageName);
					}
				}
				else {  // see regular image file
					if(!ImageData.has(imageName)) {  // if there is  no backOf file
						ImageData.set(imageName,new Map().set('backName',''));
						//ImageData[imageName] = {'backName' : ''};
					}
				}
    	});

   } catch(error) {
         console.error('RENDERER: AlbumViewer.gatherImages data file (%s) read failed error is (%s)',albumPath, error);
   }
} // gatherImages

function bigPicture(evt)
{
	let image=evt.target
	console.log('RENDERER: bigPicture: image.tagName = :%s:',image.tagName);
	image.classList.toggle('normalSize');
	image.classList.toggle('bigSize');
} // bigPicture

function setupEventHandlers()
{
	document.getElementById('albumName').addEventListener('data-loaded', () => {
		console.log('RENDERER: AlbumViewer2.ready: data-loaded: event caught');
	});

	// what to do when an image is selected from the file tree
	document.getElementById('fileList').addEventListener('click',(evt) => {pictureSelected(evt);});

	window.addEventListener("keydown", processKey, true);

	[document.getElementById('IFH_ImageTag'), document.getElementById('IFH_BackImageTag')]
   	.map((tag) => {
			tag.addEventListener('load', () => {
				console.log('RENDERER: ImageDisplayManagement.switchPicture: image object loaded this.src = :%s:', tag.src);
			}); // load event
			tag.addEventListener('click', bigPicture); // click event
		});

} // setupEventHandlers

// from MDN notes
function processKey(evt)
{
  if (event.defaultPrevented) {
    return; // Do nothing if the event was already processed
  }

  switch (event.key) {
    case "ArrowDown":
    case "ArrowRight":
      // go to next image in the list
	  nextPicture();
      break;
    case "ArrowUp":
    case "ArrowLeft":
      // go to previous image in the list
	  prevPicture();
      break;
    case "F":
    case "f":
      // make the front side big
      break;
    case "B":
    case "b":
      // make the back side big
      break;
    case "Escape":
      // restore big image to normal size
      break;
    default:
      return; // Quit when this doesn't handle the key event.
  }

  // Cancel the default action to avoid it being handled twice
  event.preventDefault();
} // processKey

function createImageList(listElement)
{
	console.log('RENDERER: AlbumViewer2.createImageList START:  ImageData.size (%d)',ImageData.size)
	let imgList = [];
	for (let [img, value] of ImageData) {
		console.log('RENDERER: AlbumViewer2.createImageList adding (%s)',img)
		imgList.push('<li data-filename="'+img+'" data-path="'+img+'">' + img + '</li>');
		ImagesKeys.push(img);
	}
	document.getElementById(listElement).innerHTML = imgList.join('');
} // createImageList

// run when the page is fully loaded
document.addEventListener("DOMContentLoaded", function()
{
    //console.log('RENDERER: AlbumViewer2.ready: START: AlbumData: album path is :%s:',AlbumData.getAlbumPath());
	 CliData = remote.getGlobal('CliData');
	 console.log('RENDERER:AlbumViewer2 CliData from global :%s:',JSON.stringify(CliData,null,'\t'));

    if(CliData.album) {
		console.log('RENDERER: AlbumViewer2.ready: CliData.album set is :%s:',CliData.album);
    	document.getElementById('albumName').value = CliData.album;
		gatherImages(CliData.album);
		console.log('RENDERER: AlbumViewer2.ready: AFTER gatherImages');
		createImageList('fileList');
		console.log('RENDERER:AlbumViewer2 ready ImagesKeys :%s:',JSON.stringify(ImagesKeys,null,'\t'));
		logImageData( 'RENDERER:AlbumViewer2 ready ImageData');
    }
    else {
        console.log('RENDERER: AlbumViewer2.ready: Clidata.album NOT set',);
    }

	setupEventHandlers();

   // console.log('RENDERER: AlbumViewer2.ready: before open-album: AlbumData.AlbumPath=:%s:',AlbumData.getAlbumPath())
   // ipcRenderer.on('open-album', AlbumData.findAlbum);

    console.log('RENDERER: AlbumViewer2.ready: DONE');
}); // ready function
