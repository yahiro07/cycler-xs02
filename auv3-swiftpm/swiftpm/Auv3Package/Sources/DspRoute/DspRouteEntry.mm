#include "./DspRouteEntry.h"
#include "./DspKernel.h"
#include "./DspProcessHelper.h"
#include <memory>

namespace {
DspRouteHostEvent mapRtHostEvent(const RtHostEvent &event) {
  DspRouteHostEvent mapped{};
  switch (event.type) {
  case RtHostEventType::None:
    mapped.type = DspRouteHostEventTypeNone;
    break;
  case RtHostEventType::NoteOn:
    mapped.type = DspRouteHostEventTypeNoteOn;
    mapped.noteNumber = event.noteOn.noteNumber;
    mapped.velocity = event.noteOn.velocity;
    break;
  case RtHostEventType::NoteOff:
    mapped.type = DspRouteHostEventTypeNoteOff;
    mapped.noteNumber = event.noteOff.noteNumber;
    break;
  case RtHostEventType::Tempo:
    mapped.type = DspRouteHostEventTypeTempo;
    mapped.tempo = event.tempo.tempo;
    break;
  case RtHostEventType::PlayState:
    mapped.type = DspRouteHostEventTypePlayState;
    mapped.isPlaying = event.playState.isPlaying;
    break;
  }
  return mapped;
}
} // namespace

@implementation DspRouteEntry {
  DspKernel dspKernel;
  std::unique_ptr<DspProcessHelper> dspProcessHelper;
}

- (instancetype)init {
  self = [super init];
  if (self) {
    dspProcessHelper = std::make_unique<DspProcessHelper>(dspKernel);
  }
  return self;
}

- (void)setChannelCount:(UInt32)inputChannelCount
     outputChannelCount:(UInt32)outputChannelCount {
  dspProcessHelper->setChannelCount(inputChannelCount, outputChannelCount);
}
- (void)initialize:(int)channelCount inSampleRate:(double)inSampleRate {
  dspKernel.initialize(channelCount, inSampleRate);
}
- (void)deInitialize {
  dspKernel.deInitialize();
}
- (AUInternalRenderBlock)internalRenderBlock {
  return dspProcessHelper->internalRenderBlock();
}
- (bool)popHostEvent:(DspRouteHostEvent *)outEvent {
  RtHostEvent rtEvent{};
  const bool popped = dspKernel.popRtHostEvent(rtEvent);
  if (!popped) {
    return false;
  }
  if (outEvent != nullptr) {
    *outEvent = mapRtHostEvent(rtEvent);
  }
  return true;
}
- (void)pushParameterChange:(uint64_t)address value:(float)value {
  dspKernel.pushParameterChange(address, value);
}
- (void)pushInternalNote:(int)noteNumber velocity:(float)velocity {
  dspKernel.pushInternalNote(noteNumber, velocity);
}
- (void)pushCustomCommand:(uint64_t)id value:(float)value {
  dspKernel.pushCustomCommand(id, value);
}
- (bool)isBypassed {
  return dspKernel.isBypassed();
}
- (void)setBypass:(bool)shouldBypass {
  dspKernel.setBypass(shouldBypass);
}
- (void)setParameter:(AUParameterAddress)address value:(AUValue)value {
  dspKernel.setParameter(address, value);
}
- (AUAudioFrameCount)maximumFramesToRender {
  return dspKernel.maximumFramesToRender();
}
- (void)setMaximumFramesToRender:(AUAudioFrameCount)maxFrames {
  dspKernel.setMaximumFramesToRender(maxFrames);
}
- (void)setMusicalContextBlock:(AUHostMusicalContextBlock)contextBlock {
  dspKernel.setMusicalContextBlock(contextBlock);
}
- (bool)extraLogic_pullRandomizeRequestFlag {
  return dspKernel.extraLogic_pullRandomizeRequestFlag();
}
- (void)extraLogic_randomizeParameters:(NSMutableDictionary<NSNumber *, NSNumber *> *)parameters {
  std::map<uint64_t, double> params;
  for (NSNumber *key in [parameters allKeys]) {
    params[key.unsignedLongLongValue] = [parameters objectForKey:key].doubleValue;
  }
  dspKernel.extraLogic_randomizeParameters(params);
  for (const auto& pair : params) {
    parameters[@(pair.first)] = @(pair.second);
  }
}
@end
