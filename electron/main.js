// this code handles all interactions with the host operating system
// this is the 'server' process

global.__base = __dirname + '/';
const {app, BrowserWindow,Menu} = require('electron');
const { ipcMain } = require('electron')
const settings = require('electron-settings');
const pathLib = require('path');

const DEFAULT_WIDTH = 1200;
const DEFAULT_HEIGHT = 700;
const DEBUG_WIDTH = 2000;
const DEBUG_HEIGHT = 800;

let MainWindow = null;
appEventHandling(app);

function appEventHandling(app)
{
  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  app.on('ready', () => {
    createWindow(app);
  });

  //create the application window if the window variable is null
  app.on('activate', () => {
    if (MainWindow === null) {
      createWindow(app);
    }
  });

  //quit the app once closed
  app.on('window-all-closed', function () {
    if (process.platform != 'darwin') {
      app.quit();
    }
  });
} // appEventHandling

 // process any command line args
 // for more options  handling, see https://github.com/yargs/yargs
function processArgs(app)
{
  let cliData = {};
  var copyRightYear = new Date().getFullYear();

  var argv = require('yargs')
    .usage('Usage: $0 <command> [options]')
    .command('debug', 'open browser debug window')
    .example('$0 --debug --album full/path/to/album', 'Load in the specified album')
    .alias('album', 'album')
    .describe('album', 'Load an album')
    .help('h')
    .alias('h', 'help')
    .epilog('copyright ' + copyRightYear)
    .argv;

  cliData.album='';
  cliData.debug=argv.debug;
  cliData['AppPath'] = app.getAppPath();
  cliData['album'] = argv.album;
  console.log('processArgs: cliData.album -> :%s:', cliData.album);
  console.log('processArgs: cliData.debug -> :%s:', cliData.debug);
  console.log('processArgs: cliData.AppPath -> :%s:', cliData.AppPath);
  return cliData;
} //processArgs

function createWindow (app)
{
  let cliData = processArgs(app);

  let winHeight = DEFAULT_HEIGHT;
  let winWidth = DEFAULT_WIDTH;

  if(cliData.debug) {
    winHeight = DEBUG_HEIGHT;
    winWidth = DEBUG_WIDTH;
  }

  // Create the main window
  MainWindow = new BrowserWindow({
     width : winWidth
    ,height: winHeight
    ,icon : pathLib.join(__dirname , 'images/TaskBar.png')
    ,backgroundColor: "#D6D8DC" // background color of the page, this prevents any white flickering
    ,show: false // Don't show the window until it's ready, this prevents any white flickering
  });

  // Load a URL in the window to the local index.html path
  let urlToLoad = 'file://' + __dirname + '/app/index.html';
  console.log('createWindow: loading url ->', urlToLoad);
  MainWindow.loadURL(urlToLoad);

  MainWindow.cliData = cliData;  // make CLI data available to  the renderer
  if(cliData.debug) MainWindow.webContents.openDevTools(); // Open the DevTools.

  // Remove window once app is closed
  MainWindow.on('closed', () => { MainWindow = null; });

  // Show window when page is ready
  MainWindow.once('ready-to-show', () => { 
    MainWindow.show();
    if(cliData.album != '') MainWindow.webContents.send('open-album', 'click!'); 
  });

  //  require(`${__dirname}/mainMenu.js`);
  let menu = createMainMenu();
  console.log('createWindow: got menu template');
  Menu.setApplicationMenu(menu); 
  console.log('createWindow: menu set');
} // createWindow

function createMainMenu()
{
  let menu = Menu.buildFromTemplate([
    {
      label: 'Menu'
      ,submenu: [
        {
          label:'Open Album'
          ,click() { 
            // run the open album code on the renderer
            MainWindow.webContents.send('open-album', 'click!'); 
          }
        }
        ,{
          label:'Settings'
          ,click() { 
          }
        }
        ,{
          label:'Toggle Debug'
          ,accelerator: process.platform === 'darwin' ? 'Alt+Command+I' : 'Ctrl+Shift+I'
          ,click (item, focusedWindow) {
            if (focusedWindow) focusedWindow.webContents.toggleDevTools();
          }
        }
        ,{type:'separator'} 
        ,{
          label:'Exit'
          ,role : 'quit'
          ,accelerator: 'CmdOrCtrl+Shift+Q'
          ,click() { 
            app.quit() 
          }
        } // exit menu item
      ]
    } // Menu top menu item
    ,{
        label: 'About'
    } // About top menu item
  ]);
  return menu;
} // createMainMenu