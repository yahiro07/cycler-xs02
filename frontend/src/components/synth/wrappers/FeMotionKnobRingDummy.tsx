import { npx } from "@/common/utility-styles";
import { knobRingConfigs } from "@/components/synth/common/ui-sizes";

export const FeMotionKnobRingDummy = () => {
  const size = knobRingConfigs.radius * 2;
  return <div style={{ width: npx(size), height: npx(size) }} />;
};
