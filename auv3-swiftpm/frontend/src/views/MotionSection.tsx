import { css } from "@emotion/react";
import clsx from "clsx";
import { createContext, useContext } from "react";
import {
  lfoWaveOptions,
  MoId,
  MoType,
  moEgWaveOptions,
  moRndModeOptions,
  motionStrideOptions,
  ParameterKey,
} from "@/base/parameters";
import {
  useLfoStepPeriodDisplayText,
  useMoEgWaveFn,
} from "@/central/module-hooks";
import {
  MotionParameterKeys,
  MotionPresenter,
  useMotionParameterKeys,
  useMotionPresenter,
} from "@/central/motion-core-hooks";
import { store } from "@/central/store";
import { Icons } from "@/common/icons";
import { FlexSpacer } from "@/components/general/Spacer";
import {
  cssSectionFrameMotionLower,
  cssSectionFrameMotionUpper,
  FeKnob,
  FeMoArrowButton,
  FeMoHeader,
  FePadButton,
  FeSelectorPad,
  FeSliderGauge,
  FeWaveDisplay,
  sxFeSectionFrameWithEdge,
} from "@/components/synth";
import { rndWavePreviewFn } from "@/logic/rnd-wave-preview";
import { lfoWaveFunctions } from "@/logic/unit-waves";

const motionUnitContext = createContext<{
  mo: MotionPresenter;
  placement: "upper" | "lower";
  setEditTarget: (target: ParameterKey | null) => void;
  parameterKeys: MotionParameterKeys;
  // biome-ignore lint/suspicious/noExplicitAny: dummy object
}>({} as any);

function useMotionUnitContext() {
  return useContext(motionUnitContext);
}

const InactiveCover = ({
  inactive,
  color,
}: {
  inactive: boolean;
  color: string;
}) => {
  if (!inactive) return;
  return (
    <div
      className="absolute top-0 left-0 size-full pointer-events-none"
      style={{ background: color }}
    />
  );
};

const MotionHeaderBar = () => {
  const { mo, placement } = useMotionUnitContext();
  return (
    <div css={styleMotionHeaderBar.outer}>
      <div
        css={styleMotionHeaderBar.panel}
        className={clsx("flex-ha gap-1.5 pl-4 pr-2 py-[2px]")}
      >
        <div className="flex-h gap-px">
          <FeMoHeader
            label="RND"
            active={mo.moType === MoType.rnd}
            onClick={() => mo.setMoType(MoType.rnd)}
          />
          <FeMoHeader
            label="EG"
            active={mo.moType === MoType.eg}
            onClick={() => mo.setMoType(MoType.eg)}
          />
          <FeMoHeader
            label="LFO"
            active={mo.moType === MoType.lfo}
            onClick={() => mo.setMoType(MoType.lfo)}
          />
        </div>
        <FeMoArrowButton
          invert={placement === "upper"}
          active={mo.moOn}
          onClick={() => mo.toggleMoOn()}
        />
      </div>
      <InactiveCover inactive={!mo.moOn} color="#0005" />
    </div>
  );
};
const styleMotionHeaderBar = {
  outer: css({
    zIndex: 1,
    margin: "-10px 0",
    position: "relative",
  }),
  panel: css({
    ...sxFeSectionFrameWithEdge,
  }),
};

const iconSize = 22;

const MotionUnitViewRnd = () => {
  const { mo, setEditTarget, parameterKeys } = useMotionUnitContext();
  return (
    <div className="flex-ha gap-2">
      <div className="flex-v gap-1.5">
        <div className="flex-ha gap-2">
          <FeSelectorPad
            value={mo.rndStride}
            onChange={(v) => mo.setRndStride(v)}
            options={motionStrideOptions}
            bidirectional
          />
          <FeWaveDisplay waveFn={rndWavePreviewFn[mo.rndMode]} />
        </div>
        <div className="flex-ha gap-2">
          <FlexSpacer />
          <FeSelectorPad
            options={moRndModeOptions}
            value={mo.rndMode}
            onChange={(v) => mo.setRndMode(v)}
            unitSize="u15"
          />
        </div>
      </div>
      <FeKnob
        label="cover"
        value={mo.rndCover}
        onChange={(v) => mo.setRndCover(v)}
        size="small"
        onStartEdit={() => setEditTarget(parameterKeys.rndCover)}
        onEndEdit={() => setEditTarget(null)}
      />
      <FeSliderGauge
        value={mo.moAmount}
        onChange={(v) => mo.setMoAmount(v)}
        active={mo.moOn}
        onTap={() => mo.toggleMoOn()}
        onStartEdit={() => setEditTarget(parameterKeys.moAmount)}
        onEndEdit={() => setEditTarget(null)}
      />
    </div>
  );
};

