const remote = require('electron').remote;
const { ipcRenderer } = require('electron')
const fsLib = require('fs');
const pathLib = require('path');
const WIN = remote.getCurrentWindow();

// extensions of allowed image files
const ImageExtensions = [ 'tif' ,'tiff' ,'gif' ,'jpeg' ,'jpg' ,'jif'
                            ,'jfif' ,'jp2' ,'jpx' ,'j2k' ,'j2c' ,'png'
                           ];
const DefaultFrontPrefix = 'pic';
const DefaultBackPrefix = 'BackOf';

let CliData = {};
let ImageData = new Map();
let CurrentImage=0;
let PreviousImage = 0;
let ImagesKeys = [];
let FolderDialogOptions = {
	'title':'Select an album folder'
	,'defaultPath': '/home'
	,'properties': ['openDirectory']
	,'buttonLabel': 'Select Photo Album Folder'
};
let FrontClicked = false;
let BackClicked = false;

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
   console.log('RENDERER: AlbumViewer2.nextPrevPicture: initial CurrentImage,PreviousImage (%d , %d)', CurrentImage,PreviousImage);

   CurrentImage = (dir == 'prev') ? CurrentImage - 1 : CurrentImage + 1;
   if(CurrentImage < 0) CurrentImage = ImagesKeys.length-1;
   if(CurrentImage >= ImagesKeys.length) CurrentImage = 0;
   console.log('RENDERER: AlbumViewer2.nextPrevPicture: ImagesKeys[%d]= %s' , CurrentImage,ImagesKeys[CurrentImage]);

	switchPicture(ImagesKeys[CurrentImage]);
	switchHighLight();
} // nextPrevPicture

function switchPicture(frontFileName)
{
	console.log('RENDERER: AlbumViewer2.switchPicture: fileName :%s: album :%s:',frontFileName,CliData.album);
	let backFileName = "Nothing On Back";
	if(ImageData.has(frontFileName)) backFileName = ImageData.get(frontFileName).get("backName");
	console.log('RENDERER: AlbumViewer2.switchPicture: backFileName :%s:',backFileName)
	let backFileSrc = 'images/NothingOnBack.png';
	if(backFileName != "") backFileSrc = CliData.album +'/' + backFileName;
	let backImageEl = document.getElementById('IFH_BackImageTag'); // where to display the back image
	backImageEl.setAttribute('src',backFileSrc);
	document.getElementById('backFileName').innerHTML = (backFileName == "") ? "Nothing On Back" : backFileName;

	let frontFileSrc = CliData.album +'/' + frontFileName;
	let frontImageEl = document.getElementById('IFH_ImageTag'); // where to display the front image
	frontImageEl.setAttribute('data-filename', frontFileName);
	frontImageEl.setAttribute('src',frontFileSrc);
	document.getElementById('frontFileName').innerHTML = frontFileName;  // display the filename
} // switchPicture

function pictureSelected(evt)
{
   let fileName = evt.target.dataset.filename;
   if (evt.target.tagName.toLowerCase() != 'li') return; // ignore these clicks
	console.log('RENDERER: pictureSelected: fileName = :%s: INITIAL PreviousImage :%d: CurrentImage :%d:',fileName,PreviousImage,CurrentImage);
	PreviousImage = CurrentImage;
	switchPicture(fileName);
	CurrentImage = ImagesKeys.indexOf(fileName);
	switchHighLight();
	console.log('RENDERER: pictureSelected: FINAL PreviousImage :%d: CurrentImage :%d:',PreviousImage,CurrentImage);
} // pictureSelected

