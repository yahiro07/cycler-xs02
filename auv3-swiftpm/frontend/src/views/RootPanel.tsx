import clsx from "clsx";
import { ReactNode } from "react";
import { appEnvs } from "@/base/app-envs";
import {
  bassPresetKeyOptions,
  bassTailAccentPatternKeyOptions,
  bpmRanges,
  delayStepOptions,
  GaterType,
  gaterExSourceStrideOptions,
  gaterSourceStrideOptions,
  gaterTypeOptions,
  kickPresetKeyOptions,
  loopBarsOptions,
  oscColorModeOptions,
  oscPitchModeOptions,
  oscUnisonModeOptions,
  oscWaveOptions,
  randomizeLevelOptions,
  shaperModeOptions,
} from "@/base/parameters";
import { actions } from "@/central/actions";
import { useAmpEgWaveFn } from "@/central/module-hooks";
import { store } from "@/central/store";
import { appFontSpecs } from "@/common/font-specs";
import { Icons } from "@/common/icons";
import { CyclerLogoWithText } from "@/components/brand/CyclerLogo";
import { MachineNameLabel } from "@/components/brand/MachineNameLabel";
import { FlexSpacer, Spacer } from "@/components/general/Spacer";
import { ScreenUiScaler } from "@/components/general/UiScaler";
import { FullscreenButton } from "@/components/screen/FullscreenButton";
import { TouchPointerView } from "@/components/screen/TouchPointerView";
import {
  cssSectionFrame2U,
  cssSectionFrameBlank,
  cssSectionFrameBottom,
  cssSectionFrameLower,
  cssSectionFrameUpper,
  FeBpmControlDisplay,
  FeBpmControlDisplayReadonly,
  FeButtonContentTwoColumn,
  FeKnob,
  FeModuleHeader,
  FePadButton,
  FePadButtonRawSize,
  FeSelectorPad,
  FeWaveDisplay,
} from "@/components/synth";
import { feColorDefs } from "@/components/synth/common/color-defs";
import { pitchModeTickStepMap } from "@/logic/additional";
import { oscWaveFunctions } from "@/logic/unit-waves";
import { MotionSection } from "@/views/MotionSection";
import {
  MotionKnobSet,
  MotionNeighborKnob,
  OctaveSelectorButtons,
  StepCellPadsEx,
  StepCellPadsMain,
} from "@/views/organisms";
import { KeySettingsButton } from "@/views/organisms/KeySettingsButton";

const OscSection = () => {
  const st = store.useSnapshot();
  const mt = store.mutations;
  return (
    <div className="relative" css={cssSectionFrame2U}>
      <div className="absolute left-0 top-0 p-4">
        <FeModuleHeader
          label="OSC"
          active={st.oscOn}
          onClick={mt.toggleOscOn}
        />
      </div>
      {/* justify-betweenやjustify-aroundを使うとiOS safariで
      pitch,colorノブのmotion wheelの回転中心がずれる問題が出るのでこれは使わない */}
      <div className="w-full h-full flex-h items-end justify-center gap-[20px]">
        <OctaveSelectorButtons
          octave={st.oscOctave}
          setOctave={mt.setOscOctave}
        />
        <div className="flex-vc gap-1.5">
          <FeWaveDisplay
            waveFn={oscWaveFunctions[st.oscWave]}
            shape={0}
            baseSize={46}
          />
          <FeSelectorPad
            options={oscWaveOptions}
            value={st.oscWave}
            onChange={mt.setOscWave}
          />
        </div>
        <div className="ml-[-12px]">
          <MotionKnobSet
            label="pitch"
            knobValue={st.oscPitch}
            setKnobValue={mt.setOscPitch}
            moId="moOscPitch"
            isModuleOn={st.oscOn}
            tickDisplaySteps={pitchModeTickStepMap[st.oscPitchMode]}
            parameterKey="oscPitch"
            modeButtonUi={
              <FeSelectorPad
                options={oscPitchModeOptions}
                value={st.oscPitchMode}
                onChange={mt.setOscPitchMode}
              />
            }
            moExButtonUi={
              <FePadButton
                unitSize="u11"
                active={st.oscPitchMoSmooth}
                onClick={mt.toggleOscPitchMoSmooth}
                children={<Icons.EaseInOut size={22} />}
              />
            }
          />
        </div>
        <div className="ml-[-12px]">
          <MotionKnobSet
            label="color"
            knobValue={st.oscColor}
            setKnobValue={mt.setOscColor}
            moId="moOscColor"
            isModuleOn={st.oscOn}
            parameterKey="oscColor"
            modeButtonUi={
              <FeSelectorPad
                options={oscColorModeOptions}
                value={st.oscColorMode}
                onChange={mt.setOscColorMode}
              />
            }
          />
        </div>
        <div className="flex-vc gap-0.5 ml-[-12px]">
          <FeKnob
            label="detune"
            value={st.oscUnisonDetune}
            onChange={mt.setOscUnisonDetune}
            size="small"
            onStartEdit={() => mt.setEditTarget("oscUnisonDetune")}
            onEndEdit={() => mt.setEditTarget(null)}
          />
          <FeSelectorPad
            options={oscUnisonModeOptions}
            value={st.oscUnisonMode}
            onChange={mt.setOscUnisonMode}
          />
        </div>
      </div>
    </div>
  );
};

