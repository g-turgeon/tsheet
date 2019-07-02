const packager = require('electron-packager')
const chalk = require('chalk')

const ignore = [
  '.babelrc',
  '.git',
  '.gitignore',
  'webpack.config.js'
]

const options = {
  name: 'Timesheet',
  dir: '.',
  out: './build',
  icon: './app/icon',
  overwrite: true,
  asar: false,
  prune: false,
  ignore: ignore
}

packager(options, (err, path) => {
  if (err) {
    console.log(chalk.red(err))
  } else {
    console.log(chalk.green(`Built application in ${path}`))
  }
})
