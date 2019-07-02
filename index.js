const { app, BrowserWindow } = require('electron')
require('dotenv').config()

const FILENAME = 'index.html'

const windows = {main: null}

app.on('ready', () => {
  const win = new BrowserWindow({
    webPreferences: {nodeIntegration: true},
    width: 800,
    height: 600,
    resizable: true
  })

  if (process.env.NODE_ENV === 'develop') {
    console.log(process.env.WEBPACK_PORT)
    win.loadURL(`http://localhost:${process.env.WEBPACK_PORT}/${FILENAME}`)
  } else {
    win.loadFile(`${__dirname}/app/${FILENAME}`)
  }

  win.on('closed', () => windows.main = null)

  windows.main = win
})
