var dn = require("../../domain/domainNode")
var dmn = require("../../domain/domain")

describe("DomainNode/", function () {
  describe("Init", function () {
    it("with nameComponent", function () {
      var expectedComp = "test"
      var testDN = dn.createDomainNode(expectedComp)

      expect(testDN.nameComponent).toEqual(expectedComp)
    })
  })

  describe("Functions/", function () {
    var testDN, simplePath, simpleResPath

    beforeEach(function () {
      testDN = dn.createDomainNode("\0")
      simplePath = "test"
      simpleResPath = "test/some/more"
    })

    describe("AddDomainComponent", function () {
      var testDMN
      beforeEach(function () {
        testDMN = dmn.createDomain()
      })

      describe("to empty tree", function () {
        it("for simple path", function () {
          testDN.addDomainComponent(simplePath, testDMN)

          expect(testDN.children).toBeDefined()
          var expected = testDN.children[simplePath]
          expect(expected).toBeDefined()
          expect(Object.keys(expected.children).length).toEqual(0)
          expect(expected.domain).toEqual(testDMN)
        })

        it("for simple resource path", function () {
          testDN.addDomainComponent(simpleResPath, testDMN)

          var pathComps = simpleResPath.split("/")
          var recNode = testDN

          for (i=0; i<pathComps.length; i++) {
            var expected
            if (i == 0) {
              expect(Object.keys(recNode.children).length).toEqual(1)
              expected = recNode.children[pathComps[i]]
            } else {
              expect(Object.keys(recNode.children).length).toEqual(0)
              expected = recNode.resourceChildren[pathComps[i]]
            }
            expect(expected).toBeDefined()
            recNode = expected
          }
          expect(expected.domain).toEqual(testDMN)
        })

        it("and return error for empty path", function () {
          testDN.addDomainComponent("", testDMN)

          expect(Object.keys(testDN.children).length).toEqual(0)
          expect(Object.keys(testDN.resourceChildren).length).toEqual(0)
          expect(testDN.domain).toBeUndefined()

          expect(true).toBeFalse()
        })

        it("and return error for malformed path", function () {
          testDN.addDomainComponent("test///", testDMN)

          expect(Object.keys(testDN.children).length).toEqual(0)
          expect(Object.keys(testDN.resourceChildren).length).toEqual(0)
          expect(testDN.domain).toBeUndefined()
        })
      })

      describe("to existing tree", function () {
        beforeEach(function () {
          testDN.addDomainComponent("test/some/path", testDMN)
        })

        it("for simple path", function () {
          testDN.addDomainComponent("tell", testDMN)

          var partialComp = testDN.children["te"]
          expect(partialComp).toBeDefined()

          expect(Object.keys(partialComp.children).length).toEqual(2)
          expect(Object.keys(partialComp.resourceChildren).length).toEqual(0)

          expect(partialComp.children["st"]).toBeDefined()
          expect(partialComp.children["ll"]).toBeDefined()
          expect(partialComp.children["ll"].domain).toEqual(testDMN)
        })

        it("for simple resource path", function () {
          testDN.addDomainComponent("test/someOther", testDMN)

          var partialComp = testDN.children["test"]
          expect(partialComp).toBeDefined()

          expect(Object.keys(partialComp.children).length).toEqual(0)
          expect(Object.keys(partialComp.resourceChildren).length).toEqual(1)

          var resPartialComp = partialComp.resourceChildren["some"]
          expect(resPartialComp.resourceChildren["path"]).toBeDefined()

          expect(resPartialComp.children["Other"]).toBeDefined()
          expect(resPartialComp.children["Other"].domain).toEqual(testDMN)
        })

        xit("and return error for empty path", function () {

        })

        xit("and return error for malformed path", function () {

        })

        xit("resolves confliciting domains", function () {
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
    })

    xdescribe("AddPeersForPartialPath", function () {
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
