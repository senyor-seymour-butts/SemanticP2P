var pUtil = require("../../utils/path")

describe("SharedPathPrefix returns", function () {
  var existingComps
  beforeEach(function () {
    existingComps = ["test","path","utils"]
  })

  it("only subPath when no existing components", function () {
    var subPath = "new"
    var prefix = pUtil.sharedPathPrefix(subPath, [])
    expect(prefix.prefix).toEqual("")
    expect(prefix.oldTail).toEqual("")
    expect(prefix.newTail).toEqual(subPath)
  })

  it("non-zero prefix", function () {
    var subPath = "text"
    var prefix = pUtil.sharedPathPrefix(subPath, existingComps)
    expect(prefix.prefix).toEqual("te")
    expect(prefix.oldTail).toEqual("st")
    expect(prefix.newTail).toEqual("xt")
  })

  it("only prefix when equal to existing component", function () {
    var subPath = "utils"
    var prefix = pUtil.sharedPathPrefix(subPath, existingComps)
    expect(prefix.prefix).toEqual(subPath)
    expect(prefix.oldTail).toEqual("")
    expect(prefix.newTail).toEqual("")
  })

  it("empty object when empty path", function () {
    var subPath = ""
    var prefix = pUtil.sharedPathPrefix(subPath, existingComps)
    expect(prefix.prefix).toEqual("")
    expect(prefix.oldTail).toEqual("")
    expect(prefix.newTail).toEqual("")
  })
})

describe("ValidPath", function () {
  describe("returns true", function () {
    it("for non-zero length", function () {
      expect(pUtil.validPath("abc")).toBeTruthy()
    })
  })

  describe("returns false", function () {
    it("for zero length", function () {
      expect(pUtil.validPath("")).toBeFalsy()
    })
  })
})
