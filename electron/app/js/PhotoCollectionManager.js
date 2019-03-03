
const {remote} = require('electron');
const fsLib = require('fs');
const pathLib = require('path');
const thumb = require('node-thumbnail').thumb;
const MakeReadAlbumData = require(`${__dirname}/js/MakeReadAlbumData.js`);

const FILE_TREE_NODE_LABEL = 'name';
const FILE_TREE_NODE_CHILDREN = 'children';
let FileTree = {};
let FileList = [];
let CurrentPicture = '';
let AlbumPath = '';
let AlbumName = '';
let Album_Data = null;
let ImageHandlingSettings = {};

let ImageExtensions = [
'tif'
,'tiff'
,'gif'
,'jpeg'
,'jpg'
,'jif'
,'jfif'
,'jp2'
,'jpx'
,'j2k'
,'j2c'
,'png'
];
//let CliData = electron.remote.getCurrentWindow().cliData; // parameters from the command line
let CliData = remote.getCurrentWindow().cliData; // parameters from the command line

// check the filename extension against the list of image file extensions
function isImage(fname)
{
    let ext = pathLib.extname(fname).toLowerCase().replace('.','');
    console.log('looking for :%s:',ext);
    return(ImageExtensions.indexOf(ext) > 0);
} // isImage

// List all files in a directory in Node.js recursively in a synchronous fashion
// base code from from https://gist.github.com/kethinov/6658166
// modified to build a data structure for the electron-tree-view
function walkSync (dir, fileTree,fileList) {
  var getFiles = fsLib.readdirSync(dir);
  getFiles.forEach(function(file) {
      if (fsLib.statSync(dir + '/' + file).isDirectory()) {
          if((file == 'thumbnails') || (file == 'webpage')) return;  // skip folders I made
          //fileTree = walkSync(dir + '/' + file + '/', fileTree);
      }
      else {
          if(!isImage(file)) return; // only show image files
          let pathParts = pathLib.parse(dir + '/' + file);
          let node = {};
          node[FILE_TREE_NODE_LABEL] = pathParts.base;
          node[FILE_TREE_NODE_CHILDREN] =  [];
          fileTree[FILE_TREE_NODE_CHILDREN].push(node);
          fileList.push(pathParts.base);
          //logger('walkSync: file =:'+file +':')
      }
  });
  return fileTree;
} // walkSync

function makeThumbNails()
{
    //logger('makeThumbNails: START:');
    //for(var index=0,len=FileList.length; index<len; ++index) {
     for(var index=0,len=2; index<len; ++index) {
        let sourcePath = AlbumPath + '\\' + FileList[index];
        let destPath = AlbumPath + '\\thumbnails\\' + FileList[index];
        //logger('makeThumbNails: working on source :' + sourcePath + ':');
        //logger('makeThumbNails: working on dest :' + destPath + ':');
        thumb({
            source: sourcePath
            ,destination: destPath
            ,width: 300
            ,quiet: false
            ,overwrite: true
            ,concurrency: 4
        }).then(function() {
                console.log('Success');
                }).catch(function(e) {
                    console.log('Error', e);
                });

          /*
          function(files, err, stdout, stderr)
          {
            logger('makeThumbNails: source file ' + sourcePath + ' done!');
            logger('makeThumbNails: dest file ' + destPath + ' done!');
          }
    );
    */
    //logger('makeThumbNails: working on :' + sourcePath + ': done');
    } // for FileList
} // makeThumbNails

   /*
   file tree format
   const root = {
     "name": "root"
     ,"children" : [
         { "name": "bar", "children": [] }
         ,{ "name": "foo", "children": [] }
         ,{ "name": "nyarf", "children": [] }
     ]
   }
   */
