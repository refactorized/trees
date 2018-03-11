const path = require('path')
const reload = require('require-reload')
const watch = require('node-watch')
const replhist = require('repl.history')
const inspector = require('inspector')

const watchFile = (gname, reqPath) => {
  const pth = path.join(__dirname, reqPath)
  const load = () => {
    console.log(`reloading ${gname} from ${pth}`)
    // set as global so they are available in the repl
    global[gname] = reload(pth)
  }
  watch(pth, {}, load)
  load()
}

// set up hot reloads here:
watchFile('bstree', './bstree.js')

// require additional libs as globals here:
// global.r = require('ramda') // <3 http://ramdajs.com/

// in case we want it
global.reload = reload

// set history up
process.env.NODE_REPL_HISTORY = './'

// launch, also capture ref to the repl, so we can use it below
// ensure global context is used so hot reloading actually works in repl
global.repl = require('repl').start({useGlobal: true})

// also enable history, which doesn't work by default programmatically
replhist(global.repl, path.join(__dirname, '.repl_history'))

// enable inspector via '.inspect' command
global.repl.defineCommand('inspect', {
  help: 'start inspector',
  action (variant) {
    inspector.open()
    if (variant === 'break') {
      debugger // eslint-disable-line no-debugger
    }
  }
})

global.repl.defineCommand('debug', {
  help: 'start inspector',
  action () {
    debugger // eslint-disable-line no-debugger
  }
})
