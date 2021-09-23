require("chai");
const { removeDuplicates } = require("../../src/utils");

describe("Utils test suit", () => {
  it("Should remove clinics with duplicate names", () => {
    const testData = [
      {
        name: "City Vet Clinic",
        stateCode: "NV",
        availability: {
          from: "10:00",
          to: "22:00",
        },
      },
      {
        name: "Scratchpay Test Pet Medical Center",
        stateCode: "CA",
        availability: {
          from: "00:00",
          to: "24:00",
        },
      },
      {
        name: "Scratchpay Test Pet Medical Center",
        stateName: "California",
        availability: {
          from: "00:00",
          to: "24:00",
        },
      },
      {
        name: "Scratchpay Official practice",
        stateName: "Tennessee",
        availability: {
          from: "00:00",
          to: "24:00",
        },
      },
    ];
    const uniqueResponse = removeDuplicates(testData);
    uniqueResponse.length.should.eql(3);
  });
});
