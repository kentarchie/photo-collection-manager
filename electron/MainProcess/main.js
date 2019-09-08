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
let AboutWindow = null
let CliData = {};  // hold command line parameters
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

  CliData['debug'] = argv.debug;
  CliData['AppPath'] = app.getAppPath();
  CliData['album'] = argv.album;
  console.log('processArgs: CliData %s', JSON.stringify(CliData,null,'\t'));
} //processArgs

function createWindow (app)
{
  processArgs(app);

  let winHeight = DEFAULT_HEIGHT;
  let winWidth = DEFAULT_WIDTH;

  /*
  if(CliData.debug) {
    winHeight = DEBUG_HEIGHT;
    winWidth = DEBUG_WIDTH;
  }
  */

  // Create the main window
  MainWindow = new BrowserWindow({
     width : winWidth
    ,height: winHeight
    ,icon : pathLib.join(__dirname , 'images/TaskBar.png')
    ,backgroundColor: "#D6D8DC" // background color of the page, this prevents any white flickering
    ,show: false // Don't show the window until it's ready, this prevents any white flickering
  });

  // Load a URL in the window to the local index.html path
  let urlToLoad = 'file://' + __dirname + '/../Renderer/index.html';
  console.log('createWindow: loading url ->%s', urlToLoad);
  console.log('TEST x= %d, y= %d',1,2);
  MainWindow.loadURL(urlToLoad);

  MainWindow.CliData = CliData;  // make CLI data available to  the renderer
  if(CliData.debug) MainWindow.webContents.openDevTools({'mode' : 'undocked'}); // Open the DevTools as separate window

  // Remove window once app is closed
  MainWindow.on('closed', () => { MainWindow = null; });

  // Show window when page is ready
  MainWindow.once('ready-to-show', () => { 
    MainWindow.show();
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
        ,submenu: [
          {
            label:'About'
            ,click() { 
              openAboutWindow();
            }
          }
        ]
    } // About top menu item
  ]);
  return menu;
} // createMainMenu

function openAboutWindow()
{
  console.log('openAboutWindow: START');
  if(AboutWindow) {
    AboutWindow.focus();
    return;
  }
  AboutWindow = new BrowserWindow({
     width : 500
    ,height: 400
    ,resizable : false
    ,title : ''
    ,minimizable : false
    ,fullscreenable : false
    ,backgroundColor: "#d7ef77" 
  });
  AboutWindow.setMenu(null);

  let urlToLoad = 'file://' + __dirname + '/app/about.html';
  console.log('openAboutWindow: loading url ->%s', urlToLoad);
  AboutWindow.loadURL(urlToLoad);

  AboutWindow.on('closed', () => { AboutWindow = null; });
} // openAboutWindow
