const electron = require('electron')
const url = require('url')
const path = require('path')

const { app, BrowserWindow, Menu, ipcMain } = electron

//testing:
 const add = (x, y) => {
  return x+y
}

//SET ENV to 'production so the 'DevTools' menu disappear
process.env.NODE_ENV = 'production'

let mainWindow
let addWindow

app.setName('shoppingList');

function createWindow() {
  //Create new window
  mainWindow = new BrowserWindow(
    {
      width: 900, 
      height: 550,
      //Avoid the error: require is not defined
      webPreferences: {
        nodeIntegration: true
      }
    }
  )
  //Load HTML file into window. set url to be: file://dirname/mainWindow.html
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'mainWindow.html'),
    protocol: 'file:',
    slashes: true
  }))
  // mainWindow.loadURL(`file://${__dirname}/mainWindow.html`)//TODO: testing
  
  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
   app.quit()
  })

  
  Menu.setApplicationMenu(Menu.buildFromTemplate(template));

}

//Listen for the app to be ready
app.on('ready', createWindow)

//catch item:add sent from addWindow.html
ipcMain.on('item:add', (event, item) => {
  console.log('item:', item)//TODO: Delete later
  mainWindow.webContents.send('item:add', item)
  addWindow.close()
})


// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  //darwin will be the platform for mac
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

//Handle add window
function createAddWindow() {
  //Create new window
  addWindow = new BrowserWindow(
    {
      width: 300, 
      height: 200, 
      title: 'Add shopping list item',
      webPreferences: {
        nodeIntegration: true
      }
    }
  )

  //Load HTML file into window. set url to be: file://dirname/addWindow.html
  addWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'addWindow.html'),
    protocol: 'file:',
    slashes: true
  }))

  // addWindow.loadURL(`file://${__dirname}/addWindow.html`)//TODO: testing

//Garbage collection handle
  addWindow.on('closed', () => {
    addWindow = null
  })
}

const template = [
  {
      label: 'File',
      submenu: [
          {
            label: 'Add Item',
            accelerator: process.platform =='darwin' ? 'Command+shift+A' : 'Ctrl+shift+A',
            click(){
              createAddWindow()
            }
          },
          {
            label: 'Clear Items',
            accelerator: process.platform =='darwin' ? 'Command+shift+C' : 'Ctrl+shift+C',
            click(){
              mainWindow.webContents.send('items:clear')
            }
          },
          {
            label: 'Quit',
            //'darwin' will be the platform for mac
            accelerator: process.platform =='darwin' ? 'Command+Q' : 'Ctrl+Q',
            click(){
              app.quit()
            }
          }
      ]
  },
  {
      label: 'Edit',
      submenu: [
          {
              role: 'undo'
          },
          {
              role: 'redo'
          },
          {
              type: 'separator'
          },
          {
              role: 'cut'
          },
          {
              role: 'copy'
          },
          {
              role: 'paste'
          },
          {
              role: 'delete'
          },
          {
              role: 'selectall'
          }
      ]
  }
];
//If mac add empty object to menu
if(process.platform == 'darwin') {
  template.unshift({label:''})
}

//Add developer tools items if not in production 
if(process.env.NODE_ENV !== 'production'){
  template.push({
    label: 'Dev Tools',
    submenu: [
      {
        label: 'Toggle DevTools',
        accelerator: process.platform =='darwin' ? 'Command+I' : 'Ctrl+I',
        click(item, focusedWindow){
          focusedWindow.toggleDevTools()
        }
      },
      {
        role: 'reload'
      }
    ]
  })
}

module.exports = {add}