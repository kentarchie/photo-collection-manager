const electron = require('electron');
const path = require('path');
const fs = require('fs');

class AlbumDataHandler
{
  constructor()
  {
   // the album data is in a file called foldername.json in the albumPath folder
   console.log('AlbumDataHandler.constructor START');
   // extensions of allowed image files
   this._ImageExtensions = [ 'tif' ,'tiff' ,'gif' ,'jpeg' ,'jpg' ,'jif'
                         ,'jfif' ,'jp2' ,'jpx' ,'j2k' ,'j2c' ,'png'
   ];
   this.AlbumPath = '';
  } // constructor

  setupAlbumData() 
  {
      let pathParts = path.parse(this.AlbumPath);
      this.AlbumName = pathParts.base;
      this.FullPath = path.join(this.AlbumPath, this.AlbumName + '.json');
      $('#albumName').val(this.AlbumName);
      console.log('AlbumDataHandler.setupAlbumData: album is :%s:',this.AlbumName);

      if (fs.existsSync(this.FullPath)) { //file exists
         console.log('AlbumDataHandler.setupAlbumData filePath (%s) exists',this.FullPath);
      }
  }; // setupAlbumData

  //TODO: this is written assuming we are on Linux, how should we deal with
  // file path designation on multiple OS's
  findAlbum(event, arg)
  {
    console.log('AlbumDataHandler.findAlbum: findAlbum message received');
    var that=this;
    remote.dialog.showOpenDialog({
        'title':"Select a folder"
        ,'defaultPath': 'C:'
        ,'properties': ["openDirectory"]
    }, (folderPaths) => {
        // folderPaths is an array that contains all the selected paths
        if(folderPaths === undefined) {
            logger("AlbumDataHandler.findAlbum.showOpenDialog: No destination folder selected");
            this.AlbumPath = '';
            return;
        }
        else {
            //we only use the first selected path
            // example AlbumPath  /home/kent/projects/photo-collection-manager/electron/TestData
            // example Album  :TestData

            console.log('AlbumDataHandler.findAlbum: before processAlbum');
            this.AlbumPath = folderPaths[0];
            logger('AlbumDataHandler.findAlbum: that:' + JSON.stringify(that,null,'\t'));
            console.log(this);
            console.log(that);
            this.setupAlbumData();
        }
    }); // showOpenDialog
    console.log('AlbumDataHandler.findAlbum: DONE');
  } // findAlbum

  setAlbumPath(album)
  {
      console.log('AlbumDataHandler.setAlbum: album is :%s:',album);
      this.AlbumPath = album;
      this.setupAlbumData();
  } // setAlbumPath

} // class AlbumDataHandler

// expose the class
module.exports = AlbumDataHandler;