const FilterSection = () => {
  const st = store.useSnapshot();
  const mt = store.mutations;
  return (
    <div css={cssSectionFrameUpper}>
      <FeModuleHeader
        label="Filter"
        active={st.filterOn}
        onClick={mt.toggleFilterOn}
      />
      <div className="flex-h gap-2">
        <MotionKnobSet
          label="cutoff"
          knobValue={st.filterCutoff}
          setKnobValue={mt.setFilterCutoff}
          moId="moFilterCutoff"
          isModuleOn={st.filterOn}
          parameterKey="filterCutoff"
        />
        <MotionNeighborKnob
          label="peak"
          value={st.filterPeak}
          onChange={mt.setFilterPeak}
          parameterKey="filterPeak"
        />
      </div>
    </div>
  );
};

const AmplifierSection = () => {
  const st = store.useSnapshot();
  const mt = store.mutations;
  const waveFn = useAmpEgWaveFn(st.ampEgHold, st.ampEgDecay);
  return (
    <div css={cssSectionFrameUpper}>
      <div className="flex-hs gap-2">
        <FeModuleHeader
          label="Amp"
          active={st.ampOn}
          onClick={mt.toggleAmpOn}
        />
        <FlexSpacer />
        <div className="mb-[-40px]">
          <FeWaveDisplay waveFn={waveFn} />
        </div>
      </div>
      <div className="flex-h gap-2 justify-around">
        <MotionNeighborKnob
          label="hold"
          value={st.ampEgHold}
          onChange={mt.setAmpEgHold}
          parameterKey="ampEgHold"
        />
        <MotionNeighborKnob
          label="decay"
          value={st.ampEgDecay}
          onChange={mt.setAmpEgDecay}
          parameterKey="ampEgDecay"
        />
      </div>
    </div>
  );
};

const ShaperSection = () => {
  const st = store.useSnapshot();
  const mt = store.mutations;
  return (
    <div css={cssSectionFrameLower}>
      <FeModuleHeader
        label="Shaper"
        active={st.shaperOn}
        onClick={mt.toggleShaperOn}
      />
      <div className="flex-ha gap-2 justify-around">
        <div className="mt-1.5">
          <FeSelectorPad
            options={shaperModeOptions}
            value={st.shaperMode}
            onChange={mt.setShaperMode}
          />
        </div>
        <MotionKnobSet
          label="level"
          knobValue={st.shaperLevel}
          setKnobValue={mt.setShaperLevel}
          moId="moShaperLevel"
          isModuleOn={st.shaperOn}
          parameterKey="shaperLevel"
        />
      </div>
    </div>
  );
};

const PhaserSection = () => {
  const st = store.useSnapshot();
  const mt = store.mutations;
  return (
    <div css={cssSectionFrameLower}>
      <FeModuleHeader
        label="Phaser"
        active={st.phaserOn}
        onClick={mt.togglePhaserOn}
      />
      <div className="flex-ha gap-2 justify-around">
        <MotionKnobSet
          label="level"
          knobValue={st.phaserLevel}
          setKnobValue={mt.setPhaserLevel}
          moId="moPhaserLevel"
          isModuleOn={st.phaserOn}
          parameterKey="phaserLevel"
        />
      </div>
    </div>
  );
};