const MotionUnitViewEg = () => {
  const { mo, setEditTarget, parameterKeys } = useMotionUnitContext();
  const waveFn = useMoEgWaveFn(mo.egWave, mo.egCurve);
  return (
    <div className="flex-ha gap-2">
      <div className="flex-v gap-1.5">
        <div className="flex-ha gap-2">
          <FeSelectorPad
            value={mo.egStride}
            onChange={(v) => mo.setEgStride(v)}
            options={motionStrideOptions}
            bidirectional
          />
          <FeWaveDisplay waveFn={waveFn} invertY={mo.egInvert} />
        </div>
        <div className="flex-ha gap-2">
          <FePadButton
            active={mo.egInvert}
            onClick={() => mo.toggleEgInvert()}
            children={<Icons.FlipVertical size={iconSize} />}
            unitSize="u11"
          />
          <FlexSpacer />
          <FeSelectorPad
            options={moEgWaveOptions}
            value={mo.egWave}
            onChange={(v) => mo.setEgWave(v)}
            unitSize="u15"
          />
        </div>
      </div>
      <FeKnob
        label="curve"
        value={mo.egCurve}
        onChange={(v) => mo.setEgCurve(v)}
        size="small"
        onStartEdit={() => setEditTarget(parameterKeys.egCurve)}
        onEndEdit={() => setEditTarget(null)}
      />
      <FeSliderGauge
        value={mo.moAmount}
        onChange={(v) => mo.setMoAmount(v)}
        active={mo.moOn}
        onTap={() => mo.toggleMoOn()}
        onStartEdit={() => setEditTarget(parameterKeys.moAmount)}
        onEndEdit={() => setEditTarget(null)}
      />
    </div>
  );
};

const MotionUnitViewLfo = () => {
  const { mo, setEditTarget, parameterKeys } = useMotionUnitContext();
  const stepPeriodText = useLfoStepPeriodDisplayText(
    mo.lfoRate,
    mo.lfoRateStepped,
  );
  return (
    <div className="flex-ha gap-2">
      <div className="flex-v gap-1.5">
        <div className="flex-ha gap-2">
          <FePadButton
            active={mo.lfoRateStepped}
            onClick={() => mo.toggleLfoRateStepped()}
            children={<Icons.Stairs size={iconSize} />}
            unitSize="u11"
          />
          <div className="flex-c w-[20px] text-[16px] grow">
            {stepPeriodText}
          </div>
          <FeWaveDisplay
            waveFn={lfoWaveFunctions[mo.lfoWave]}
            invertY={mo.lfoInvert}
          />
        </div>
        <div className="flex-ha gap-2">
          <FePadButton
            active={mo.lfoInvert}
            onClick={() => mo.toggleLfoInvert()}
            children={<Icons.FlipVertical size={iconSize} />}
            unitSize="u11"
          />
          <FlexSpacer />
          <FeSelectorPad
            options={lfoWaveOptions}
            value={mo.lfoWave}
            onChange={(v) => mo.setLfoWave(v)}
            unitSize="u15"
          />
        </div>
      </div>
      <FeKnob
        label="rate"
        value={mo.lfoRate}
        onChange={(v) => mo.setLfoRate(v)}
        tickDisplaySteps={mo.lfoRateStepped ? 6 : undefined}
        size="small"
        onStartEdit={() => setEditTarget(parameterKeys.lfoRate)}
        onEndEdit={() => setEditTarget(null)}
      />
      <FeSliderGauge
        value={mo.moAmount}
        onChange={(v) => mo.setMoAmount(v)}
        active={mo.moOn}
        onTap={() => mo.toggleMoOn()}
        onStartEdit={() => setEditTarget(parameterKeys.moAmount)}
        onEndEdit={() => setEditTarget(null)}
      />
    </div>
  );
};

const MotionUnitView = () => {
  const { mo, placement } = useMotionUnitContext();
  return (
    <div className="flex-vc">
      {placement === "lower" && <MotionHeaderBar />}
      <div
        className="relative"
        css={
          placement === "upper"
            ? cssSectionFrameMotionUpper
            : cssSectionFrameMotionLower
        }
      >
        {mo.moType === MoType.rnd && <MotionUnitViewRnd />}
        {mo.moType === MoType.eg && <MotionUnitViewEg />}
        {mo.moType === MoType.lfo && <MotionUnitViewLfo />}
        <InactiveCover inactive={!mo.moOn} color="#0005" />
      </div>
      {placement === "upper" && <MotionHeaderBar />}
    </div>
  );
};

export const MotionSection = ({
  moId,
  placement,
}: {
  moId: MoId;
  placement: "upper" | "lower";
}) => {
  const mo = useMotionPresenter(moId);
  const { setEditTarget } = store.mutations;
  const parameterKeys = useMotionParameterKeys(moId);
  return (
    <motionUnitContext.Provider
      value={{ mo, placement, setEditTarget, parameterKeys }}
      children={<MotionUnitView />}
    />
  );
};
