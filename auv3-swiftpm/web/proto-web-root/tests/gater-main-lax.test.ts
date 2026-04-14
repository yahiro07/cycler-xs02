import { StepRampCode } from "@core/base/synthesis-types";
import { gaterMainLax_testGenerateStepRampCodes } from "@core/motions/gaters/gater-main-lax";
import { it } from "vitest";

function debugShowRampCodes(rampCodes: StepRampCode[]) {
  console.log(
    rampCodes
      .map(
        (r) =>
          ({
            [StepRampCode.one]: "o",
            [StepRampCode.tie1]: "1",
            [StepRampCode.tie2]: "2",
            [StepRampCode.off]: "x",
          })[r],
      )
      .join(""),
  );
}

it("should return the correct ramp code", () => {
  {
    const rampCode = gaterMainLax_testGenerateStepRampCodes(32, 0);
    debugShowRampCodes(rampCode);
  }
  {
    const rampCode = gaterMainLax_testGenerateStepRampCodes(32, 0.25);
    debugShowRampCodes(rampCode);
  }
  {
    const rampCode = gaterMainLax_testGenerateStepRampCodes(32, 0.5);
    debugShowRampCodes(rampCode);
  }
  {
    const rampCode = gaterMainLax_testGenerateStepRampCodes(32, 0.75);
    debugShowRampCodes(rampCode);
  }
  {
    const rampCode = gaterMainLax_testGenerateStepRampCodes(32, 1);
    debugShowRampCodes(rampCode);
  }
});
