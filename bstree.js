const adopt = (exemplar) => (...fns) => {
  let obj = Object.assign({}, exemplar)
  fns.forEach(fn => { obj[fn.name] = fn(obj) })
  return obj
}

const newTree = () => adopt({
  val: null,
  lft: null,
  rgt: null
})(insert, traverse)

const insert = (tree) => (val) => {
  if (tree.val === null) {
    tree.val = val
    tree.lft = newTree()
    tree.rgt = newTree()
  } else {
    insert(val > tree.val ? tree.rgt : tree.lft)(val)
  }
}

const traverse = (tree) => (fn, depth = 0, trail = [0]) => {
  if (tree == null || tree.val === null) { return }
  traverse(tree.lft)(fn, depth + 1, [...trail, -1])
  fn(tree.val, depth, trail)
  traverse(tree.rgt)(fn, depth + 1, [...trail, 1])
}

const figs = {
  up: '┌─➤ ',
  br: '│ ',
  dn: '└─➤ ',
  sp: '  '
}

const figPath = trail => {
  let frags = []
  for (let i = 1; i < trail.length - 1; i++) {
    frags.push(trail[i] === trail[i + 1] ? figs.sp : figs.br)
  }
  if (trail[trail.length - 1] === -1) {
    frags.push(figs.up)
  }
  if (trail[trail.length - 1] === 1) {
    frags.push(figs.dn)
  }
  return frags.join('')
}

// todo move visulizers to another file
const chalk = require('chalk')

const indent = (fn = x => `${x}`) => (val, depth, trail) => {
  let str = fn(val)
  console.log(chalk.gray(figPath(trail)) + chalk.white.bold(str))
}

const demo = () => {
  let a = newTree()
  let inserts = [0, 4, 7, 9, 10, 8, 5, 1, -1, -4, -7, -9, -10, -8, -5, 11, 12, 13, 14, 17, 16, 15]
  inserts.forEach(n => insert(a)(n))
  a.traverse(indent())
}

module.exports = {
  newTree,
  insert,
  traverse,
  indent,
  demo
}
