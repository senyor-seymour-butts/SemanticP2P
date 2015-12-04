var dt = require("../domain/domainTree")
var dn = require("../domain/domainNode")
var dmn = require("../domain/domain")

describe("DomainTree/", function () {
  describe("Init", function () {
    it("from scratch", function () {
      var tree = dt.createDomainTree()
      expect(tree).toBeDefined()
      expect(tree.root).toBeDefined()
      expect(tree.root.nameComponent).toEqual("\0");
    })

    it("from restoration file", function () {
      expect(true).toBeFalse()
    })

    describe("fails", function () {
      it("for invalid file path", function () {
        expect(true).toBeFalse()
      })

      it("for invalid file contents", function () {
        expect(true).toBeFalse()
      })

      it("for incorrect read permissions", function () {
        expect(true).toBeFalse()
      })
    })
  })

  describe("Functions/", function () {
    var testDT
    beforeEach(function () {
      testDT = dt.createDomainTree()
    })

    describe("AddDomain", function () {
      it("delegates to root", function () {
        spyOn(testDT.root, "addDomainComponent")
        var testDMNPath = "/test/path"
        var testDMN = dmn.createDomain()

        testDT.addDomain(testDMNPath, testDMN)
        expect(testDT.root.addDomainComponent).toHaveBeenCalledWith(testDMNPath, testDMN)
      })
    })

    describe("Collapse", function () {
      it("delegates to root", function () {
        expect(true).toBeFalse()
      })
    })

    describe("Prune", function () {
      it("delegates to root", function () {
        expect(true).toBeFalse()
      })
    })

    describe("Expand", function () {
      it("delegates to root", function () {
        expect(true).toBeFalse()
      })
    })

    describe("MergeTrees", function () {
      it("delegates to root", function () {
        var returnedDN = dn.createDomainNode("test")
        spyOn(testDT.root, "mergeChildren").andReturn(returnedDN)

        var otherDT = dt.createDomainTree()
        var mergedDT = testDT.mergeTrees(otherDT)

        expect(testDT.root.mergeChildren).toHaveBeenCalledWith(otherDT.root)
        expect(mergedDT.root).toEqual(returnedDN)
      })
    })

    describe("Save", function () {
      it("overwrites existing file", function () {
        expect(true).toBeFalse()
      })

      it("successfully at path", function () {
        expect(true).toBeFalse()
      })

      describe("fails", function () {
        it("for incorrect write permissions", function () {
          expect(true).toBeFalse()
        })
      })
    })
  })
})
