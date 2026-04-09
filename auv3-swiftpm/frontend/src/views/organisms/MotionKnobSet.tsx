import { css } from "@emotion/react";
import { ReactNode, useMemo } from "react";
import { MoId, ParameterKey } from "@/base/parameters";
import {
  useMotionPresenter,
  useMotionSpeedSource,
} from "@/central/motion-core-hooks";
import {
  useMoSpinSpeed,
  useMotionTargetArcRange,
} from "@/central/motion-derived-hooks";
import { store } from "@/central/store";
import { SnapStoreSetterFn } from "@/common/snap-store-ex-types";
import { sxGridLayeringBase } from "@/common/utility-styles";
import {
  applyKnobValueTickDisplayStep,
  FeKnob,
  FeMotionKnobRing,
  FeMotionKnobRingDummy,
  FeMotionOnButton,
  TickDisplayStepsSpec,
} from "@/components/synth";

export const MotionKnobLayout = ({
  knobUi,
  arcRingUi,
  moButtonUi,
  modeButtonUi,
  moExButtonUi,
}: {
  knobUi: ReactNode;
  arcRingUi?: ReactNode;
  modeButtonUi?: ReactNode;
  moButtonUi?: ReactNode;
  moExButtonUi?: ReactNode;
}) => {
  const styles = motionKnobLayoutStyles;
  return (
    <div css={styles.base}>
      <div css={styles.tlKnob}>
        {knobUi}
        {arcRingUi}
      </div>
      <div css={styles.trMoButton}>{moButtonUi}</div>
      <div css={styles.bl}>{modeButtonUi}</div>
      <div css={styles.br}>{moExButtonUi}</div>
    </div>
  );
};
const motionKnobLayoutStyles = {
  base: css({
    // border: "solid 1px #8884",
    display: "grid",
    gridTemplateColumns: "max-content max-content",
    gridTemplateRows: "max-content max-content",
    gridTemplateAreas: `
    "tl tr"
    "bl br"
    `,
    alignItems: "center",
    justifyItems: "center",
    gap: "0",
  }),
  tlKnob: css({
    gridArea: "tl",
    ...sxGridLayeringBase,
    marginBottom: "-5px",
    marginLeft: "-1px",
    marginRight: "-1px",
  }),
  trMoButton: css({
    gridArea: "tr",
    alignSelf: "start",
  }),
  bl: css({ gridArea: "bl" }),
  br: css({ gridArea: "br" }),
};

export const MotionKnobSet = ({
  label,
  knobValue,
  setKnobValue,
  moId,
  modeButtonUi,
  moExButtonUi,
  isModuleOn,
  tickDisplaySteps,
  parameterKey,
}: {
  label: string;
  knobValue: number;
  setKnobValue: SnapStoreSetterFn<number>;
  moId: MoId;
  modeButtonUi?: ReactNode;
  moExButtonUi?: ReactNode;
  isModuleOn: boolean;
  tickDisplaySteps?: TickDisplayStepsSpec;
  parameterKey: ParameterKey;
}) => {
  const speedSource = useMotionSpeedSource();
  const normValue = useMemo(() => {
    if (!tickDisplaySteps) return knobValue;
    return applyKnobValueTickDisplayStep(knobValue, tickDisplaySteps);
  }, [knobValue, tickDisplaySteps]);
  const mo = useMotionPresenter(moId);
  const arcRange = useMotionTargetArcRange(mo, normValue);
  const spinSpeed = useMoSpinSpeed(mo, speedSource, isModuleOn);
  const { setEditTarget } = store.mutations;
  return (
    <MotionKnobLayout
      knobUi={
        <FeKnob
          label={label}
          value={knobValue}
          onChange={(v) => setKnobValue(v)}
          tickDisplaySteps={tickDisplaySteps}
          onStartEdit={() => setEditTarget(parameterKey)}
          onEndEdit={() => setEditTarget(null)}
        />
      }
      arcRingUi={
        arcRange ? (
          <FeMotionKnobRing arcRange={arcRange} />
        ) : (
          <FeMotionKnobRingDummy />
        )
      }
      moButtonUi={
        <FeMotionOnButton
          active={mo.moOn}
          onClick={() => mo.toggleMoOn()}
          spinSpeed={spinSpeed}
        />
      }
      modeButtonUi={modeButtonUi}
      moExButtonUi={moExButtonUi}
    />
  );
};

export const MotionNeighborKnob = ({
  label,
  value,
  onChange,
  parameterKey,
}: {
  label: string;
  value: number;
  onChange: SnapStoreSetterFn<number>;
  parameterKey: ParameterKey;
}) => {
  const { setEditTarget } = store.mutations;
  return (
    <MotionKnobLayout
      knobUi={
        <FeKnob
          label={label}
          value={value}
          onChange={onChange}
          size="small"
          onStartEdit={() => setEditTarget(parameterKey)}
          onEndEdit={() => setEditTarget(null)}
        />
      }
      arcRingUi={<FeMotionKnobRingDummy />}
    />
  );
};
