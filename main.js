const { app, BrowserWindow } = require('electron')
const fs = require('fs')
const chalk = require('chalk')
require('dotenv').config()

const getFilename = () => {
  if (process.env.NODE_ENV === 'develop') {
    const [ bin, script, filename ] = process.argv
    return filename
  } else {
    const [ bin, filename ] = process.argv
    return filename
  }
}

const filename = getFilename()

if (!filename) {
  console.log(chalk.red('No filename specified'))
  process.exit(1)
}

if (!fs.existsSync(filename)) {
  console.log(chalk.red(`File '${filename}' doesn't exist`))
  process.exit(1)
}

const windows = {main: null}

app.on('ready', () => {
  const win = new BrowserWindow({
    webPreferences: {nodeIntegration: true},
    autoHideMenuBar: true,
    width: 612,
    height: 768,
    resizable: true
  })

  win.loadFile(`${__dirname}/app/index.html`)
  win.on('closed', () => windows.main = null)

  win.webContents.on('did-finish-load', () => {
    win.webContents.send('file-load', filename)
  })

  windows.main = win
})
