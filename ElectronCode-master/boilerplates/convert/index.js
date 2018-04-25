const electron = require('electron');
const ffmpeg = require('fluent-ffmpeg');
const _ = require('lodash') 
// _ is a utility library for iteration over common arrays and objects

const { app, BrowserWindow, ipcMain, shell } = electron;

let mainWindow;

app.on('ready', ()=> {
    mainWindow = new BrowserWindow({
        heigth: 600,
        width: 800,
        webPreferences: { backgroundThrottling: false }
    });
    mainWindow.loadURL( 'file://' + __dirname + `/src/index.html`);
})
// ipcMain.on('videos:added', (event, videos) => {
//     console.log(videos);
//     const promise = new Promise( (resolve, reject) => {
//         ffmpeg.ffprobe(videos[0].path, (err, metadata) => {
//             resolve(metadata);
//             //had to fix paths because I changed folder ( undefined )
//         });
//     });

//     promise.then((metadata) => { console.log(metadata);})
// });

ipcMain.on('videos:added', (event, videos) => {
    // promise for every video in array
    // returns array of promises
    const promises = _.map(videos, video => {
        return new Promise(( resolve, reject) => {
            ffmpeg.ffprobe(video.path, (err, metadata) => {
                video.duration = metadata.format.duration;
                video.format = 'avi';
                resolve(video);
                // ^ all props of video ^
            });
        });
    });
    //after every pr is resolved promise all will resolve
    Promise.all(promises).then((results) => {
        mainWindow.webContents.send('metadata:complete', results);
    });
    // log results for every video 

});

ipcMain.on('conversion:start', (event, videos) => { // here is the ERR
    _.each(videos , video => {
        var outputDirectory = video.path.split(video.name)[0];
        const outputName = video.name.split('.')[0];
        const outputPath = `${outputDirectory}${outputName}.${video.format}`;
        // console.log(outputDirectory);
    
        
        ffmpeg(video.path)
            .output(video.path)
            .on('progress', ( { timemark }) => 
                mainWindow.webContents.send('conversion:progress', { video, timemark})
            )
            .on('end', () => 
            mainWindow.webContents.send('conversion:end', { 
                video: video,
                outputPath: outputPath
                }))
            .run();
    })
    
});

ipcMain.on('folder:open', (event, outputPath) => {
    shell.showItemInFolder(outputPath);
});