const FlangerSection = () => {
  const st = store.useSnapshot();
  const mt = store.mutations;
  return (
    <div css={cssSectionFrameLower}>
      <FeModuleHeader
        label="Flanger"
        active={st.delayOn}
        onClick={mt.toggleDelayOn}
      />
      <div className="flex-h gap-2">
        <MotionKnobSet
          label="time"
          knobValue={st.delayTime}
          setKnobValue={mt.setDelayTime}
          moId="moDelayTime"
          isModuleOn={st.delayOn}
          parameterKey="delayTime"
        />
        <MotionNeighborKnob
          label="feed"
          value={st.delayFeed}
          onChange={mt.setDelayFeed}
          parameterKey="delayFeed"
        />
      </div>
    </div>
  );
};

const StepDelaySection = () => {
  const st = store.useSnapshot();
  const mt = store.mutations;
  return (
    <div css={cssSectionFrameLower}>
      <div className="flex-hs gap-2">
        <FeModuleHeader
          label="Delay"
          active={st.stepDelayOn}
          onClick={mt.toggleStepDelayOn}
        />
        <FlexSpacer />
        <div className="mb-[-40px]">
          <FeSelectorPad
            options={delayStepOptions}
            value={st.stepDelayStep}
            onChange={mt.setStepDelayStep}
            bidirectional
          />
        </div>
      </div>
      <div className="flex-h gap-2 justify-around">
        <MotionNeighborKnob
          label="feed"
          value={st.stepDelayFeed}
          onChange={mt.setStepDelayFeed}
          parameterKey="stepDelayFeed"
        />
        <MotionNeighborKnob
          label="mix"
          value={st.stepDelayMix}
          onChange={mt.setStepDelayMix}
          parameterKey="stepDelayMix"
        />
      </div>
    </div>
  );
};

