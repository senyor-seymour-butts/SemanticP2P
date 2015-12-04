function DomainNode (nameComponent) {
  this.nameComponent = nameComponent
  this.children = {}
  this.prunedPeers = []
  this.domain
}

var dn = exports

dn.createDomainNode = function (nameComponent) {
  return new DomainNode(nameComponent)
}

//root: DomainNode, head of tree, recursively changed to next node
//path: String, path to follow, recursively changed to tail of path
//missing(node, head, tail, payload): func, behavior when their is no nodes with next path component
//terminal(node, payload): func, behavior when you reach the end of the path
//payload: Obj, any additional data your funcs care about
function traverseTree(root, path, missing, terminal, payload) {
  function traverseTreeRec(currentNode, path) {
    if (path.length > 0) {
      var headComp = path.charAt(0)
      var tailComp = path.substr(1, path.length)

      if (currentNode.children[headComp] == undefined) {
        missing(currentNode, headComp, tailComp, payload)
      }

      traverseTreeRec(currentNode.children[headComp], tailComp)
    } else {
      terminal(currentNode, payload)
    }
  }

  traverseTreeRec(root, path)
}

function addIfMissing(node, headComp, tailComp, payload) {
  node.children[headComp] = dn.createDomainNode(headComp)
}

DomainNode.prototype.addDomainComponent = function (domainPath, domain) {
  var addDomain = function (node, domain) {
    node.domain = domain.resolveConflictingDomains(node.domain)
  }
  traverseTree(this, domainPath, addIfMissing, addDomain, domain)
  // if (domainPath.length > 0) {
  //   var headComp = domainPath.charAt(0)
  //   var tailComp = domainPath.substr(1, domainPath.length)
  //
  //   if (this.children[headComp] == undefined) {
  //     this.children[headComp] = dn.createDomainNode(headComp)
  //   }
  //
  //   this.children[headComp].addDomainComponent(tailComp, domain)
  //
  // } else {
  //   this.domain = domain.resolveConflictingDomains(this.domain)
  // }
}

DomainNode.prototype.addPeersForPartialPath = function (partialPath, peers) {

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
