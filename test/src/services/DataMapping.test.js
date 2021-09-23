const chai = require("chai");
chai.should();
const vetClinic = require("../../__mocks__/vet-clinic.json");
const { mappingService } = require("../../../src/services/DataMapping");

describe("DataMapping test suit", () => {
  it("respond with mapped data from mappingService", () => {
    const mappedResponse = mappingService(vetClinic);
    mappedResponse.length.should.eql(5);
    mappedResponse[0].should.include.keys([
      "name",
      "stateCode",
      "stateName",
      "availability",
    ]);
    // comparing the respoonse with first clinic name i.e. Good Health Home
    mappedResponse[0].name.should.eql("Good Health Home");
  });
});