const GaterSection = () => {
  const st = store.useSnapshot();
  const mt = store.mutations;
  return (
    <div className="flex-v gap-2" css={cssSectionFrameBottom}>
      <div className="flex-hs gap-2">
        <FeModuleHeader label="Gate" />
        <FlexSpacer />
        <FeSelectorPad
          options={gaterTypeOptions}
          value={st.gaterType}
          onChange={mt.setGaterType}
          unitSize="u15"
        />
        <FeSelectorPad
          value={st.gaterStride}
          onChange={mt.setGaterStride}
          options={gaterSourceStrideOptions}
          bidirectional
        />
      </div>
      {st.gaterType === GaterType.seq && (
        <div className="flex-c gap-1.5">
          <StepCellPadsMain />
        </div>
      )}
      {st.gaterType === GaterType.lax && (
        <div className="flex-c gap-4">
          <FePadButton
            children="rnd-tie"
            active={st.gaterRndTieOn}
            onClick={mt.toggleGaterRndTieOn}
          />
          <div className="my-[-2px]">
            <FeKnob
              label="cover"
              value={st.gaterRndTieCover}
              onChange={mt.setGaterRndTieCover}
              size="xs"
              onStartEdit={() => mt.setEditTarget("gaterRndTieCover")}
              onEndEdit={() => mt.setEditTarget(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

const ExStepsSection = () => {
  const st = store.useSnapshot();
  const mt = store.mutations;
  return (
    <div className="flex-v gap-2" css={cssSectionFrameBottom}>
      <div className="flex-hs gap-2">
        <FeModuleHeader label="EX Steps" />
        <FlexSpacer />
        <FeSelectorPad
          value={st.exGaterSeqStride}
          onChange={mt.setExGaterSeqStride}
          options={gaterExSourceStrideOptions}
          bidirectional
        />
      </div>
      <div className="flex-c gap-1.5">
        <StepCellPadsEx />
      </div>
    </div>
  );
};

const KickSection = () => {
  const st = store.useSnapshot();
  const mt = store.mutations;
  return (
    <div className="flex-v gap-1" css={cssSectionFrameBottom}>
      <FeModuleHeader label="Kick" />
      <div className="flex-c gap-4 grow">
        <FeSelectorPad
          options={kickPresetKeyOptions}
          value={st.kickPresetKey}
          onChange={mt.setKickPresetKey}
        />
        <FeKnob
          label="volume"
          value={st.kickVolume}
          onChange={mt.setKickVolume}
          size="xs"
          onStartEdit={() => mt.setEditTarget("kickVolume")}
          onEndEdit={() => mt.setEditTarget(null)}
        />
      </div>
    </div>
  );
};

const BassSection = () => {
  const st = store.useSnapshot();
  const mt = store.mutations;
  return (
    <div className="flex-v gap-1" css={cssSectionFrameBottom}>
      <FeModuleHeader label="Bass" />
      <div className="flex-c gap-3">
        <div className="flex-v gap-1">
          <FeSelectorPad
            options={bassPresetKeyOptions}
            value={st.bassPresetKey}
            onChange={mt.setBassPresetKey}
          />
          <FeSelectorPad
            label="tail note"
            options={bassTailAccentPatternKeyOptions}
            value={st.bassTailAccentPatternKey}
            onChange={mt.setBassTailAccentPatternKey}
          />
        </div>
        <FeKnob
          label="duty"
          value={st.bassDuty}
          onChange={mt.setBassDuty}
          size="xs"
          onStartEdit={() => mt.setEditTarget("bassDuty")}
          onEndEdit={() => mt.setEditTarget(null)}
        />
        <FeKnob
          label="volume"
          value={st.bassVolume}
          onChange={mt.setBassVolume}
          size="xs"
          onStartEdit={() => mt.setEditTarget("bassVolume")}
          onEndEdit={() => mt.setEditTarget(null)}
        />
      </div>
    </div>
  );
};

const VolumesSection = () => {
  const st = store.useSnapshot();
  const mt = store.mutations;
  return (
    <div className="flex-ha justify-around px-5" css={cssSectionFrameBlank}>
      <FeKnob
        label="volume"
        value={st.synthVolume}
        onChange={mt.setSynthVolume}
        size="small"
        altBkColor
        onStartEdit={() => mt.setEditTarget("synthVolume")}
        onEndEdit={() => mt.setEditTarget(null)}
      />
      <FeKnob
        label="master"
        value={st.masterVolume}
        onChange={mt.setMasterVolume}
        size="small"
        altBkColor
        onStartEdit={() => mt.setEditTarget("masterVolume")}
        onEndEdit={() => mt.setEditTarget(null)}
      />
    </div>
  );
};

const MachineLogoSection = () => {
  const logoColor = feColorDefs.machineLogo;
  return (
    <div className="relative mt-5" css={cssSectionFrameBlank}>
      <div className="h-full flex-vc gap-1">
        <CyclerLogoWithText height={36} color={logoColor} />
        <MachineNameLabel label="XS02" color={logoColor} size={60} />
      </div>
      {appEnvs.isDevelopment && (
        <div className="absolute bottom-0 left-0">
          <FullscreenButton />
        </div>
      )}
    </div>
  );
};

const PlayControlSection = () => {
  const st = store.useSnapshot();
  const mt = store.mutations;
  const bpmEditable = st.isStandalone;
  return (
    <div className="flex-v gap-0" css={cssSectionFrameBottom}>
      <div className="flex-h gap-2 items-start">
        <FePadButton
          children={<Icons.Loop size={22} />}
          unitSize="u11"
          active={st.looped}
          onClick={mt.toggleLooped}
        />
        <FeSelectorPad
          label="bars"
          options={loopBarsOptions}
          value={st.loopBars}
          onChange={mt.setLoopBars}
        />
        <FlexSpacer />
        {bpmEditable ? (
          <FeBpmControlDisplay
            bpm={st.internalBpm}
            setBpm={mt.setInternalBpm}
            min={bpmRanges.min}
            max={bpmRanges.max}
          />
        ) : (
          <FeBpmControlDisplayReadonly bpm={st.internalBpm} />
        )}
      </div>
      <FlexSpacer />
      <div className="flex-h gap-2 items-end">
        <FePadButtonRawSize
          children={<Icons.Play size={28} />}
          height={50}
          width={70}
          active={st.groovePlaying}
          onClick={actions.togglePlayState}
        />
        <FlexSpacer />
        <FePadButton
          children="beat"
          active={st.clockingOn}
          onClick={mt.toggleClockingOn}
        />
        <KeySettingsButton
          baseNoteIndex={st.baseNoteIndex}
          setBaseNoteIndex={mt.setBaseNoteIndex}
        />
      </div>
    </div>
  );
};

const RandomControlSection = () => {
  const st = store.useSnapshot();
  const mt = store.mutations;
  return (
    <div className="flex-v gap-2" css={cssSectionFrameBottom}>
      <div className="flex-h justify-between">
        <div className="flex-h gap-3">
          <FePadButton
            active={st.altBottomUi}
            onClick={mt.toggleAltBottomUi}
            children={<Icons.Sliders size={24} />}
            unitSize="u11"
          />
          <FePadButton
            children={<Icons.MousePointerClick size={20} />}
            onClick={mt.toggleTouchPointerVisible}
            unitSize="u11"
            active={st.touchPointerVisible}
          />
        </div>
        <FlexSpacer />
        <FePadButton
          active={st.autoRandomizeOnLoop}
          onClick={mt.toggleAutoRandomizeOnLoop}
          children={
            <FeButtonContentTwoColumn textSize={12} negativeGap={2}>
              <div>auto rnd</div>
              <Icons.ArrowRight size={14} />
            </FeButtonContentTwoColumn>
          }
          unitSize={1.6}
        />
      </div>
      <FlexSpacer />
      <div className="flex-h">
        <FePadButton
          children="init"
          onClick={actions.resetParameters}
          unitSize="u20"
        />
        <FlexSpacer />
        <div className="flex-h gap-1.5">
          <FePadButton
            children="random"
            onClick={actions.randomizeParameters}
            unitSize="u20"
          />
          <FeSelectorPad
            options={randomizeLevelOptions}
            value={st.randomizeLevel}
            onChange={mt.setRandomizeLevel}
            bidirectional
            unitSize={1.6}
          />
        </div>
      </div>
    </div>
  );
};

const BottomInnerColumns = () => {
  const st = store.useSnapshot();
  return st.altBottomUi ? (
    <>
      <KickSection />
      <BassSection />
    </>
  ) : (
    <>
      <GaterSection />
      <ExStepsSection />
    </>
  );
};

const PanelMain = () => {
  return (
    <div className="flex-vc gap-2">
      <div className="flex-vc gap-0">
        <div className="flex-h gap-2">
          <MotionSection placement="upper" moId="moOscPitch" />
          <MotionSection placement="upper" moId="moOscColor" />
          <MotionSection placement="upper" moId="moFilterCutoff" />
          <VolumesSection />
        </div>
        <div className="flex-h gap-2">
          <OscSection />
          <FilterSection />
          <AmplifierSection />
        </div>
        <Spacer height={8} />
        <div className="flex-h gap-2">
          <ShaperSection />
          <PhaserSection />
          <FlangerSection />
          <StepDelaySection />
        </div>
        <div className="flex-h gap-2">
          <MotionSection placement="lower" moId="moShaperLevel" />
          <MotionSection placement="lower" moId="moPhaserLevel" />
          <MotionSection placement="lower" moId="moDelayTime" />
          <MachineLogoSection />
        </div>
      </div>
      <div className="flex-h gap-2 mt-[3px]">
        <PlayControlSection />
        <BottomInnerColumns />
        <RandomControlSection />
      </div>
    </div>
  );
};

const PanelFrame = ({ children }: { children: ReactNode }) => {
  const sc = 1.09;
  const w = (1200 / sc) >>> 0;
  const h = (860 / sc) >>> 0;
  return (
    <ScreenUiScaler designWidth={w} designHeight={h}>
      <div
        className={clsx(
          "flex-c size-full",
          //"border border-gray-400"
        )}
      >
        {children}
      </div>
    </ScreenUiScaler>
  );
};

const WrapTouchPointerView = () => {
  const st = store.useSnapshot();
  return st.touchPointerVisible ? <TouchPointerView /> : null;
};

export const RootPanel = () => {
  return (
    <>
      <div
        className="flex-c h-dvh"
        css={{
          background: feColorDefs.panelBg,
          color: feColorDefs.panelText,
          ...appFontSpecs,
          overflow: "hidden",
        }}
      >
        <PanelFrame>
          <PanelMain />
        </PanelFrame>
      </div>
      {/* {appEnvs.isWebDeployment && <PageGuard appName="xs02" />} */}
      <WrapTouchPointerView />
    </>
  );
};
