const path = require('path')
const reload = require('require-reload')
const watch = require('node-watch')
const replhist = require('repl.history')

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
watchFile('mod', './index.js')

// require additional libs as globals here:
// global.r = require('ramda') // <3 http://ramdajs.com/

// in case we want it
global.reload = reload

// set history up
process.env.NODE_REPL_HISTORY = './'

// launch, also capture ref to the repl, in case we want it later
// ensure global context is used so hot reloading actually works in repl
global.repl = require('repl').start({useGlobal: true})

// also enable history, which doesn't work by default programmatically
replhist(global.repl, path.join(__dirname, '.repl_history'))
