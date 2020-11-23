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
let PreviousImage = 0;
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
    //console.log('RENDERER: AlbumViewer2.isImage: extension is :%s:',ext);
    return(ImageExtensions.indexOf(ext) > 0);
} // isImage

function switchHighLight()
{
	[PreviousImage, CurrentImage].map((num) => {
		let imageName = ImagesKeys[num];
   	console.log('RENDERER: AlbumViewer2.switchHighLight: working on image :%s:\n',imageName);
		let imageElement = document.querySelector( "[data-filename='"+imageName+"']" );
		imageElement.classList.toggle('selectedImage');
	});
} //switchHighLight

function nextPrevPicture(dir)
{
   console.log('RENDERER: AlbumViewer2.nextPrevPicture: START dir  = :%s:' , dir);
   if(CurrentImage == 0) fileName = ImagesKeys[0];
   PreviousImage = CurrentImage;
   console.log('RENDERER: AlbumViewer2.nextPrevPicture: initial CurrentImage= %d' , CurrentImage);
   console.log('RENDERER: AlbumViewer2.nextPrevPicture: initial PreviousImage= %d' , PreviousImage);
   CurrentImage = (dir == 'prev') ? CurrentImage - 1 : CurrentImage + 1;
   if(CurrentImage < 0) CurrentImage = ImagesKeys.length-1;
   if(CurrentImage >= ImagesKeys.length) CurrentImage = 0;
	console.log('RENDERER: AlbumViewer2.nextPrevPicture: final CurrentImage= %d' , CurrentImage);

   console.log('RENDERER: AlbumViewer2.nextPrevPicture: ImagesKeys[CurrentImage= %s' , ImagesKeys[CurrentImage]);
	switchPicture(ImagesKeys[CurrentImage],ImagesKeys[CurrentImage]);
	switchHighLight();
} // nextPrevPicture

function switchPicture(fileName,filePath)
{
	let backFileName = "Nothing On Back";
	let imageTag = document.getElementById('IFH_ImageTag'); // where to display the front image
	let backImageTag = document.getElementById('IFH_BackImageTag'); // where to display the back image

   console.log('RENDERER: AlbumViewer2.switchPicture: fileName :%s: filePath :%s:',fileName,filePath);
   console.log('RENDERER: AlbumViewer3.switchPicture: album :%s:',CliData.album)

   document.getElementById('frontFileName').innerHTML = fileName;  // display the filename

   [imageTag,backImageTag].map((tag) => {
		tag.addEventListener('load', () => {
			console.log('RENDERER: AlbumViewer2.switchPicture: image object loaded this.src = :%s:', tag.src);
		}); // load event
	});

   imageTag.setAttribute('data-path', filePath);
   imageTag.setAttribute('data-filename', fileName);
   imageTag.setAttribute('src',CliData.album + filePath);

   backImageTag.setAttribute('src','images/NothingOnBack.png');
	if(ImageData.has(fileName)) backFileName = ImageData.get(fileName).get("backName");
   console.log('RENDERER: AlbumViewer2.switchPicture: backFileName :%s:',backFileName)
	document.getElementById('backFileName').innerHTML = backFileName;

	if(backFileName != "") {
   	backImageTag.setAttribute('src',CliData.album + backFileName);
	}
} // switchPicture

function pictureSelected(evt)
{
	console.log('RENDERER: pictureSelected: evt.target.innerHTML = :%s:',evt.target.innerHTML);
	console.log('RENDERER: pictureSelected: evt.target.tagName = :%s:',evt.target.tagName);
	console.log('RENDERER: pictureSelected: INITIAL PreviousImage :%d: CurrentImage :%d:',PreviousImage,CurrentImage);
	PreviousImage = CurrentImage;
   if (evt.target.tagName.toLowerCase() != 'li') return; // ignore these clicks
   let fileName = evt.target.dataset.filename;
   let filePath = evt.target.dataset.path;
	switchPicture(fileName,filePath);
	CurrentImage = ImagesKeys.indexOf(fileName);
	switchHighLight();
	console.log('RENDERER: pictureSelected: FINAL PreviousImage :%d: CurrentImage :%d:',PreviousImage,CurrentImage);
} // pictureSelected

