const electron = require('electron');
const ffmpeg = require('fluent-ffmpeg');
const { app, BrowserWindow, ipcMain } = electron;

let mainWindow;

app.on('ready', () => { // whenever app is loaded
  //console.log('App is now ready ');
  mainWindow = new BrowserWindow({});
  mainWindow.loadURL( __dirname + '/index.html'); // load layput

});

ipcMain.on('video:submit', (event, path) => {
  ffmpeg.ffprobe(path, (err, metadata) => {
    //console.log('Video duration is:', metadata.format.duration);
    mainWindow.webContents.send('video:duration', metadata.format.duration);
    // send to view
  });
});

/*
    Note: methods of communication between electron and view
    ____________                                                 ___________________
                | <- ipcMain.on ------------- ipcRenderer.send  |
    Electron App|                                               | MainWindow (layout)
                | mainWindow.webContents.send ---> ipcRenererOn |

*/
