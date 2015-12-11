var dmn = require("../../src/domain/domain")

describe("Domain/", function () {
  describe("Functions/", function () {

    describe("Resolve Conflicting Domains", function () {
      var testDMN
      beforeEach(function () {
        testDMN = dmn.createDomain()
      })

      describe("returns self when", function () {
        it("other domain is null", function () {
          expect(testDMN.resolveConflictingDomains(null)).toEqual(testDMN)
        })

        it("other domain is undefined", function () {
          expect(testDMN.resolveConflictingDomains(undefined)).toEqual(testDMN)
        })
      })
    })
  })
})
