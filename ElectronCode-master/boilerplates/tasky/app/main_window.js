const electron = require('electron');
const { BrowserWindow } = electron;

class MainWindow extends BrowserWindow {    
    constructor(url) {
        super({
            height:500,
            width:300,
            frame: false,
            resizable: false,
            show: false,
            webPreferences: { backgroundThrottling: false }
        }); // not the best practice 

        this.on('blur', this.onBlur.bind(this));
        this.loadURL(url);
    }

    onBlur(){
        this.hide();
    }
}

module.exports = MainWindow;
