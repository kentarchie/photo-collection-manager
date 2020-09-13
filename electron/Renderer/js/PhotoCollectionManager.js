//const {remote} = require('electron');
const remote = require('electron').remote;
console.log("definition: remote exists? :%s:",remote);
const { ipcRenderer } = require('electron')
const fsLib = require('fs');
const pathLib = require('path');
const thumb = require('node-thumbnail').thumb;
const ImageDisplayManagement = require(`${__dirname}/js/ImageDisplayManagement.js`);

let Settings = {};
let FileList = [];

let AlbumPath = ''; // full path to the directory containing the album
let AlbumName = ''; // name of the directory containing the album
let Album_Data = null; // contents of the JSON file describing the album
let ImageHandlingSettings = {};
let ImageDisplay = null;
let DrawBoxControls = null;
let AlbumFile = null;

function setupEventHandlers()
{
   /*
	 document.getElementById('IFH_CanvasTag').addEventListener('contextmenu', (e) => {
        console.log('RENDERER: PhotoCollectionManager.setupEventHandlers: contextmenu : detected');
        ImageFaceHandling.faceEdit(e);
	 });
    console.log('RENDERER: PhotoCollectionManager.setupEventHandlers: contextmenu: after faceEdit setup');
    */

    var prevImage = document.getElementById('prevImage');
	 console.log('RENDERER: PhotoCollectionManager.setupEventHandlers: prevImage :%s:',prevImage);
    document.getElementById('prevImage').addEventListener('click',(evt) => { ImageDisplay.nextPrevPicture(evt); });
    document.getElementById('nextImage').addEventListener('click',(evt) => { ImageDisplay.nextPrevPicture(evt); });

    // what to do when an image is selected from the file tree
    document.getElementById('fileList').addEventListener('click',(evt) => {ImageDisplay.pictureSelected(evt);});

	 // add a new face box
    document.getElementById('IFH_CreateFace').addEventListener('click',function (evt) 
	 {
      let addSaveButton = evt.target.innerHTML;
      console.log('RENDERER: PhotoCollectionManager.setupEventHandlers: createFace(): evt.target.innerHTML :%s:',addSaveButton);
	   let config = ImageFaceHandling.getConfig();
		config.canvas.removeEventListener('click',ImageFaceHandling.onImageClick);

      if (addSaveButton.search('Add') != -1) {
         console.log('RENDERER: PhotoCollectionManager.setupEventHandlers: createFace(): Starting to draw face box:');
         evt.target.innerHTML = 'Save New Face Box';
         //document.getElementById('IFH_CancelCreateFace').style.display='block';
         DrawBox.init(Album_Data,config,AlbumFile,ImageFaceHandling);
         DrawBox.startDrawing();
      }
      else {
         console.log('RENDERER: PhotoCollectionManager.setupEventHandlers: createFace(): done drawing face box:');
         DrawBox.stopDrawing();
         evt.target.innerHTML = 'Add A Face';
		   config.canvas.addEventListener('click',ImageFaceHandling.onImageClick); // go back to waiting for click
         let newFace = DrawBox.getNewBoxInfo();
         let newFaceNumber = ImageFaceHandling.addFaceBox(newFace);
         //let fName = document.getElementById('pictureFileName').innerHTML;
         //let newFaceNumber = AlbumData.getNumFaces(fName) - 1;
	      FaceInfo.displayFaceData(newFaceNumber, 'First', 'Second');
		   FaceInfo.faceSelected (newFace,newFaceNumber);
         console.log('RENDERER: PhotoCollectionManager.setupEventHandlers: newface :%s',JSON.stringify(newFace,null,'\t'));
      }
    });

    /*
    document.getElementById('IFH_CancelCreateFace').addEventListener('click',function (evt) 
	 {
         console.log('RENDERER: PhotoCollectionManager.setupEventHandlers: cancel create face: START:');
         document.getElementById('IFH_CreateFace').innerHTML = 'Add A Face';
         DrawBox.stopDrawing();

	      let config = ImageFaceHandling.getConfig();
		   config.canvas.addEventListener('click',ImageFaceHandling.onImageClick);
         document.getElementById('IFH_CancelCreateFace').style.display='none';
    });
    */

    FaceInfo.init();
} // setupEventHandlers

$(document).ready(function()
{
    console.log('RENDERER: PhotoCollectionManager.ready: START ');
    console.log('RENDERER: PhotoCollectionManager.ready: AlbumData: album path is :%s:',AlbumData.getAlbumPath());
	 console.log("ready: remote exists? :%s:",remote);
	 //console.log("ready: remote.getCurrentWindow() exists? :%s:",remote.getCurrentWindow);
	 //let CliData = remote.getCurrentWindow().CliData; // parameters from the command line
	 let CliData = remote.getGlobal('CliData');
	 console.log('RENDERER: CliData from global :%s:',JSON.stringify(CliData,null,'\t'));

    ImageDisplay = new ImageDisplayManagement('');
    console.log('RENDERER: PhotoCollectionManager.ready: CliData.album :%s:',CliData.album);

    document.getElementById('albumName').addEventListener('data-loaded', () => {
         console.log('RENDERER: PhotoCollectionManager.ready: data-loaded: event caught');
         ImageDisplay.createImageList('fileList');
    });

    if(CliData.album) {
        console.log('RENDERER: PhotoCollectionManager.ready: Clidata.album set')
        AlbumData.setAlbumPath(CliData.album);
        ImageDisplay.init(CliData.album);
        console.log('RENDERER: PhotoCollectionManager.ready: album path is :%s:',AlbumData.getAlbumPath());
    }
    else {
        console.log('RENDERER: PhotoCollectionManager.ready: Clidata.album NOT set AlbumData.AlbumPath=:%s:',AlbumData.getAlbumPath())
    }
   document.getElementById('IFH_DeleteFace').style.visibility='hidden';
   document.getElementById('IFH_SaveChanges').style.visibility='hidden';

   ImageHandlingSettings = {
       wrapperID    : 'pictureDisplay'
       ,albumName   : 'NO_REAL_ALBUM'
	    ,lineWidth   : 1
	    ,strokeStyle : '#00FF00'
		 ,albumFile   : AlbumFile
    };
	ImageFaceHandling.init(ImageHandlingSettings);
	ImageFaceHandling.showConfig();
   ImageFaceHandling.setup();
	setupEventHandlers();

   console.log('RENDERER: PhotoCollectionManager.ready: before open-album: AlbumData.AlbumPath=:%s:',AlbumData.getAlbumPath())
   ipcRenderer.on('open-album', AlbumData.findAlbum);

}); // ready function
