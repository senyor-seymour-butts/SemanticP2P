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
    describe("AddDomainComponent", function () {
      var testDN, testDMN, testDMNPath

      beforeEach(function () {
        testDN = dn.createDomainNode("\0")
        testDMNPath = "test"
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
      })

      it("resolves confliciting domains", function () {
        var expectedDMN = dmn.createDomain()
        expectedDMN.localContentPath = "some/test/path"

        testDN.domain = expectedDMN
        spyOn(testDMN, "resolveConflictingDomains").andReturn(expectedDMN)

        testDN.addDomainComponent("", testDMN)

        expect(testDMN.resolveConflictingDomains).toHaveBeenCalledWith(expectedDMN)
        expect(testDN.domain).toEqual(expectedDMN);
      })
    })
  })
})
