const {dialog} = require('electron').remote;
const fsLib = require('fs');
const pathLib = require('path');
const thumb = require('node-thumbnail').thumb;

const FILE_TREE_NODE_LABEL = 'name';
const FILE_TREE_NODE_CHILDREN = 'children';
let FileTree = {};
let FileList = [];
let CurrentPicture = '';
let AlbumPath = '';
let AlbumName = '';

// List all files in a directory in Node.js recursively in a synchronous fashion
// base code from from https://gist.github.com/kethinov/6658166
// modified to build a data structure for the electron-tree-view
function walkSync (dir, fileTree,fileList) {
  var getFiles = fsLib.readdirSync(dir);
  getFiles.forEach(function(file) {
      if (fsLib.statSync(dir + '/' + file).isDirectory()) {
          if((file == 'thumbnails') || (file == 'webpage')) return;
          //fileTree = walkSync(dir + '/' + file + '/', fileTree);
      }
      else {
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
    logger('makeThumbNails: START:');
    //for(var index=0,len=FileList.length; index<len; ++index) {
     for(var index=0,len=2; index<len; ++index) {
        let sourcePath = AlbumPath + '\\' + FileList[index];
        let destPath = AlbumPath + '\\tn\\' + FileList[index];
        logger('makeThumbNails: working on source :' + sourcePath + ':');
        logger('makeThumbNails: working on dest :' + destPath + ':');
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
    logger('makeThumbNails: working on :' + sourcePath + ': done');
    } // for FileList
} // makeThumbNails

function showPicture(path)
{
    $('#currentPicture').attr('src', path);
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

   ErrorDialog = $('#dialog-dataerror').dialog({
      autoOpen: false
      ,height: 300
      ,width: 350
      ,modal: true
   });

   $('#prevImage').click(prevPicture)
   $('#nextImage').click(nextPicture)

   $('#selectAlbum').click(function(evt)
   {
       logger('selectAlbum clicked');
       dialog.showOpenDialog({
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
              let pathParts = pathLib.parse(folderPaths[0]);
              AlbumPath = folderPaths[0];
              logger('showOpenDialog: folderPaths:' + folderPaths);
              logger('showOpenDialog: album:' + pathParts.base);
              AlbumName = pathParts.base;
              $('#albumName').val(AlbumName);

              FileTree[FILE_TREE_NODE_LABEL] = pathParts.base;
              FileTree[FILE_TREE_NODE_CHILDREN] = [];
              walkSync(folderPaths[0], FileTree,FileList);
              makeThumbNails();

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
                  showPicture(fullPath);
              });

              logger('showOpenDialog: after walkSync');
              //logger('showOpenDialog: fileTree:' + JSON.stringify(fileTree,null,'\t'));
          }
      });
   });

   var copyRightYear = new Date().getFullYear();
   logger('init:  copyRightYear=:'+copyRightYear+':');
   $('.copyright span').html(copyRightYear);
}); // init function

function logger(str)
{
    if(window.console && console.log) console.log('PCM: ' + str);
} // logger
