const {app, BrowserWindow} = require('electron');
const path = require('path');
const url = require('url');
const yargs = require('yargs');

let mainWindow = null;

function createWindow ()
{
  // for more options  handling, see https://github.com/yargs/yargs
  let cliData = {};
  var argv = require('yargs')
    .usage('Usage: $0 -debug -album album_name')
    .argv;
  if(!argv.debug) argv.debug=false;
  cliData.debug=argv.debug;
  cliData.album=argv.album;
  console.log('createWindow: argv.debug ->', argv.debug);
  console.log('createWindow: argv.album ->', argv.album);

  // Create a new window
  mainWindow = new BrowserWindow({
    width: 1200
    ,height: 700
    // Set the default background color of the window to match the CSS
    // background color of the page, this prevents any white flickering
    ,backgroundColor: "#D6D8DC"
    // Don't show the window until it's ready, this prevents any white flickering
    ,show: false
    ,webPreferences : {
      nodeIntegration : false
    }
  });
  /*mainWindow.loadURL('http://localhost:5262');*/ // Specify entry point
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
