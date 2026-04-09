#pragma once
#include "./DspRouteHostEvent.h"
#import <AudioToolbox/AudioToolbox.h>
#include <objc/NSObject.h>

@interface DspRouteEntry : NSObject
- (void)setChannelCount:(UInt32)inputChannelCount
     outputChannelCount:(UInt32)outputChannelCount
    NS_SWIFT_NAME(setChannelCount(_:_:));
- (void)initialize:(int)channelCount
      inSampleRate:(double)inSampleRate NS_SWIFT_NAME(initialize(_:_:));
- (void)deInitialize;
- (AUInternalRenderBlock)internalRenderBlock;
- (bool)popHostEvent:(DspRouteHostEvent *)outEvent
    NS_SWIFT_NAME(popHostEvent(_:));
- (void)pushParameterChange:(uint64_t)address
                      value:(float)value
    NS_SWIFT_NAME(pushParameterChange(_:_:));
- (void)pushInternalNote:(int)noteNumber
                velocity:(float)velocity NS_SWIFT_NAME(pushInternalNote(_:_:));
- (void)pushCustomCommand:(uint64_t)id
                    value:(float)value NS_SWIFT_NAME(pushCustomCommand(_:_:));
- (bool)isBypassed;
- (void)setBypass:(bool)shouldBypass;
- (void)setParameter:(AUParameterAddress)address
               value:(AUValue)value NS_SWIFT_NAME(setParameter(_:_:));
- (AUAudioFrameCount)maximumFramesToRender;
- (void)setMaximumFramesToRender:(AUAudioFrameCount)maxFrames
    NS_SWIFT_NAME(setMaximumFramesToRender(_:));
- (void)setMusicalContextBlock:(AUHostMusicalContextBlock)contextBlock;
- (bool)extraLogic_pullRandomizeRequestFlag;
@end
