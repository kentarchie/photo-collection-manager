// this code handles all interactions with the host operating system
// this is the 'server' process

const {app, BrowserWindow} = require('electron');
//const path = require('path');
//const url = require('url');
//const dialog = require('electron').remote;
//const fsLib = require('fs');
//const pathLib = require('path');
//const thumb = require('node-thumbnail').thumb;

const DEFAULT_WIDTH = 1200;
const DEFAULT_HEIGHT = 700;
const DEBUG_WIDTH = 1800;
const DEBUG_HEIGHT = 800;

let mainWindow = null;

function createWindow ()
{
  // process any command line args
  // for more options  handling, see https://github.com/yargs/yargs
  let cliData = {};
  var argv = require('yargs')
    .usage('Usage: $0 [-debug] -album album_name')
    .argv;

  //if(!argv.debug) argv.debug=false;
  cliData.debug=argv.debug;
  cliData.album=argv.album;
  console.log('createWindow: argv.debug ->', argv.debug);
  console.log('createWindow: argv.album ->', argv.album);

  let winHeight = DEFAULT_HEIGHT;
  let winWidth = DEFAULT_WIDTH;

  if(cliData.debug) {
    winHeight = DEBUG_HEIGHT;
    winWidth = DEBUG_WIDTH;
  }

  // Create the main window
  mainWindow = new BrowserWindow({
     width : winWidth
    ,height: winHeight
    ,backgroundColor: "#D6D8DC" // background color of the page, this prevents any white flickering
    ,show: false // Don't show the window until it's ready, this prevents any white flickering
  });

  // Load a URL in the window to the local index.html path
  let urlToLoad = 'file://' + __dirname + '/app/index.html';
  console.log('createWindow: loading url ->', urlToLoad);
  mainWindow.loadURL(urlToLoad);

  mainWindow.cliData = cliData;

  // Remove window once app is closed
  mainWindow.on('closed', function () {
      mainWindow = null;
    });

  // Open the DevTools.
  if(cliData.debug) mainWindow.webContents.openDevTools();

  // Show window when page is ready
  mainWindow.once('ready-to-show', () => {
    /*
    if(!configuration.readSettings('debug'))
    {
      configuration.saveSettings('debug',false);
      configuration.saveSettings('pictureBase','C:/pictures');
    }
    */
    mainWindow.show()
  });
} // createWindow

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

//create the application window if the window variable is null
app.on('activate', () => {
  if (mainWindow === null) {
  createWindow()
  }
});

//quit the app once closed
app.on('window-all-closed', function () {
  if (process.platform != 'darwin') {
  app.quit();
  }
});