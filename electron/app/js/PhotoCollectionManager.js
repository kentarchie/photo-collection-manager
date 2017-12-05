const {dialog} = require('electron').remote;
var fs = require('fs');

$(document).ready(function() {
   logger('init: START ');

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
          if(folderPaths === undefined){
              logger("showOpenDialog: No destination folder selected");
              return;
          }
          else{
              logger('showOpenDialog: folderPaths:' + folderPaths);
              $('#albumName').val(folderPaths[0]);
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
