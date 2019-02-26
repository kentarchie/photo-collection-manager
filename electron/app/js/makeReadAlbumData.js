const electron = require('electron');
const path = require('path');
const fs = require('fs');

class MakeReadAlbumData 
{
  constructor(albumPath)
  {
    // the album data is in a file called foldername.json in the albumPath folder
    console.log('MakeReadAlbumData.constructor START (%s)',albumPath);
    let pathParts = path.parse(albumPath);
    this.albumName = pathParts.base;
    this.fullPath = path.join(albumPath, this.albumName + '.json');
    this.saved = true;
    console.log('MakeReadAlbumData.constructor albumName (%s)',this.albumName);
    
    // initial load of file data
    this.data = this.parseDataFile();
  } // constructor
  
  // This will just return the property on the `data` object
  get(key)
  {
    console.log('MakeReadAlbumData.get(key) key=(%s)',key);
    return this.data[key];
  } // get

  // get whole JSON object
  get()
  {
    console.log('MakeReadAlbumData.get()');
    return this.data;
  } // get
  
  // ...and this will set it
  set(key, val)
  {
    this.data[key] = val;
    this.saved = false;
  } // set

  // dump the in-memory object back to the file
  save()
  {
    try {
        fs.writeFileSync(this.fullPath, JSON.stringify(this.data,null,'\t'));
        this.saved = true;
        return this.saved;
    } catch(error) {
        console.error('album file (%s) failed, error is (%s)',this.fullPath, error);
        this.saved = false;
        return this.saved;
    }
  } // save

// if there is no album file in a new album, we create it
// fs.readFileSync will return a JSON string which we then parse into a Javascript object
parseDataFile()
{
    let fileContents = '';
    try {
        if (fs.existsSync(this.fullPath)) { //file exists
            console.log('MakeReadAlbumData.parseDataFile filePath (%s) exists',this.fullPath);
            try {
                fileContents = fs.readFileSync(this.fullPath);
                console.log('parseDataFile: fileContents (%s)',fileContents);
            } catch(error) {
                console.error('album data file (%s) read failed error is (%s)',this.fullPath, error);
                return 'EMPTY';
            }

            try {
                return JSON.parse(fileContents);
            } catch(error) {
                console.error('album data file (%s) parse failed error is (%s)',this.fullPath, error);
                return 'EMPTY';
            }
        } // file exists
        else {
            console.log('MakeReadAlbumData.parseDataFile filePath (%s) MISSING',this.fullPath);
        }
    } catch(error) {
        console.error('album data file (%s) read/parse failed error is (%s)',this.fullPath, error);
        return 'EMPTY';
    }
} // parseDataGFile
} // class MakeReadAlbumData

// expose the class
module.exports = MakeReadAlbumData;