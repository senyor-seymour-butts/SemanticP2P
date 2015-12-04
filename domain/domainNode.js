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

DomainNode.prototype.addDomainComponent = function (domainPath, domain) {
  if (domainPath.length > 0) {
    var headComp = domainPath.charAt(0)
    var tailComp = domainPath.substr(1, domainPath.length)

    if (this.children[headComp] == undefined) {
      this.children[headComp] = dn.createDomainNode(headComp)
    }

    this.children[headComp].addDomainComponent(tailComp, domain)

  } else {
    this.domain = domain.resolveConflictingDomains(this.domain)
  }
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
