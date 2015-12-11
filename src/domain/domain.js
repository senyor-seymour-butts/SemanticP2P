function Domain () {
  this.crc
  this.pubKey
  this.peers = []
  this.localContentPath
}

var dmn = exports

dmn.createDomain = function () {
  return new Domain()
}

Domain.prototype.resolveConflictingDomains = function (otherDMN) {
  if (otherDMN == null || otherDMN == undefined) {
    return this
  } else {
    //check equality of crc and pubKey
    //if equal: merge peer list and probe both localContentPath for saved files
    //if not equal: attempt to validate both with NameCoin blockchain
  }

  return this
}
