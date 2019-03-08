// this code handles all interactions with the host operating system
// this is the 'server' process

global.__base = __dirname + '/';
const {app, BrowserWindow,Menu} = require('electron');
const { ipcMain } = require('electron')

const DEFAULT_WIDTH = 1200;
const DEFAULT_HEIGHT = 700;
const DEBUG_WIDTH = 1800;
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
  var argv = require('yargs')
    .usage('Usage: $0 [-debug]')
    .argv;

  cliData.debug=argv.debug;
  console.log('createWindow: argv.debug ->', argv.debug);
  cliData['AppPath'] = app.getAppPath();
  console.log('ready: cliData.debug -> :%s:', cliData.debug);
  console.log('ready: cliData.AppPath -> :%s:', cliData.AppPath);
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
  MainWindow.once('ready-to-show', () => { MainWindow.show() });

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
                  if (focusedWindow) focusedWindow.webContents.toggleDevTools()
                }
             }
            ,{type:'separator'} 
            ,{
              label:'Exit'
              ,role : 'quit'
             ,click() { 
                    app.quit() 
              }
              ,accelerator: 'CmdOrCtrl+Shift+Q'
            } // exit menu item
        ]
    } // Menu top menu item
    ,{
        label: 'About'
    } // About top menu item
  ]);
  return menu;
} // createMainMenu