function gatherImages(album)
{
	let fileList = null;
	let albumPath = pathLib.join(__dirname, album);
   console.log('RENDERER: AlbumViewer2.gatherImages: __dirname (%s)',__dirname);
   console.log('RENDERER: AlbumViewer2.gatherImages: albumPath (%s)',albumPath);
   try {
         fileList = fsLib.readdirSync(albumPath);
         console.log('RENDERER: AlbumViewer2.gatherImages: fileContents length (%d)',fileList.length);
    		fileList.forEach(function (file) {
         	console.log('RENDERER: AlbumViewer2.gatherImages: file (%s)',file);
          	if(!isImage(file)) return; // only show image files

          	let pathParts = pathLib.parse(file);
          	let imageName= pathParts.base;
         	console.log('RENDERER: AlbumViewer2.gatherImages: imageName (%s)',imageName);

				if(imageName.startsWith(BackTag)) {
         		console.log('RENDERER: AlbumViewer2.gatherImages: processing back of image');
					frontName = imageName.replace(BackTag,'');
         		console.log('RENDERER: AlbumViewer2.gatherImages: frontName (%s)',frontName);
					if(!ImageData.has(frontName)) {
         			console.log('RENDERER: AlbumViewer2.gatherImages: frontName NOT IN ImageData');
						ImageData.set(frontName,new Map().set('backName',imageName));
					}
					else {
         			console.log('RENDERER: AlbumViewer2.gatherImages: frontName IN ImageData');
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
         console.error('RENDERER: AlbumViewer2.gatherImages data file (%s) read failed error is (%s)',albumPath, error);
   }
} // gatherImages

function bigPicture(evt)
{
	let image=evt.target
	console.log('RENDERER: AlbumViewer2.bigPicture: image.tagName = :%s:',image.tagName);
	image.classList.toggle('normalSize');
	image.classList.toggle('bigSize');
} // bigPicture

function setupEventHandlers()
{
	document.getElementById('albumName').addEventListener('data-loaded', () => {
		console.log('RENDERER: AlbumViewer2.setupEventHandlers: data-loaded: event caught');
	});

	// what to do when an image is selected from the file tree
	document.getElementById('fileList').addEventListener('click',pictureSelected);

	window.addEventListener("keydown", processKey, true);

	[document.getElementById('IFH_ImageTag'), document.getElementById('IFH_BackImageTag')]
   	.map((tag) => {
			tag.addEventListener('load', () => {
				console.log('RENDERER: AlbumViewer2.setupEventHandlers: image object loaded this.src = :%s:', tag.src);
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
    case "N":
    case "n":
      // go to next image in the list
		nextPrevPicture('next');
      break;
    case "ArrowUp":
    case "ArrowLeft":
    case "P":
    case "p":
      // go to previous image in the list
		nextPrevPicture('prev');
      break;
    case "F":
    case "f":
      // make the front side big
		document.getElementById('IFH_ImageTag').click();
      break;
    case "B":
    case "b":
      // make the back side big
		document.getElementById('IFH_BackImageTag').click();
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
		imgList.push(`<li data-filename='${img}' data-path='${img}' class='fileTreeLink'> ${img} </li>`);
		ImagesKeys.push(img);
	}
	PreviousImage = ImagesKeys.length;
	document.getElementById(listElement).innerHTML = imgList.join('');
	document.querySelector( ".fileList > :first-child" ).classList.toggle('selectedImage');
} // createImageList

// run when the page is fully loaded
document.addEventListener("DOMContentLoaded", function()
{
    //console.log('RENDERER: AlbumViewer2.ready: START: AlbumData: album path is :%s:',AlbumData.getAlbumPath());
	 CliData = remote.getGlobal('CliData');
	 console.log('RENDERER:AlbumViewer2.ready: CliData from global :%s:',JSON.stringify(CliData,null,'\t'));

    if(CliData.album) {
		console.log('RENDERER: AlbumViewer2.ready: CliData.album set is :%s:',CliData.album);
    	document.getElementById('albumName').value = CliData.album;
		gatherImages(CliData.album);
		console.log('RENDERER: AlbumViewer2.ready: AFTER gatherImages');
		createImageList('fileList');
		console.log('RENDERER:AlbumViewer2.ready ImagesKeys :%s:',JSON.stringify(ImagesKeys,null,'\t'));
		logImageData( 'RENDERER:AlbumViewer2 ready ImageData');
		switchPicture(ImagesKeys[0],ImagesKeys[0]);
    }
    else {
        console.log('RENDERER: AlbumViewer2.ready: Clidata.album NOT set',);
    }

	setupEventHandlers();

   // console.log('RENDERER: AlbumViewer2.ready: before open-album: AlbumData.AlbumPath=:%s:',AlbumData.getAlbumPath())
   // ipcRenderer.on('open-album', AlbumData.findAlbum);

    console.log('RENDERER: AlbumViewer2.ready: DONE');
}); // ready function
