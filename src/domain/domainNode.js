var pUtil = require("../utils/path")

function DomainNode (nameComponent) {
  this.nameComponent = nameComponent
  this.children = {}
  this.resourceChildren = {}
  this.peers = []
  this.domain
}

var dn = exports

dn.createDomainNode = function (nameComponent) {
  return new DomainNode(nameComponent)
}

//root: DomainNode, head of tree, recursively changed to next node
//path: String, path to follow, recursively changed to tail of path
//missing(node, maxPrefix, isResource, payload): func, behavior when their is no nodes with next path component
//terminal(node, payload): func, behavior when you reach the end of the path
//payload: Obj, any additional data your funcs care about
function traverseTree(root, path, missing, terminal, payload) {
  function traverseTreeRec(currentNode, path, isResource) {
    if (path.length > 0) {
      var pathCategory = isResource ? currentNode.resourceChildren : currentNode.children

      var maxPrefix = pUtil.sharedPathPrefix(path[0], Object.keys(pathCategory))

      var updatedTraversal
      if (pathCategory[maxPrefix.prefix] == undefined) {
        updatedTraversal = missing(currentNode, maxPrefix, isResource, payload)
      } else {
        updatedTraversal = {recNode: pathCategory[maxPrefix.prefix], tail: maxPrefix.newTail}
      }

      if (updatedTraversal != undefined) {
        if (updatedTraversal.tail.length == 0) {
          traverseTreeRec(updatedTraversal.recNode, path.slice(1), true)
        } else {
          traverseTreeRec(updatedTraversal.recNode, [updatedTraversal.tail].concat(path.slice(1)), false)
        }
      }
    } else {
      terminal(currentNode, payload)
    }
  }

  if (pUtil.validPath(path)) {
    var resourceSepPath = path.split("/")
    traverseTreeRec(root, resourceSepPath, false)
  }
}

function addIfMissing(node, maxPrefix, isResource, payload) {
  var pathCategory = isResource ? node.resourceChildren : node.children
  var updatedTrav = {recNode: undefined, tail: ""}

  if (maxPrefix.prefix.length == 0 && maxPrefix.newTail.length > 0) {
    updatedTrav.recNode = pathCategory[maxPrefix.newTail] = dn.createDomainNode(maxPrefix.newTail)
    return updatedTrav

  } else if (maxPrefix.oldTail.length > 0 ) {
    updatedTrav.recNode = pathCategory[maxPrefix.prefix] = dn.createDomainNode(maxPrefix.prefix)

    var oldPath = maxPrefix.prefix + maxPrefix.oldTail
    var oldChild = pathCategory[oldPath]

    delete pathCategory[oldPath]
    oldChild.nameComponent = maxPrefix.oldTail

    updatedTrav.recNode.children[maxPrefix.oldTail] = oldChild
    updatedTrav.tail = maxPrefix.newTail

    return updatedTrav
  }
}

DomainNode.prototype.addDomainComponent = function (domainPath, domain) {
  var addDomain = function (node, domain) {
    node.domain = domain.resolveConflictingDomains(node.domain)
  }
  traverseTree(this, domainPath, addIfMissing, addDomain, domain)
}

DomainNode.prototype.addPeersForPartialPath = function (partialPath, peers) {
  var addPeers = function (node, peers) {
    //naive approach assuming no overlap of existing and new peers
    node.peers = node.peers.concat(peers)
  }
  traverseTree(this, partialPath, addIfMissing, addPeers, peers)
}

DomainNode.prototype.removeChild = function (child) {

}

DomainNode.prototype.mergeChildren = function (otherDN) {
  var allChildComps = this.childComponents()
  //DFS solution
  //Naive solution assuming that it isn't in a collapsed form
  allChildComps.concat(
    otherDN.childComponents().filter(function (childComp) {
      return allChildren.indexOf(childComp) < 0
    })
  )

  var mergedChildren
  for (comp in allChildComps) {
    var thisChild = this.children[comp]
    var otherChild = otherDN.children[comp]

    if (thisChild != undefined && otherChild != undefined) {
      mergedChildren[comp] = thisChild.mergeChildren(otherChild)
    } else if (thisChild != undefined) {
      mergedChildren[comp] = thisChild
    } else {
      mergedChildren[comp] = otherChild
    }
  }
}

DomainNode.prototype.childComponents = function () {
  return Object.keys(this.children)
}
