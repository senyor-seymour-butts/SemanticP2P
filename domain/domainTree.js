var dn = require('./domainNode')

function DomainTree (path) {
  if (path !== undefined) {
    //do restoration from file
  } else {
    this.root = dn.createDomainNode("\0")
  }
}

DomainTree.prototype.addDomain = function (domainPath, domain) {
  this.root.addDomainComponent(domainPath, domain)
}

DomainTree.prototype.addPeersForPath = function (partialPath, peers) {
  this.root.addPeersForPartialPath(partialPath, peers)
}

DomainTree.prototype.prune = function (pruning) {
  return this
}

DomainTree.prototype.collapse = function () {
  return this
}

DomainTree.prototype.expand = function () {
  return this
}

DomainTree.prototype.mergeTrees = function (otherDTree) {
  var mergedTree = new DomainTree()
  mergedTree.root = this.root.mergeChildren(otherDTree.root)
  return mergedTree
}

DomainTree.prototype.save = function (path) {
  return path
}

var dt = exports

dt.createDomainTree = function () {
  return new DomainTree()
}

dt.restoreDomainTreeFromFile = function (path) {
  return new DomainTree(path)
}
