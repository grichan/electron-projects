const electron = require('electron');

const { app, BrowserWindow, Menu, ipcMain } = electron; // distructure

let mainWindow; // global var
let addWindow;

app.on('ready', () =>{
  mainWindow = new BrowserWindow({});
  mainWindow.loadURL(__dirname + `/main.html`);
  mainWindow.on('closed', () => app.quit());

  const mainMenu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(mainMenu);
});

function createAddWindow() {
  addWindow = new BrowserWindow({
    width: 300,
    height: 200,
    title: 'Add New Todo'
  });
  addWindow.loadURL( __dirname + `/add.html`)
  addWindow.on('closed', () => addWindow = null); // garbage collector
}

function clearTodoList() {
  mainWindow.webContents.send('todo:clear');
}

// add recive
ipcMain.on('todo:add', (event, todo) => { // recive
  mainWindow.webContents.send('todo:add', todo); // send to the main window
  addWindow.close();
});


// MENU --------------
const menuTemplate = [
  {
    label: 'File',
    submenu: [
      {
         label: 'New Todo',
         click() { createAddWindow();}
       },
      {
        label: 'Clear List',
        click() { clearTodoList(); }
       },
      {
        label: 'Quit',
        accelerator: 'CommandOrControl+Q', // terenary expression
        click() {
          app.quit();
        }
     }
    ]
  }
];

if ( process.platform === 'darwin') { // MAC OS check
    menuTemplate.unshift({});
}

if (process.env.NODE_ENV !== 'production') {
  menuTemplate.push({
    label: 'DEVELOPER',
    submenu: [
      { role: 'reload' }, // predefined role
      {
        label: 'Toggle Developer Tools',
        accelerator: 'F12',
        click(item, focusedWindow){
          focusedWindow.toggleDevTools();

        }
      }
    ]
  })
}

// 'production'
// 'development'
// 'staging'
// 'test'
