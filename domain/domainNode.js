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
//missing(node, head, tail, isResource, payload): func, behavior when their is no nodes with next path component
//terminal(node, payload): func, behavior when you reach the end of the path
//payload: Obj, any additional data your funcs care about
function traverseTree(root, path, missing, terminal, payload) {
  function traverseTreeRec(currentNode, path, isResource) {
    if (path.length > 0) {
      var subPath = path[0]
      var headComp = subPath.charAt(0)
      var tailComp = subPath.substr(1, subPath.length)

      var pathCategory = isResource ? currentNode.resourceChildren : currentNode.children

      if (pathCategory[headComp] == undefined) {
        missing(currentNode, headComp, tailComp, isResource, payload)
      }

      if (tailComp.length == 0) {
        traverseTreeRec(pathCategory[headComp], path.slice(1), true)
      } else {
        traverseTreeRec(pathCategory[headComp], [tailComp].concat(path.slice(1)), false)
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

function addIfMissing(node, headComp, tailComp, isResource, payload) {
  var pathCategory = isResource ? node.resourceChildren : node.children
  pathCategory[headComp] = dn.createDomainNode(headComp)
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
