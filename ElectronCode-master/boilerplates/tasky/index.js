const path = require('path'); // path module
const electron = require('electron');
const TimerTray = require('./app/timer_tray');
const MainWindow = require('./app/main_window');

const { app, ipcMain } = electron;

let mainWindow;
let tray;

app.on('ready', () => {
  process.platform === 'darwin' ? app.dock.hide() : true ;
  mainWindow = new MainWindow( __dirname + `/src/index.html`);
  //mainWindow = new MainWindow();
  //mainWindow.loadURL(__dirname + `/src/index.html`);

  const iconName = process.platform === 'win32' ? 'windows-icon.png' : 'iconTemplate.png'
  const iconPath = path.join(__dirname, `./src/assets/${iconName}`); // the correct path
  tray = new TimerTray(iconPath, mainWindow);
});

ipcMain.on('update-timer',(event, timeLeft) => {
  tray.setTitle(timeLeft);
});