function gatherImages(album)
{
	let fileList = null;
	console.log('RENDERER: AlbumViewer2.gatherImages: __dirname (%s) album (%s)',__dirname,album);
	try {
        fileList = fsLib.readdirSync(album);
		console.log('RENDERER: AlbumViewer2.gatherImages: fileContents length (%d)',fileList.length);
		fileList.sort();
		console.log("gatherImages: fileList"); console.dir(fileList);
		fileList.forEach(function (file)
		{
         	//console.log('RENDERER: AlbumViewer2.gatherImages: file (%s)',file);
          	if(!isImage(file)) return; // only show image files

          	let pathParts = pathLib.parse(file);
          	let imageName= pathParts.base;
         	//console.log('RENDERER: AlbumViewer2.gatherImages: imageName (%s)',imageName);

			if(imageName.startsWith(CliData['BackPrefix'])) {
         		//console.log('RENDERER: AlbumViewer2.gatherImages: processing back of image');
				frontName = imageName.replace(CliData['BackPrefix'],'');
         		//console.log('RENDERER: AlbumViewer2.gatherImages: frontName (%s)',frontName);
				if(!ImageData.has(frontName)) {
         			//console.log('RENDERER: AlbumViewer2.gatherImages: frontName NOT IN ImageData');
					ImageData.set(frontName,new Map().set('backName',imageName));
				}
				else {
         			//console.log('RENDERER: AlbumViewer2.gatherImages: frontName IN ImageData');
					ImageData.get(frontName).set('backName',imageName);
				}
			}
			else {  // see regular front image file
					if(!ImageData.has(imageName)) {  // if there is  no backOf file
						let back = new Map();
						//back.set('backName', 'images/NothingOnBack.png');
						back.set('backName', '');
						//console.log("gatherImages: NO BackName: back"); console.dir(back);
						ImageData.set(imageName,back);
						//console.log("gatherImages: NO BackName: image object"); console.dir(ImageData.get(imageName));
         				//console.log('RENDERER: AlbumViewer2.gatherImages: insert frontName IN ImageData NO backName');
					}
				}
    	});

   } catch(error) {
         console.error('RENDERER: AlbumViewer2.gatherImages data file (%s) read failed error is (%s)',album, error);
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
	ipcRenderer.on('open-album', () => {findAlbum('albumName');});
	document.getElementById('albumName').addEventListener('open-album', () => {
		console.log('RENDERER: AlbumViewer2.setupEventHandlers: open-album: event caught');
	});
	document.getElementById('albumName').addEventListener('click', (evt) => {
		console.log('RENDERER: AlbumViewer2.setupEventHandlers: albumName clicked');
		findAlbum('albumName');
	});

	// what to do when an image is selected from the file tree
	document.getElementById('fileList').addEventListener('click',pictureSelected);

	window.addEventListener("keydown", processKeyStroke, true);

	[document.getElementById('IFH_ImageTag'), document.getElementById('IFH_BackImageTag')]
   	.map((tag) => {
			tag.addEventListener('load', () => {
				console.log('RENDERER: AlbumViewer2.setupEventHandlers: image object loaded this.src = :%s:', tag.src);
			}); // load event
			//tag.addEventListener('click', bigPicture); // click event
		});

	 ['IFH_ImageTag','IFH_BackImageTag'].map((tag) => {
		let el = document.getElementById(tag);
		el.addEventListener('load', () => {
			console.log('RENDERER: AlbumViewer2.setupEventHandler: image object loaded src = :%s:', el.src);
		}); // load event
	});

// Get the modal
var modal = document.getElementById('myModal');

// Get the image and insert it inside the modal - use its "alt" text as a caption
	 ['IFH_ImageTag','IFH_BackImageTag'].map((tag) => {
		var img = document.getElementById(tag);
		var modalImg = document.getElementById("img01");

		// When the user clicks on the bigger image, close the modal
		modal.onclick = function() { 
    		modal.style.display = "none";
		}
		img.onclick = function(){
    		modal.style.display = "block";
    		modalImg.src = this.src;
		}
});
} // setupEventHandlers

// from MDN notes
function processKeyStroke(evt)
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
		let fel = (FrontClicked) ? 'myModal' : 'IFH_ImageTag';
		document.getElementById(fel).click();
		FrontClicked = !FrontClicked;
      break;
    case "B":
    case "b":
      // make the back side big
		let bel = (BackClicked) ? 'myModal' : 'IFH_BackImageTag';
		document.getElementById(bel).click();
		BackClicked = !BackClicked;
      break;
    case "Escape":
      // restore big image to normal size
      break;
    default:
      return; // Quit when this doesn't handle the key event.
  }

  // Cancel the default action to avoid it being handled twice
  event.preventDefault();
} // processKeyStroke

function createImageList(listElement)
{
	console.log('RENDERER: AlbumViewer2.createImageList START:  ImageData.size (%d)',ImageData.size)
	let imgList = [];
	let ulElement = document.getElementById(listElement);
	let keys = Array.from(ImageData.keys());
	keys.sort();
	for (img of keys) {
		console.log('RENDERER: AlbumViewer2.createImageList adding (%s)',img)
		imgList.push(`<li data-filename='${img}' class='fileTreeLink'> ${img} </li>`);
		ImagesKeys.push(img);
	}
	PreviousImage = ImagesKeys.length;
	ulElement.innerHTML = imgList.join('');
	//console.log("image list:",ulElement);
	document.querySelector( ".fileList > :first-child" ).classList.toggle('selectedImage');
} // createImageList

// run when the page is fully loaded
document.addEventListener("DOMContentLoaded", function()
{
	 CliData = remote.getGlobal('CliData');
	 console.log("CliData Contents"); console.dir(CliData);
    if(!CliData['FrontPrefix']) CliData['FrontPrefix'] = DefaultFrontPrefix
    if(!CliData['BackPrefix']) CliData['BackPrefix'] = DefaultBackPrefix

    if(CliData.album) {
		console.log('RENDERER: AlbumViewer2.ready: CliData.album set is :%s:',CliData.album);
    	document.getElementById('albumName').value = CliData.album;
		gatherImages(CliData.album);
		createImageList('fileList');
		console.log("DOMContentLoaded: ImagesKeys Contents"); console.dir(ImagesKeys);
		console.log("DOMContentLoaded: ImageData Contents"); console.dir(ImageData);
		switchPicture(ImagesKeys[0]);
    }
    else {
        console.log('RENDERER: AlbumViewer2.ready: Clidata.album NOT set',);
    }

	setupEventHandlers();

   console.log('RENDERER: AlbumViewer2.ready: DONE');
}); // ready function

  //TODO: this is written assuming we are on Linux, how should we deal with
  // file path designation on multiple OS's
function findAlbum(elName)
{
    console.log('RENDERER: AlbumViewer2.findAlbum: START: CliData.album:%s:',CliData.album);
	 let target = document.getElementById(elName);  // the element that will hold the album path
	 let currentFolder = target.value;

	 // p is the Promise returned by showOpenDialog
    // folderPaths is an array that contains all the selected paths
    remote.dialog.showOpenDialog(WIN,FolderDialogOptions).then((p) => {
			if(p.canceled) {
				target.value = currentFolder;
			} 
			else {
				target.value = p.filePaths[0];
				CliData.album = p.filePaths[0];
				gatherImages(CliData.album);
				createImageList('fileList');
				switchPicture(ImagesKeys[0]);
			}
    		console.log('RENDERER: AlbumViewer2.findAlbum: target.value :%s:',target.value);
    	} // end of callback function
	); // showOpenDialog
    console.log('RENDERER: AlbumViewer2.findAlbum: DONE');
} // findAlbum

