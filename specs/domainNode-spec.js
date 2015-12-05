var dn = require("../domain/domainNode")
var dmn = require("../domain/domain")

describe("DomainNode/", function () {
  describe("Init", function () {
    it("with nameComponent", function () {
      var expectedComp = "test"
      var testDN = dn.createDomainNode(expectedComp)

      expect(testDN.nameComponent).toEqual(expectedComp)
    })
  })

  describe("Functions/", function () {
    var testDN, testDMNPath

    beforeEach(function () {
      testDN = dn.createDomainNode("\0")
      testDMNPath = "test"
    })

    describe("TraverseTree", function () {
      // Test for:
      // -happy path
      // -multiple '/' in a row
      // -path has no length
    })
    describe("AddDomainComponent", function () {
      var testDMN
      beforeEach(function () {
        testDMN = dmn.createDomain()
      })

      it("for empty tree", function () {
        testDN.addDomainComponent(testDMNPath, testDMN)
        var recPath = testDMNPath
        var recDN = testDN

        while (recPath.length > 0) {
          var expectedComp = recPath.charAt(0)
          expect(recDN.children[expectedComp]).toBeDefined()
          expect(recDN.domain).toBeUndefined()

          recDN = recDN.children[expectedComp]
          recPath = recPath.substr(1,recPath.length)
        }

        expect(recDN.domain).toBeDefined()
      })

      it("for existing children components", function () {
        var secondPath = "tea"

        testDN.addDomainComponent(testDMNPath, testDMN)
        testDN.addDomainComponent(secondPath, dmn.createDomain())

        var recPath = secondPath
        var recDN = testDN

        while (recPath.length > 0) {
          var expectedComp = recPath.charAt(0)

          if (expectedComp == "a") {
            expect(Object.keys(recDN.children).length).toEqual(2)
          } else {
            expect(Object.keys(recDN.children).length).toEqual(1)
          }

          expect(recDN.children[expectedComp]).toBeDefined()

          recDN = recDN.children[expectedComp]
          recPath = recPath.substr(1,recPath.length)
        }

        expect(recDN.domain).toBeDefined()
      })

      it("resolves confliciting domains", function () {
        var expectedDMN = dmn.createDomain()
        expectedDMN.localContentPath = "some/test/path"

        testDN.domain = expectedDMN
        spyOn(testDMN, "resolveConflictingDomains").andReturn(expectedDMN)

        testDN.addDomainComponent("a/b/c", expectedDMN)
        testDN.addDomainComponent("a/b/c", testDMN)

        expect(testDMN.resolveConflictingDomains).toHaveBeenCalledWith(expectedDMN)
        expect(testDN.domain).toEqual(expectedDMN);
      })
    })

    describe("AddPeersForPartialPath", function () {
      var testPeers
      beforeEach(function () {
        testPeers = [1, 2, 3]
      })

      it("populates peers for empty list at end of path", function () {
        testDN.addPeersForPartialPath(testDMNPath, testPeers)

        var recPath = testDMNPath
        var recDN = testDN

        while (recPath.length > 0) {
          var expectedComp = recPath.charAt(0)
          expect(recDN.children[expectedComp]).toBeDefined()
          expect(recDN.peers.length).toEqual(0)

          recDN = recDN.children[expectedComp]
          recPath = recPath.substr(1,recPath.length)
        }

        expect(recDN.peers).toEqual(testPeers)
      })

      it("unions peer lists for existing list at end of path", function () {
        var expectedPeers = [1, 2, 3, 4]
        testDN.addPeersForPartialPath(testDMNPath, testPeers)
        testDN.addPeersForPartialPath(testDMNPath, [2, 3, 4])

        var recPath = testDMNPath
        var recDN = testDN

        while (recPath.length > 0) {
          var expectedComp = recPath.charAt(0)
          expect(recDN.children[expectedComp]).toBeDefined()
          expect(recDN.peers.length).toEqual(0)

          recDN = recDN.children[expectedComp]
          recPath = recPath.substr(1,recPath.length)
        }

        expect(recDN.peers).toEqual(expectedPeers)
      })
    })
  })
})
