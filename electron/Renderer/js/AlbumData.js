const { Image } = require('image-js');
var AlbumData = (function () {

// extensions of allowed image files
let ImageExtensions = [ 'tif' ,'tiff' ,'gif' ,'jpeg' ,'jpg' ,'jif'
                            ,'jfif' ,'jp2' ,'jpx' ,'j2k' ,'j2c' ,'png'
                           ];
let ImageDirectoryFilter = [
    'thumbnails'
    ,'webpage'
    ,'orig'
    ,'pages'
];
let AlbumPath = 'NONE';
let FullAlbumPath = 'NONE';
let AlbumFileName = 'NONE';
let AlbumName = 'NONE';
let AlbumContents = {};
let AlbumSaved = true;;

function dataFileExists()
{
   console.log('RENDERER: AlbumData.dataFileExists filePath (%s) exists',FullAlbumPath);
   let fileContents = null;
   try {
         fileContents = fsLib.readFileSync(FullAlbumPath);
         console.log('RENDERER: AlbumData.dataFileExists: fileContents (%s)',fileContents);
         console.log('RENDERER: AlbumData.dataFileExists: fileContents length (%d)',fileContents.length);
   } catch(error) {
         console.error('RENDERER: AlbumData.dataFileExists data file (%s) read failed error is (%s)',FullAlbumPath, error);
         AlbumContents = {};
   }

   try {
         AlbumContents =  JSON.parse(fileContents);
         console.log('RENDERER: AlbumData.dataFileExists AlbumContents %s',JSON.stringify(AlbumContents,null,'\t'));
         document.getElementById('albumName').dispatchEvent(new Event('data-loaded'));
   } catch(error) {
         console.error('RENDERER: AlbumData.dataFileExists data file (%s) parse failed error is (%s)',FullAlbumPath, error);
         AlbumContents = {};
   }
} // dataFileExists

/*
		"pic003.png": {
				"faces": [
					{
						"lastName": "",
						"firstName": "",
						"height": 80,
						"width": 80,
						"startY": 410,
						"startX": 314
					},
				],
			"thumbHeight": 271,
			"thumbWidth": 181,
			"thumbScale": 0.25,
			"originalWidth": 725,
			"originalHeight": 1084,
			"channels": 3,
			"fileSize": 843790,
			"caption": "",
			"filename": "pic003.png",
			"whenTaken": "",
			"whereTaken": "",
			"notes": ""
		}
      */

// check the filename extension against the list of image file extensions
function isImage(fname)
{
    let ext = pathLib.extname(fname).toLowerCase().replace('.','');
    console.log('RENDERER: AlbumData.isImage: looking for :%s:',ext);
    return(ImageExtensions.indexOf(ext) > 0);
} // isImage

// List all files in a directory in Node.js recursively in a synchronous fashion
// base code from from https://gist.github.com/kethinov/6658166
// modified to build a data structure for the electron-tree-view
// TODO: not recursive, should this process sub directories of images? 
function collectImageFiles (albumPath)
{
  var getFiles = fsLib.readdirSync(albumPath);
  getFiles.forEach((file) => {
      console.log('RENDERER: AlbumData.collectImageFiles: PROCESSING file :%s:',file);
      if (fsLib.statSync(albumPath + '/' + file).isDirectory()) {
          if(ImageDirectoryFilter.indexOf(file) >= 0) return;  // skip folders I made
          collectImageFiles(albumPath + '/' + file + '/');
      }
      else {
          if(!isImage(file)) return; // only show image files
          let pathParts = pathLib.parse(file);
          let imageName= pathParts.base;
          AlbumContents['images'][imageName] = {};
          AlbumContents['images'][imageName]['faces'] = [];
          AlbumContents['images'][imageName]['fileName'] = file;
          Image.load(albumPath + '/' + file).then(function (image) {
            console.log('RENDERER: AlbumData.collectImageFiles: image file is :%s:',file);
            AlbumContents['images'][imageName]['originalWidth'] = image.width;
            AlbumContents['images'][imageName]['originalHeight'] = image.height;
          });
          AlbumContents['images'][imageName]['fileSize'] = fsLib.statSync(albumPath + '/' + file).size;
          AlbumContents['images'][imageName]['caption'] = '';
          AlbumContents['images'][imageName]['whenTaken'] = '';
          AlbumContents['images'][imageName]['whereTaken'] = '';
          AlbumContents['images'][imageName]['notes'] = '';
      }
  });
  console.log('RENDERER: AlbumData.collectImageFiles: FileList length = %d',FileList.length);
} // collectImageFiles

   function makeDataFile()
   {
      console.log('RENDERER: AlbumData.makeDataFile: START');
      AlbumContents = {};
      AlbumContents['images'] = {};
      AlbumContents['album'] = AlbumName;
      collectImageFiles(AlbumPath); 
		setTimeout(function(){
         console.log('RENDERER: AlbumData.makeDataFile AlbumContents %s',JSON.stringify(AlbumContents,null,'\t'));
         save();
         document.getElementById('albumName').dispatchEvent(new Event('data-loaded'));
		},5000);
   } // makeDataFile

  function setupAlbumData() 
  {
      console.log('RENDERER: AlbumData.setupAlbumData: START');
      let pathParts = pathLib.parse(AlbumPath);
      AlbumName = pathParts.base;
      AlbumFileName = AlbumName + '.json';
      FullAlbumPath = pathLib.join(AlbumPath, AlbumFileName);
      $('#albumName').val(AlbumName);
      console.log('RENDERER: AlbumData.setupAlbumData: album filename is :%s:',AlbumFileName);

      if (fsLib.existsSync(FullAlbumPath)) { //file exists
         console.log('RENDERER: AlbumData.setupAlbumData filePath (%s) exists',FullAlbumPath);
         dataFileExists();
      }
      else {
         console.log('RENDERER: AlbumData.setupAlbumData no album file, making one');
         makeDataFile();
      }
  } // setupAlbumData

  //TODO: this is written assuming we are on Linux, how should we deal with
  // file path designation on multiple OS's
var findAlbum = function(event, arg)
{
    var that=this;
    console.log('RENDERER: AlbumData.findAlbum: findAlbum message received');
    console.log('RENDERER: AlbumData.findAlbum: AlbumPath:%s:',AlbumPath);
    //that.setupAlbumData();
    remote.dialog.showOpenDialog({
        'title':"Select a folder"
        ,'defaultPath': 'C:'
        ,'properties': ["openDirectory"]
    }, (folderPaths) => {
        // folderPaths is an array that contains all the selected paths
        if(folderPaths === undefined) {
            console.log("RENDERER: AlbumData.findAlbum.showOpenDialog: No destination folder selected");
            AlbumPath = 'NONE_SELECTED';
            return;
        }
        else {
            //we only use the first selected path
            // example AlbumPath  /home/kent/projects/photo-collection-manager/electron/TestData
            // example Album  :TestData

            console.log('RENDERER: AlbumData.findAlbum: before processAlbum');
            AlbumPath = folderPaths[0];
            setupAlbumData();
        }
    }); // showOpenDialog
    console.log('RENDERER: AlbumData.findAlbum: DONE');
} // findAlbum

var save = function()
{
    try {
        console.log('RENDERER: AlbumData.save START');
        fsLib.writeFileSync(FullAlbumPath, JSON.stringify(AlbumContents,null,'\t'));
        console.log('RENDERER: AlbumData.save after save');
        AlbumSaved = true;
        return AlbumSaved;
    } catch(error) {
        console.error('RENDERER: AlbumData.save: album file (%s) failed, error is (%s)',FullAlbumPath, error);
        AlbumSaved = false;
        return AlbumSaved;
    }
} // save

var getImageList = function()
{
    var imageList = [];
    console.log('RENDERER: AlbumData.getImageList: AlbumContents[images] %s',AlbumContents['images']);
    var list = Object.keys(AlbumContents['images']);
    list.forEach((image) => {
        let imageListData = {};
        imageListData['name'] = image;
        imageListData['link'] = AlbumPath + '/' + AlbumContents['images'][image]['fileName'];
        imageListData['whereTaken']  = AlbumContents['images'][image]['whereTaken'];
        imageListData['whenTaken']  = AlbumContents['images'][image]['whenTaken'];
        imageListData['notes']  = AlbumContents['images'][image]['notes'];
        imageList.push(imageListData);
        console.log('RENDERER: AlbumData.getImageList: image list is (:%s:,:%s:)',imageListData['name'],imageListData['link']);
    });
    console.log('RENDERER: AlbumData.getImageList: image list length %d',imageList.length);
    return imageList;
} // getImageList

var getImageData = function(imageName)
{
   return AlbumContents['images'][imageName];
} // getImageData

var getFaceList = function(imageName)
{
   console.log('RENDERER: AlbumData.getFaceList: START image(%s)',imageName);
   let faces =  AlbumContents['images'][imageName]['faces']
   console.log('RENDERER: AlbumData.getFaceList: image(%s) faces length %d',imageName,faces.length);
   return faces;
} // getFaceList

var setAlbumPath = function(album)
{
      console.log('RENDERER: AlbumData.setAlbum: album is :%s:',album);
      AlbumPath = album;
      setupAlbumData();
} // setAlbumPath

var getAlbumPath = function()
{
      console.log('RENDERER: AlbumData.getAlbumPath: AlbumPath is :%s:',AlbumPath);
      return AlbumPath;
} // getAlbumPath

var getAlbumFileName = function()
{
      console.log('RENDERER: AlbumData.getAlbumFileName: AlbumFileName is :%s:',AlbumFileName);
      return AlbumFileName;
} // getAlbumFileName

var getAllAlbumData = function()
{
    return AlbumContents;
} // getAllAlbumData

var deleteFaceData = function(imageName,face)
{
   AlbumContents['images'][imageName]['faces'].splice(face,1);  // delete face object from list
   save();
} // deleteFaceData

var addNewFaceData = function(imageName,faceBox)
{
   AlbumContents['images'][imageName]['faces'].push(faceBox);
   return AlbumContents['images'][imageName]['faces'].length - 1;
} // addNewFaceData

var getNumFaces = function(imageName)
{
   console.log('RENDERER: AlbumData.getNumFaces imageName (%s)',imageName);
   return AlbumContents['images'][imageName]['faces'].length;
} // getNumFaces

var updateFaceData = function(imageName,faceNumber,firstName,secondName)
{
   let fNum = parseInt(faceNumber);
   console.log('RENDERER: AlbumData.updateFaceData faceNumber string(%s) fNum int(%d)',faceNumber,fNum);
   console.log('RENDERER: AlbumData.updateFaceData imageName (%s)',imageName);
   AlbumContents['images'][imageName]['faces'][fNum]['firstName'] = firstName;
   AlbumContents['images'][imageName]['faces'][fNum]['lastName'] = secondName;
} // updateFaceData

// not currently used. If we do this here, remove thumbnail production from the AlbumPreProcess code
function makeThumbNails()
{
    //console.log('RENDERER: AlbumData.makeThumbNails: START:');
    //for(var index=0,len=FileList.length; index<len; ++index) {
     for(var index=0,len=2; index<len; ++index) {
        let sourcePath = AlbumPath + '\\' + FileList[index];
        let destPath = AlbumPath + '\\thumbnails\\' + FileList[index];
        //console.log('RENDERER: AlbumData.makeThumbNails: working on source :' + sourcePath + ':');
        //console.log('RENDERER: AlbumData.makeThunmbNails: working on dest :' + destPath + ':');
        thumb({
            source: sourcePath
            ,destination: destPath
            ,width: 300
            ,quiet: false
            ,overwrite: true
            ,concurrency: 4
        }).then(function() {
                console.log('RENDERER: AlbumData.thumb: Success');
                }).catch(function(e) {
                    console.log('RENDERER: AlbumData.thumb: Error', e);
                });

    //console.log('RENDERER: AlbumData.makeThumbNails: working on :' + sourcePath + ': done');
    } // for FileList
} // makeThumbNails

// expose the class
  return {
	 setAlbumPath      : setAlbumPath
	 ,getAlbumPath     : getAlbumPath
	 ,getAlbumFileName : getAlbumFileName
	 ,getAllAlbumData  : getAllAlbumData
	 ,findAlbum        : findAlbum
	 ,save             : save
	 ,getImageList     : getImageList
	 ,getImageData     : getImageData
	 ,getFaceList      : getFaceList
	 ,getNumFaces      : getNumFaces
	 ,deleteFaceData   : deleteFaceData
	 ,addNewFaceData   : addNewFaceData
	 ,updateFaceData   : updateFaceData
  };
})();
