// this code handles all interactions with the host operating system
// this is the 'server' process
          //,accelerator: 'CmdOrCtrl+Shift+Q'

global.__base = __dirname + '/';
const {app, BrowserWindow,Menu} = require('electron');
const { ipcMain } = require('electron')
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
    .command('FrontPrefix', 'first part of file name of front images')
    .command('BackPrefix', 'first part of file name of back images')
    .example('$0 --debug --album full/path/to/album', 'Load in the specified album')
    .alias('album', 'album')
    .describe('album', 'Load an album')
    .help('h')
    .alias('h', 'help')
    .argv;

  console.log('MAIN: processArgs : argv %s', JSON.stringify(argv,null,'\t'));
  CliData['debug'] = argv.debug;
  CliData['AppPath'] = app.getAppPath();
  CliData['album'] = argv.album;
  CliData['FrontPrefix'] = argv.FrontPrefix;
  CliData['BackPrefix'] = argv.BackPrefix;
  console.log('MAIN: processArgs Done: CliData %s', JSON.stringify(CliData,null,'\t'));
} //processArgs

function createWindow (app)
{
  console.log('MAIN: createWindow: START');
  processArgs(app);
  console.log('MAIN: createWindow: after processArgs');

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
    ,webPreferences : {
		preload: pathLib.join(__dirname, 'preload.js')
      ,nodeIntegration: true
      ,enableRemoteModule: true
      ,'title':"Select a folder"
      ,'defaultPath': 'C:'
      ,'properties': ["openDirectory"]
      //,contextIsolation: true
      //,sandbox: true
    }
  });

  // Load a URL in the window to the local index.html path
  let urlToLoad = 'file://' + __dirname + '/../Renderer/index.html';
  console.log('MAIN: createWindow: loading url ->%s', urlToLoad);
  MainWindow.loadURL(urlToLoad);

  global.CliData = CliData;  // make CLI data available to  the renderer
  if(CliData.debug) MainWindow.webContents.openDevTools({'mode' : 'undocked'}); // Open the DevTools as separate window
  console.log('MAIN: createWindow : global.CliData %s', JSON.stringify(global.CliData,null,'\t'));

  // Remove window once app is closed
  MainWindow.on('closed', () => { MainWindow = null; });

	ipcMain.on('select-dirs', async (event, arg) => {
  		console.log('MAIN: select-dirs received');
  		const result = await dialog.showOpenDialog(mainWindow, {
    		properties: ['openDirectory']
  		});
  		console.log('MAIN: directories selected :%s:', result.filePaths)
	});

  // Show window when page is ready
  MainWindow.once('ready-to-show', () => { 
    MainWindow.show();
  });

  //  require(`${__dirname}/mainMenu.js`);
  let menu = createMainMenu();
  console.log('MAIN: createWindow: got menu template');
  Menu.setApplicationMenu(menu); 
  console.log('MAIN: createWindow: menu set');
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
  				console.log('MAIN: Open Album: clicked');
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
          label:'Next Picture N | n | Right | Down'
         }
        ,{
          label:'Previous Picture P | p | Left | Up'
         }
        ,{type:'separator'} 
        ,{
          label:'Exit'
          ,role : 'quit'
          ,accelerator: 'CmdOrCtrl+Q'
          ,click() { 
            app.quit() 
          }
        } // exit menu item
      ]
    } // Menu top menu item
    ,{
        label: 'About'
            ,click() { 
              openAboutWindow();
            }
    } // About top menu item
  ]);
  return menu;
} // createMainMenu

function openAboutWindow()
{
  console.log('MAIN: openAboutWindow: START');
  if(AboutWindow) {
    AboutWindow.focus();
    return;
  }
  AboutWindow = new BrowserWindow({
     width : 500
    ,height: 400
    ,resizable : false
    ,title : 'ABOUT'
    ,minimizable : false
    ,fullscreenable : false
    ,backgroundColor: "#d7ef77" 
    ,webPreferences : {
      nodeIntegration: true
    }
  });
  AboutWindow.setMenuBarVisibility(false);
  if(CliData.debug) AboutWindow.webContents.openDevTools({'mode' : 'undocked'}); 

  let urlToLoad = 'file://' + __dirname + '/../Renderer/about.html';
  console.log('MAIN: openAboutWindow: loading url ->%s', urlToLoad);
  AboutWindow.loadURL(urlToLoad);

  AboutWindow.on('closed', () => { AboutWindow = null; });
} // openAboutWindow
