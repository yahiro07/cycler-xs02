#pragma once
#include "DspKernel.h"
#include "DspProcessHelper.h"
#import <AudioToolbox/AudioToolbox.h>

class DspRouteEntry {
private:
  DspKernel dspKernel;
  DspProcessHelper dspProcessHelper{dspKernel};

public:
  DspRouteEntry() {}

  void setChannelCount(UInt32 inputChannelCount, UInt32 outputChannelCount) {
    dspProcessHelper.setChannelCount(inputChannelCount, outputChannelCount);
  }
  AUInternalRenderBlock internalRenderBlock() {
    return dspProcessHelper.internalRenderBlock();
  }

  void initialize(int channelCount, double inSampleRate) {
    dspKernel.initialize(channelCount, inSampleRate);
  }

  void deInitialize() {}

  bool popRtHostEvent(RtHostEvent &outEvent) {
    return dspKernel.popRtHostEvent(outEvent);
  }

  void pushParameterChange(uint64_t address, float value) {
    dspKernel.pushParameterChange(address, value);
  }

  void pushInternalNote(int noteNumber, float velocity) {
    dspKernel.pushInternalNote(noteNumber, velocity);
  }

  void pushCustomCommand(uint64_t id, float value) {
    dspKernel.pushCustomCommand(id, value);
  }

  bool isBypassed() { return dspKernel.isBypassed(); }
  void setBypass(bool shouldBypass) { dspKernel.setBypass(shouldBypass); }

  void setParameter(AUParameterAddress address, AUValue value) {
    dspKernel.setParameter(address, value);
  }
  AUAudioFrameCount maximumFramesToRender() const {
    return dspKernel.maximumFramesToRender();
  }
  void setMaximumFramesToRender(const AUAudioFrameCount &maxFrames) {
    dspKernel.setMaximumFramesToRender(maxFrames);
  }
  void setMusicalContextBlock(AUHostMusicalContextBlock contextBlock) {
    dspKernel.setMusicalContextBlock(contextBlock);
  }
  MIDIProtocolID AudioUnitMIDIProtocol() const { return kMIDIProtocol_2_0; }

  bool extraLogic_pullRandomizeRequestFlag() {
    return dspKernel.extraLogic_pullRandomizeRequestFlag();
  }
};