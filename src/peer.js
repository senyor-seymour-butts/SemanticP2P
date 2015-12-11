function Peer (ipAddress) {
  this.ip = ipAddress
  this.notResponding = false
  this.avgResponseTime = 0.0
  this.numResponses = 0
}

var peer = exports

peer.createPeer = function (ipAddress) {
  return new Peer(ipAddress)
}
