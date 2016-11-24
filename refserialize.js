const a = {
  prop: 1
}

const b = {
  ref: a
}

const o = {
  b: a,
  c: [b],
  d: b
}

const uuid = require('uuid')
const traverse = require('traverse')
const cloneDeep = require('lodash.clonedeep')
const sortBy = require('lodash.sortby')

function findDuplicates (obj, filterType) {
  const trav = traverse(obj)
  const nodes = trav.nodes()
  const paths = trav.paths()

  const dups = []
  const seenNodes = []

  for (let i = 0, len = nodes.length; i < len; i++) {
    const node = nodes[i]
    if (typeof node === filterType) {
      if (seenNodes.indexOf(node) !== -1) {
        const previousIndex = nodes.indexOf(node)
        dups.push(paths[previousIndex])
        paths[previousIndex].node = nodes[previousIndex]
        dups.push(paths[i])
        paths[i].node = node
      } else {
        seenNodes.push(node)
      }
    }
  }
  return dups
}

function replaceInstances (obj, uuid) {
  
}

function stringify (obj) {
  let dups = findDuplicates(obj, 'object')

  if (dups.length > 0) {
    obj = cloneDeep(obj)
    if (obj['__refs__']) {
      throw new TypeError('object cannot have "__refs__" property')
    }
    obj['__refs__'] = {}
    dups = sortBy(dups, 'length')
    let i = dups.length
    while (i--) {
      dupPath
    }
  }

  return JSON.stringify(obj, function replacer (key, value) {
    if (typeof value === 'object') {
      if (objects.has(value)) {
        console.log(key, value)
       
        const id = uuid.v4()

        obj['__refs__'][id] = stringify(value, objects)
        return '_or_' + id
      }
      objects.add(value)
    }

    return value
  })
}

// console.log(stringify(o))
console.log(findDuplicates(o, 'object'))

module.exports = stringify