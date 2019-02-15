// this code handles all interactions with the host operating system
// this is the 'server' process

const {app, BrowserWindow} = require('electron');
const path = require('path');
const url = require('url');
//const configuration = require('./configuration');

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
  if(!argv.debug) argv.debug=false;
  cliData.debug=argv.debug;
  cliData.album=argv.album;
  console.log('createWindow: argv.debug ->', argv.debug);
  console.log('createWindow: argv.album ->', argv.album);

  let winHeight = (cliData.debug) ? DEBUG_HEIGHT : DEFAULT_HEIGHT;
  let winWidth =  (cliData.debug) ? DEBUG_WIDTH : DEFAULT_WIDTH;

  // Create the main window
  mainWindow = new BrowserWindow({
     width : winWidth
    ,height: winHeight
    // background color of the page, this prevents any white flickering
    ,backgroundColor: "#D6D8DC"
    ,show: false // Don't show the window until it's ready, this prevents any white flickering
    ,webPreferences : {
      nodeIntegration : false
    }
  });
  mainWindow.cliData = cliData;

  // Remove window once app is closed
  mainWindow.on('closed', function () {
      mainWindow = null;
    });

  // Load a URL in the window to the local index.html path
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'app/index.html'),
    protocol: 'file:',
    slashes: true
  }));

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
