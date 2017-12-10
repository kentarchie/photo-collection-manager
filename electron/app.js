const {app, BrowserWindow} = require('electron');
const path = require('path');
const url = require('url');

let mainWindow = null;

function createWindow ()
{
  // Create a new window
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 700,
    // Set the default background color of the window to match the CSS
    // background color of the page, this prevents any white flickering
    backgroundColor: "#D6D8DC",
    // Don't show the window until it's ready, this prevents any white flickering
    show: false
  });
  mainWindow.loadURL('http://localhost:5262'); // Specify entry point

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
  mainWindow.webContents.openDevTools();

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