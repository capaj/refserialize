const uuid = require('uuid')
const traverse = require('traverse')
const cloneDeep = require('lodash.clonedeep')
const sortBy = require('lodash.sortby')
const forEach = require('lodash.foreach')

function findDuplicates (obj, filterType) {
  const trav = traverse(obj)
  const nodes = trav.nodes()
  const paths = trav.paths()

  const dups = []
  const seenNodes = []
  const dupObjects = []

  for (let i = 0, len = nodes.length; i < len; i++) {
    const node = nodes[i]
    if (typeof node === filterType) {
      if (seenNodes.indexOf(node) !== -1) {
        const previousIndex = nodes.indexOf(node)
        dups.push(paths[previousIndex])
        paths[previousIndex].node = nodes[previousIndex]
        dups.push(paths[i])
        paths[i].node = node
        if (dupObjects.indexOf(node) === -1) {
          dupObjects.push(node)
        }
      } else {
        seenNodes.push(node)
      }
    }
  }
  dups.refsList = dupObjects
  return dups
}

function stringify (obj) {
  if (obj['__refs__']) {
    throw new TypeError('object cannot have "__refs__" property')
  }
  let dups = findDuplicates(obj, 'object')

  if (dups.length > 0) {
    const refsList = dups.refsList
    refsIdsList = []
    obj = cloneDeep(obj)
    
    const trav = traverse(obj)

    obj['__refs__'] = {}
    dups = sortBy(dups, 'length')
    let i = dups.length
    while (i--) {
      const dupPath = dups[i]
      const refsListIndex = refsList.indexOf(dupPath.node)
      let id
      if (!refsIdsList[refsListIndex]) {
        id = uuid.v4()
        refsIdsList[refsListIndex] = id
        obj.__refs__[id] = trav.get(dupPath)
        
      } else {
        id = refsIdsList[refsListIndex]
      }

      trav.set(dupPath, id)
    }
  }
  
  return JSON.stringify(obj)
}

function parse (str){
  const parsed = JSON.parse(str)
  if (parsed.__refs__) {
    const traverser = traverse(parsed)
    const refIds = Object.keys(parsed.__refs__)
    forEach(refIds, function (id) {
      traverser.forEach(function (val) {
        if (val === id) {
          this.update(parsed.__refs__[id])
        }
      })
    })
    delete parsed.__refs__
  }
  return parsed
}

module.exports = {
  stringify: stringify, 
  parse: parse
}