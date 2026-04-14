#pragma once

#include <Foundation/NSObjCRuntime.h>
#include <stdbool.h>
#include <stdint.h>

typedef NS_ENUM(NSInteger, DspRouteHostEventType) {
  DspRouteHostEventTypeNone = 0,
  DspRouteHostEventTypeNoteOn,
  DspRouteHostEventTypeNoteOff,
  DspRouteHostEventTypeTempo,
  DspRouteHostEventTypePlayState,
};

typedef struct DspRouteHostEvent {
  DspRouteHostEventType type;
  int32_t noteNumber;
  float velocity;
  float tempo;
  bool isPlaying;
} DspRouteHostEvent;
