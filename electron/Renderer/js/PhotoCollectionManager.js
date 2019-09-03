const {remote} = require('electron');
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

let CliData = remote.getCurrentWindow().CliData; // parameters from the command line

function setupEventHandlers()
{
	 document.getElementById('IFH_CanvasTag').addEventListener('contextmenu', (e) => {
        logger('setupEventHandlers: contextmenu : detected');
        ImageFaceHandling.faceEdit(e);
	 });
	 logger('setupEventHandlers: contextmenu: after faceEdit setup');

    var prevImage = document.getElementById('prevImage');
	 logger('setupEventHandlers: prevImage:' + prevImage);
    document.getElementById('prevImage').addEventListener('click',function (evt) { ImageDisplay.nextPrevPicture(evt); });
    document.getElementById('nextImage').addEventListener('click',function (evt) { ImageDisplay.nextPrevPicture(evt); });
    logger('setupEventHandlers: after next/prev setup');

    // what to do when an image is selected from the file tree
    document.getElementById('fileList').addEventListener('click',(evt) => {ImageDisplay.pictureSelected(evt);});

	 // add a new face box
    document.getElementById('IFH_CreateFace').addEventListener('click',function (evt) 
	 {
      logger('setupEventHandlers: createFace(): evt.target.innerHTML:' + evt.target.innerHTML);
	   let config = ImageFaceHandling.getConfig();
		config.canvas.removeEventListener('click',ImageFaceHandling.onImageClick);

      if (evt.target.innerHTML.search('Add') != -1) {
         logger('setupEventHandlers: createFace(): Starting to draw face box:');
         evt.target.innerHTML = 'Save New Face Box';
         document.getElementById('IFH_CancelCreateFace').style.display='block';
         DrawBox.init(Album_Data,config,AlbumFile,ImageFaceHandling);
         DrawBox.startDrawing();
      }
      else {
         logger('setupEventHandlers: createFace(): done drawing face box:');
         evt.target.innerHTML = 'Add A Face';
         DrawBox.stopDrawing();
		   config.canvas.addEventListener('click',ImageFaceHandling.onImageClick);
         let newFace = DrawBox.getNewBoxInfo();
         //ImageFaceHandling.openFaceInfo(newFace);
         ImageFaceHandling.addFaceBox(newFace);
         logger('setupEventHandlers: newface:' + JSON.stringify(newFace,null,'\t'));
      }
    });

    document.getElementById('IFH_CancelCreateFace').addEventListener('click',function (evt) 
	 {
         logger('setupEventHandlers: cancel create face: START:');
         document.getElementById('IFH_CreateFace').innerHTML = 'Add A Face';
         DrawBox.stopDrawing();
         DrawBox.clearBox();

	      let config = ImageFaceHandling.getConfig();
		   config.canvas.addEventListener('click',ImageFaceHandling.onImageClick);
         document.getElementById('IFH_CancelCreateFace').style.display='none';
    });
    FaceInfo.init();
} // setupEventHandlers

$(document).ready(function()
{
    logger('ready: START ');
    console.log('ready: AlbumData: album path is :%s:',AlbumData.getAlbumPath());

    ImageDisplay = new ImageDisplayManagement('');
    console.log('ready: CliData.album :%s:',CliData.album);

    document.getElementById('albumName').addEventListener('data-loaded', () => {
         console.log('ready: data-loaded: event caught');
         ImageDisplay.createImageList('fileList');
    });

    if(CliData.album) {
        logger('ready: Clidata.album set')
        AlbumData.setAlbumPath(CliData.album);
        ImageDisplay.init(CliData.album);
        console.log('ready: album path is :%s:',AlbumData.getAlbumPath());
    }
    else {
        console.log('ready: Clidata.album NOT set AlbumData.AlbumPath=:%s:',AlbumData.getAlbumPath())
    }

    ImageHandlingSettings = {
       wrapperID    : 'pictureDisplay'
       ,albumName   : 'NO_REAL_ALBUM'
	    ,lineWidth   : 1
	    ,strokeStyle : '#FF0000'
		 ,albumFile   : AlbumFile
    };
	ImageFaceHandling.init(ImageHandlingSettings);
	ImageFaceHandling.showConfig();
   ImageFaceHandling.setup();
	setupEventHandlers();

   console.log('ready: before open-album: AlbumData.AlbumPath=:%s:',AlbumData.getAlbumPath())
   ipcRenderer.on('open-album', AlbumData.findAlbum);

   var copyRightYear = new Date().getFullYear();
   logger('ready:  copyRightYear=:'+copyRightYear+':');
   $('.copyright span').html(copyRightYear);
}); // ready function

// ideas from https://gist.github.com/robatron/5681424
function logger()
{
  //console.log('PhotoCollectionManager.logger start');
  if(CliData.debug) {
    let args = Array.prototype.slice.call(arguments);
    args.unshift('RENDER: ');
    console.log.apply(console, args);
  }
} // logger