function makeImageFileTree(evt)
{
    logger('selectAlbum clicked');
    remote.dialog.showOpenDialog({
        'title':"Select a folder"
        ,'defaultPath': 'C:'
        ,'properties': ["openDirectory"]
    }, (folderPaths) => {
        // folderPaths is an array that contains all the selected paths
        if(folderPaths === undefined) {
            logger("showOpenDialog: No destination folder selected");
            return;
        }
        else {
            //we only use the first selected path
            // example AlbumPath  /home/kent/projects/photo-collection-manager/electron/TestData
            // example Album  :TestData

            AlbumPath = folderPaths[0];
            let pathParts = pathLib.parse(AlbumPath);
            AlbumName = pathParts.base;
            let albumData = new MakeReadAlbumData(AlbumPath);
            Album_Data = albumData.get();
            logger('showOpenDialog: AlbumPath:' + AlbumPath + ': AlbumName:' + AlbumName+':');
            logger('makeImageFileTree loaded album data');
            //logger('makeImageFileTree: Album_Data:' + JSON.stringify(Album_Data,null,'\t'));
            $('#albumName').val(AlbumName);

            FileTree[FILE_TREE_NODE_LABEL] = pathParts.base;
            FileTree[FILE_TREE_NODE_CHILDREN] = [];
            walkSync(AlbumPath, FileTree,FileList);  // build data structure of file folder
            // makeThumbNails();

            let tree = require('electron-tree-view')({
            root       : FileTree
            ,container : document.querySelector('.container')
            ,children  : c => c[FILE_TREE_NODE_CHILDREN]
            ,label     : c => c[FILE_TREE_NODE_LABEL]
            });

            tree.on('selected', item => {
                logger('tree: item selected:' + item.name + ':')
                let fullPath = AlbumPath + '/' + item.name;
                if (fsLib.statSync(fullPath).isDirectory()) {
                    return;
                }

                logger('tree: full path :' + fullPath + ':')
                CurrentPicture = item.name;
                logger('tree: CurrentPicture :' + CurrentPicture + ':')
                showPicture(CurrentPicture);
            });

            logger('showOpenDialog: after walkSync');
            //logger('showOpenDialog: fileTree:' + JSON.stringify(fileTree,null,'\t'));
        }
    });
} // makeImageFileTree

function showPicture(fname)
{
    console.log('showPicture: fname = :%s:',fname);
	var newImg = new Image();
    logger('showPicture: Album_Data[images][fname]:' + JSON.stringify(Album_Data['images'][fname],null,'\t'));
	let filename = Album_Data['images'][fname]['filename'];
	console.log('showPicture: filename is :%s:',filename);
	newImg.src = filename;
    newImg.onload = function() {
		ImageFaceHandling.showPicture(fname);
		console.log ('showPicture: onLoad: The image natural size is %s(width) %s (height)',
		    newImg.naturalWidth , newImg.naturalHeight);
		ImageFaceHandling.drawFaces(fname);
	} 
    $('#currentPicture').attr('src', fname);
    $('#currentPicture').css('visibility','visible');
} // showPicture

function findPicture()
{
    logger('findPicture: START ');
    return(FileList.indexOf(CurrentPicture));
} // findPicture

function nextPicture(evt)
{
    logger('nextPicture: START ');
    logger('nextPicture: FileList.length=' + FileList.length)
    let index = findPicture(CurrentPicture);
    logger('nextPicture: initial index=' + index)
    index++;
    if(index >= FileList.length) index = 0;
    logger('nextPicture: final index=' + index);
    let path = AlbumPath + '/' + FileList[index];
    CurrentPicture = FileList[index];
    logger('nextPicture: path=' + path);
    showPicture(path);
} // nextPicture

function prevPicture(evt)
{
    logger('prevPicture: START ');
    logger('prevPicture: FileList.length=' + FileList.length);
    let index = findPicture(CurrentPicture);
    logger('prevPicture: initial index=' + index)
    index--;
    if(index <= 0) index = FileList.length-1;
    logger('prevPicture: final index=' + index);
    let path = AlbumPath + '/' + FileList[index];
    CurrentPicture = FileList[index];
    logger('prevPicture: path=' + path);
    showPicture(path);
} // prevPicture

$(document).ready(function() {
   logger('init: START ');

   logger('ready: cliData.debug -> :'+ CliData.debug +':');
   logger('ready: cliData.album -> :'+ CliData.album +':');
   logger('ready: cliData.AppPath -> :'+ CliData.AppPath +':');

   let settings = new SettingsForm('settingsForm','openSettings',100,250,'right');
   settings.initializeForm();

    ImageHandlingSettings = {
      wrapperID: 'pictureDisplay'
        ,albumName: 'TestAlbum'
	    ,lineWidth : 1
	    ,strokeStyle : '#FF0000'
    };
	ImageFaceHandling.init(ImageHandlingSettings);
	ImageFaceHandling.showConfig();
	ImageFaceHandling.setup();

    /*
   ErrorDialog = $('#dialog-dataerror').dialog({
      autoOpen: false
      ,height: 300
      ,width: 350
      ,modal: true
   });
   */

   let mainWindow; //do this so that the window object doesn't get GC'd


   $('#selectAlbum').click(makeImageFileTree);
   $('#prevImage').click(prevPicture)
   $('#nextImage').click(nextPicture)

   var copyRightYear = new Date().getFullYear();
   logger('init:  copyRightYear=:'+copyRightYear+':');
   $('.copyright span').html(copyRightYear);
}); // ready function

function logger(str)
{
    if(window.console && console.log) console.log('PCM: ' + str);
} // logger
