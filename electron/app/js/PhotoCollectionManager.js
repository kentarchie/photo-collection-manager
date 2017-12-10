const {dialog} = require('electron').remote;
const fsLib = require('fs');
const pathLib = require('path');
const FILE_TREE_NODE_LABEL = 'name';
const FILE_TREE_NODE_CHILDREN = 'children';

// List all files in a directory in Node.js recursively in a synchronous fashion
// base code from from https://gist.github.com/kethinov/6658166
// modified to build a data structure for the electron-tree-view
function walkSync (dir, fileTree) {
  fileTree = fileTree || [];
  var getFiles = fsLib.readdirSync(dir);
  getFiles.forEach(function(file) {
      if (fsLib.statSync(dir + '/' + file).isDirectory()) {
          if((file == 'thumbnails') || (file == 'webpage')) return;
          fileTree = walkSync(dir + '/' + file + '/', fileTree);
      }
      else {
          fileTree.push(file);
          logger('walkSync: file =:'+file +':')
      }
  });
  return fileTree;
}

function walkSync2 (dir, fileTree) {
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
          logger('walkSync: file =:'+file +':')
      }
  });
  return fileTree;
} // walkSync2

$(document).ready(function() {
   logger('init: START ');

   const root3 = {
     "name": "root"
     ,"children" : [
     ]
   }

   const root2 = {
     "name": "root"
     ,"children" : [
         { "name": "bar", "children": [] }
         ,{ "name": "foo", "children": [] }
         ,{ "name": "nyarf", "children": [] }
     ]
   }

   const root = {
  name: 'foo',
  children: [{
    name: 'bar',
    children: [{
      name: 'bar',
      children: []
    }, {
      name: 'baz',
      children: []
    }]
  }]
}

   ErrorDialog = $('#dialog-dataerror').dialog({
      autoOpen: false
      ,height: 300
      ,width: 350
      ,modal: true
   });

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
              logger('showOpenDialog: folderPaths:' + folderPaths);
              logger('showOpenDialog: album:' + pathParts.base);
              $('#albumName').val(pathParts.base);

              let fileTree = {};
              fileTree[FILE_TREE_NODE_LABEL] = pathParts.base;
              fileTree[FILE_TREE_NODE_CHILDREN] = [];
              walkSync2 (folderPaths[0], fileTree);

              let tree = require('electron-tree-view')({
                root       : fileTree
                ,container : document.querySelector('.container')
                ,children  : c => c[FILE_TREE_NODE_CHILDREN]
                ,label     : c => c[FILE_TREE_NODE_LABEL]
              });
              tree.on('selected', item => {
                  logger('tree: item selected:' + item.name + ':')
              });

              logger('showOpenDialog: after walkSync');
              logger('showOpenDialog: fileTree:' + JSON.stringify(fileTree,null,'\t'));
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
