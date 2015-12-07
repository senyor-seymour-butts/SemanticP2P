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

var PrefixKey = "pre"
var PrefixChildKey = "trunc1"
var PrefixCurrentKey = "trunc2"

//root: DomainNode, head of tree, recursively changed to next node
//path: String, path to follow, recursively changed to tail of path
//missing(node, maxPrefix, isResource, payload): func, behavior when their is no nodes with next path component
//terminal(node, payload): func, behavior when you reach the end of the path
//payload: Obj, any additional data your funcs care about
function traverseTree(root, path, missing, terminal, payload) {
  function traverseTreeRec(currentNode, path, isResource) {
    if (path.length > 0) {
      var pathCategory = isResource ? currentNode.resourceChildren : currentNode.children

      var maxPrefix = sharedPathPrefix(path[0], Object.keys(pathCategory))

      var updatedTraversal
      if (pathCategory[maxPrefix[PrefixKey]] == undefined) {
        updatedTraversal = missing(currentNode, maxPrefix, isResource, payload)
      } else {
        updatedTraversal = {recNode: pathCategory[maxPrefix[PrefixKey]], tail: maxPrefix[PrefixCurrentKey]}
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

  if (path.length > 0) {
    var resourceSepPath = path.split("/")
    traverseTreeRec(root, resourceSepPath, false)
  }
}

function addIfMissing(node, maxPrefix, isResource, payload) {
  var pathCategory = isResource ? node.resourceChildren : node.children
  var updatedTrav = {recNode: undefined, tail: ""}

  if (maxPrefix[PrefixKey].length == 0 && maxPrefix[PrefixCurrentKey].length > 0) {
    updatedTrav.recNode = pathCategory[maxPrefix[PrefixCurrentKey]] = dn.createDomainNode(maxPrefix[PrefixCurrentKey])
    return updatedTrav

  } else if (maxPrefix[PrefixChildKey].length > 0 ) {
    updatedTrav.recNode = pathCategory[maxPrefix[PrefixKey]] = dn.createDomainNode(maxPrefix[PrefixKey])

    var oldPath = maxPrefix[PrefixKey] + maxPrefix[PrefixChildKey]
    var oldChild = pathCategory[oldPath]

    delete pathCategory[oldPath]
    oldChild.nameComponent = maxPrefix[PrefixChildKey]

    updatedTrav.recNode.children[maxPrefix[PrefixChildKey]] = oldChild
    updatedTrav.tail = maxPrefix[PrefixCurrentKey]

    return updatedTrav
  }
}

function sharedPathPrefix(subPath, existingComponents) {
  var maxPrefix = {}
  maxPrefix[PrefixKey] = maxPrefix[PrefixChildKey] = ""
  maxPrefix[PrefixCurrentKey] = subPath

  for (i = 0; i < existingComponents.length; i++) {
    var currPrefix = maximumSharedPrefix(existingComponents[i], subPath)
    maxPrefix = maxPrefix[PrefixKey].length >= currPrefix[PrefixKey].length ? maxPrefix : currPrefix
  }
  return maxPrefix
}

function maximumSharedPrefix(s1, s2) {
  var maxPrefixLength = Math.max(s1.length, s2.length)
  for (i = 0; i < maxPrefixLength; i++) {
    if (s1.charAt(i) != s2.charAt(i)) {
      return {pre: s1.substring(0,i), trunc1: s1.substr(i), trunc2: s2.substr(i)}
    } else if (s1.length == s2.length && i == s1.length-1) {
      return {pre: s1, trunc1: "", trunc2: ""}
    }
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
