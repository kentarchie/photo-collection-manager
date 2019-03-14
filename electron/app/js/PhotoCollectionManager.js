
const {remote} = require('electron');
const { ipcRenderer } = require('electron')
const fsLib = require('fs');
const pathLib = require('path');
const thumb = require('node-thumbnail').thumb;
const MakeReadAlbumData = require(`${__dirname}/js/MakeReadAlbumData.js`);
const ImageDisplayManagement = require(`${__dirname}/js/ImageDisplayManagement.js`);

// used in the file tree viewer
const FILE_TREE_NODE_LABEL = 'name';
const FILE_TREE_NODE_CHILDREN = 'children';
let FileTree = {};
let FileList = [];

let CurrentPicture = '';  // image we are working on
let AlbumPath = ''; // full path to the directory containing the album
let AlbumName = ''; // name of the directory containing the album
let Album_Data = null; // contents of the JSON file describing the album
let ImageHandlingSettings = {};
let ImageDisplay = null;

// extensions of allowed image files
let ImageExtensions = [ 'tif' ,'tiff' ,'gif' ,'jpeg' ,'jpg' ,'jif'
                        ,'jfif' ,'jp2' ,'jpx' ,'j2k' ,'j2c' ,'png'
];
let CliData = remote.getCurrentWindow().cliData; // parameters from the command line

// check the filename extension against the list of image file extensions
function isImage(fname)
{
    let ext = pathLib.extname(fname).toLowerCase().replace('.','');
    //console.log('looking for :%s:',ext);
    return(ImageExtensions.indexOf(ext) > 0);
} // isImage

// List all files in a directory in Node.js recursively in a synchronous fashion
// base code from from https://gist.github.com/kethinov/6658166
// modified to build a data structure for the electron-tree-view
// TODO: not recursive, should thisprocess sub directories of images? 
function walkSync (dir, fileTree,fileList,postAction) {
  var getFiles = fsLib.readdirSync(dir);
  getFiles.forEach(function(file) {
      if (fsLib.statSync(dir + '/' + file).isDirectory()) {
          if((file == 'thumbnails') || (file == 'webpage')) return;  // skip folders I made
          return(walkSync(dir + '/' + file + '/', fileTree,fileList,postAction));
      }
      else {
          if(!isImage(file)) return; // only show image files
          let pathParts = pathLib.parse(dir + '/' + file);
          let node = {};
          node[FILE_TREE_NODE_LABEL] = pathParts.base;
          node[FILE_TREE_NODE_CHILDREN] =  [];
          fileTree[FILE_TREE_NODE_CHILDREN].push(node);
          fileList.push(pathParts.base);
      }
  });
  console.log('walkSync: fileList length = %d',fileList.length);
  console.log('walkSync: FileList length = %d',FileList.length);
  postAction();
  return fileTree;
} // walkSync

// not currently used. If we do this here, remove thumnail production from the AlbumPreProcess code
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
  //TODO: tghis is written assuming we are on Linux, how should we deal with
  // file path designation oon multiple OS's
function makeImageFileTree(evt)
{
    logger('makeImageFileTree: START');
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
            ImageDisplay.init(AlbumPath);
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
            walkSync(AlbumPath, FileTree,FileList,() => {
                ImageDisplay.setFileList(FileList);
            });  // build data structure of file folder
            console.log('makeImageFileTree: FileList length = %d',FileList.length);
            // makeThumbNails();

            let tree = require('electron-tree-view')({
                root       : FileTree
                ,container : document.querySelector('.container')
                ,children  : c => c[FILE_TREE_NODE_CHILDREN]
                ,label     : c => c[FILE_TREE_NODE_LABEL]
            });

            // what to do when an image is selected from the file tree
            tree.on('selected', item => {
                logger('tree: item selected:' + item.name + ':')
                let fullPath = AlbumPath + '/' + item.name;
                if (fsLib.statSync(fullPath).isDirectory()) { // skip directories
                    logger('tree: clicked on directory');
                    return;
                }

                logger('tree: full path :' + fullPath + ':')
                CurrentPicture = item.name;
                logger('tree: CurrentPicture :' + CurrentPicture + ':')
                ImageDisplay.pictureSelected(CurrentPicture);
            });

            logger('showOpenDialog: after walkSync');
            //logger('showOpenDialog: fileTree:' + JSON.stringify(fileTree,null,'\t'));
        }
    }); // showOpenDialog
} // makeImageFileTree

$(document).ready(function() {
   logger('ready: START ');

    ImageDisplay = new ImageDisplayManagement('PATH');
    $('#prevImage').click((evt) => {
        ImageDisplay.nextPrevPicture(evt);
    });
    $('#nextImage').click((evt) => {
        ImageDisplay.nextPrevPicture(evt);
    });
    console.log('ready: after next/prev setup');

    ImageHandlingSettings = {
      wrapperID: 'pictureDisplay'
        ,albumName: 'TestAlbum'
	    ,lineWidth : 1
	    ,strokeStyle : '#FF0000'
    };
	ImageFaceHandling.init(ImageHandlingSettings);
	ImageFaceHandling.showConfig();
    ImageFaceHandling.setup();
    console.log('ready: after ImageFaceHandling setup');

    /*
   ErrorDialog = $('#dialog-dataerror').dialog({
      autoOpen: false
      ,height: 300
      ,width: 350
      ,modal: true
   });
   */

   let mainWindow; //do this so that the window object doesn't get GC'd

   ipcRenderer.on('open-album', (event, arg) => {
        makeImageFileTree();
        console.log('ready: album select setup');
    })

   var copyRightYear = new Date().getFullYear();
   logger('init:  copyRightYear=:'+copyRightYear+':');
   $('.copyright span').html(copyRightYear);
}); // ready function

function logger(str)
{
    if(window.console && console.log) console.log('PCM: ' + str);
} // logger