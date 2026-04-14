#pragma once
#include "master-gain-config.h"

namespace dsp {

enum class OscWave {
  saw,
  rect,
  tri,
  sine,
};

enum class LfoWave {
  sine,
  rect,
  tri,
  saw,
};

enum class DelayStep {
  div16,
  div8,
  div4,
};

enum class OscPitchMode {
  linear,
  octave,
  oct_x,
  ratio,
  semi,
  map1,
  map2,
  map3,
};

enum class PureStride {
  div16,
  div8,
  div4,
  div2,
  mul1,
  mul2,
  mul4,
};

enum class GateStride {
  div16,
  div8,
  div4,
  div2,
  mul1,
  mul2,
  mul4,
  gate,
};

enum class MotionStride {
  div16 = 0,
  div8,
  div4,
  div2,
  mul1,
  mul2,
  mul4,
  gate,
  ex,
};

enum class GaterSourceStride {
  div16,
  div8,
  div4,
};

enum class GaterExSourceStride {
  div16,
  div8,
  div4,
  div2,
  mul1,
};

enum class GaterType {
  seq,
  lax,
};

enum class GateSequencerCode {
  code0,
  code1,
  code2,
  code3,
  code4,
  code5,
};

enum class MoEgWave {
  d,
  d2,
  ad,
  bump,
  duty,
  stair,
};

enum class ExGaterCode {
  one,
  off,
  two,
  tie,
};

enum class MoRndMode {
  sh,
  sd,
  sg,
};

enum class OscColorMode {
  sfm,
  speed,
  accel,
  drill,
  sdm,
  creep,
  sinus,
  ridge,
};

enum class ShaperMode {
  ws1,
  ws2,
  ws3,
  ws4,
  ws5,
};

enum class OscUnisonMode {
  one,
  det2,
  det3,
  sub,
  fifth,
};

enum class MoType {
  lfo,
  eg,
  rnd,
};

enum class MoId {
  oscPitch,
  oscColor,
  filterCutoff,
  shaperLevel,
  delayTime,
  phaserLevel,
};

enum class KickPresetKey {
  kick1,
  kick2,
  kick3,
  kick4,
  kick5,
};

enum class BassPresetKey {
  bass1,
  bass2,
  bass3,
  bass4,
};

enum class BassTailAccentPatternKey {
  off,
  pattern1,
  pattern2,
  pattern3,
  pattern4,
};

enum class LoopBarsKey {
  bar1,
  bar2,
  bar4,
};

enum class RandomizeLevel {
  rnd1,
  rnd2,
  rnd5,
  rnd10,
  rnd20,
  rndFull,
};

struct MotionParams {
  bool moOn;
  MoType moType;
  float moAmount;
  MotionStride rndStride;
  MoRndMode rndMode;
  float rndCover;
  LfoWave lfoWave;
  float lfoRate;
  bool lfoRateStepped;
  bool lfoInvert;
  MotionStride egStride;
  MoEgWave egWave;
  float egCurve;
  bool egInvert;
};

struct SynthParametersSuit {
  // oscOn: boolean; already exists
  bool oscOn;
  OscWave oscWave;
  float oscPitch;
  OscPitchMode oscPitchMode;
  bool oscPitchMoSmooth;
  int oscOctave;
  float oscColor;
  OscColorMode oscColorMode;
  OscUnisonMode oscUnisonMode;
  float oscUnisonDetune;
  //
  bool filterOn;
  float filterCutoff;
  float filterPeak;
  //
  bool ampOn;
  float ampEgHold;
  float ampEgDecay;
  //
  bool shaperOn;
  ShaperMode shaperMode;
  float shaperLevel;
  //
  bool phaserOn;
  float phaserLevel;
  //
  bool delayOn;
  float delayTime;
  float delayFeed;
  //
  bool stepDelayOn;
  DelayStep stepDelayStep;
  float stepDelayFeed;
  float stepDelayMix;
  //
  MotionParams moOscPitch;
  MotionParams moOscColor;
  MotionParams moFilterCutoff;
  MotionParams moShaperLevel;
  MotionParams moPhaserLevel;
  MotionParams moDelayTime;
  //
  GaterSourceStride gaterStride;
  GaterType gaterType;
  bool gaterRndTieOn;
  float gaterRndTieCover;
  GateSequencerCode gaterSeqPatterns[4];
  GaterExSourceStride exGaterSeqStride;
  ExGaterCode exGaterCodes[4];
  //
  bool kickOn;
  KickPresetKey kickPresetKey;
  bool bassOn;
  float bassDuty;
  BassPresetKey bassPresetKey;
  BassTailAccentPatternKey bassTailAccentPatternKey;
  //
  float kickVolume;
  float bassVolume;
  float synthVolume;
  //
  bool looped;
  float masterVolume;
  bool clockingOn;
  int baseNoteIndex;
  //
  bool autoRandomizeOnLoop;
  RandomizeLevel randomizeLevel;
};

inline MotionParams createMotionParamsDefault() {
  return MotionParams{
      false,              // moOn
      MoType::rnd,        // moType
      0.5f,               // moAmount
      MotionStride::gate, // rndStride
      MoRndMode::sh,      // rndMode
      1.0f,               // rndCover
      LfoWave::sine,      // lfoWave
      0.5f,               // lfoRate
      false,              // lfoRateStepped
      false,              // lfoInvert
      MotionStride::gate, // egStride
      MoEgWave::d,        // egWave
      0.5f,               // egCurve
      false,              // egInvert
  };
}

inline SynthParametersSuit createSynthParametersSuit() {

  auto motionDefault = createMotionParamsDefault();

  SynthParametersSuit sp;
  sp.oscOn = true;
  sp.oscWave = OscWave::saw;
  sp.oscOctave = 0;
  sp.oscPitch = 0.5f;
  sp.oscPitchMode = OscPitchMode::octave;
  sp.oscPitchMoSmooth = false;
  sp.oscColor = 0.0f;
  sp.oscColorMode = OscColorMode::sfm;
  sp.oscUnisonMode = OscUnisonMode::one;
  sp.oscUnisonDetune = 0.0f;

  sp.filterOn = true;
  sp.filterCutoff = 1.0f;
  sp.filterPeak = 0.0f;

  sp.ampOn = true;
  sp.ampEgHold = 0.8f;
  sp.ampEgDecay = 0.0f;

  sp.shaperOn = false;
  sp.shaperMode = ShaperMode::ws1;
  sp.shaperLevel = 0.5f;

  sp.phaserOn = false;
  sp.phaserLevel = 0.5f;

  sp.delayOn = false;
  sp.delayTime = 0.5f;
  sp.delayFeed = 0.3f;

  sp.stepDelayOn = false;
  sp.stepDelayStep = DelayStep::div8;
  sp.stepDelayFeed = 0.5f;
  sp.stepDelayMix = 0.5f;

  sp.moOscPitch = motionDefault;
  sp.moOscPitch.moType = MoType::rnd;

  sp.moOscColor = motionDefault;
  sp.moOscColor.moType = MoType::eg;

  sp.moFilterCutoff = motionDefault;
  sp.moFilterCutoff.moType = MoType::lfo;

  sp.moShaperLevel = motionDefault;
  sp.moShaperLevel.moType = MoType::rnd;

  sp.moPhaserLevel = motionDefault;
  sp.moPhaserLevel.moType = MoType::eg;

  sp.moDelayTime = motionDefault;
  sp.moDelayTime.moType = MoType::lfo;

  sp.gaterStride = GaterSourceStride::div16;
  sp.gaterType = GaterType::seq;
  sp.gaterRndTieOn = false;
  sp.gaterRndTieCover = 0.5f;
  sp.gaterSeqPatterns[0] = GateSequencerCode::code0;
  sp.gaterSeqPatterns[1] = GateSequencerCode::code0;
  sp.gaterSeqPatterns[2] = GateSequencerCode::code0;
  sp.gaterSeqPatterns[3] = GateSequencerCode::code0;
  sp.exGaterSeqStride = GaterExSourceStride::div16;
  sp.exGaterCodes[0] = ExGaterCode::one;
  sp.exGaterCodes[1] = ExGaterCode::one;
  sp.exGaterCodes[2] = ExGaterCode::one;
  sp.exGaterCodes[3] = ExGaterCode::one;
  sp.kickOn = true;
  sp.kickPresetKey = KickPresetKey::kick1;
  sp.bassOn = true;
  sp.bassDuty = 0.6f;
  sp.bassPresetKey = BassPresetKey::bass1;
  sp.bassTailAccentPatternKey = BassTailAccentPatternKey::off;

  sp.kickVolume = 1.0f;
  sp.bassVolume = 1.0f;
  sp.synthVolume = 1.0f;

  sp.looped = false;
  sp.masterVolume = masterGainConfig.levelCenter;
  sp.clockingOn = true;
  sp.baseNoteIndex = 9; // A

  sp.autoRandomizeOnLoop = false;
  sp.randomizeLevel = RandomizeLevel::rnd10;

  return sp;
}

} // namespace dsp
