const { app, BrowserWindow } = require('electron')
require('dotenv').config()

const [ bin, scriptname, filename ] = process.argv

console.log(`Filename is : ${filename}`)

const windows = {main: null}

app.on('ready', () => {
  const win = new BrowserWindow({
    webPreferences: {nodeIntegration: true},
    autoHideMenuBar: true,
    width: 800,
    height: 600,
    resizable: true
  })

  win.loadFile(`${__dirname}/app/index.html`)
  win.on('closed', () => windows.main = null)

  win.webContents.on('did-finish-load', () => {
    console.log('IT LOADED')
    win.webContents.send('file-load', filename)
  })

  windows.main = win
})
