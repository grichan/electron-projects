const electron = require('electron');
const { Tray, app, Menu } = electron;

class TimerTray extends Tray {
    constructor(iconPath, mainWindow){
        super(iconPath); //calls trays constructor for default stuff

        this.mainWindow = mainWindow; // instance prop
        this.setToolTip('Its a timer Bitch!');
        this.on('click', this.onClick.bind(this)); // bind 
        // soo on trays 'click' event run this.onClick method...
        this.on('right-click', this.onRightClick.bind(this)); 
    }

    onClick( event, bounds){
        
    //console.log(bounds.x, bounds.y );
    // click event bounds
    const { x, y } = bounds;
    // Window height and width
    const { height, width} = this.mainWindow.getBounds();

    if ( this.mainWindow.isVisible() ) {
        this.mainWindow.hide();
    } else {
        const yPosition = process.platform === 'darwin' ? y : y - height;
      this.mainWindow.setBounds({
        x: x - width / 2,
        y: yPosition , // in IE6 no need to repeat y:y...
        height,
        width
      });
      this.mainWindow.show();
    }
    }

    onRightClick() {
        const menuConfig = Menu.buildFromTemplate([
            {
                label: 'Quit',
                click: () => app.quit()
            }
        ]);

        this.popUpContextMenu(menuConfig);
    }
}

module.exports = TimerTray;

