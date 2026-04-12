#pragma once
#include "../../utils/math-utils.h"
#include "../../utils/number-utils.h"
#include "wave-frame-helper.h"
#include <memory>
#include <vector>

namespace dsp {

enum class BlWaveWaveform {
  saw,
  rect,
  tri,
  sine,
};

struct BlWave {
  bool initialized;
  std::vector<std::vector<float>> waveFrameTables_saw;
  std::vector<std::vector<float>> waveFrameTables_rect;
  std::vector<std::vector<float>> waveFrameTables_tri;
  std::vector<int> tableIndexMapper;
  int numHarmonicsMax;

  BlWave() : initialized(false), numHarmonicsMax(0) {}
};

inline void blWave_buildWaveTables(BlWave &self) {
  if (self.initialized)
    return;

  const int tableHarmonicsSeries[] = {
      1,  2,   3,   4,   5,   6,   7,   8,   9,    10,   11,   12,   13,  14,
      15, 16,  18,  20,  22,  24,  26,  29,  32,   37,   42,   48,   56,  64,
      81, 102, 128, 181, 256, 362, 512, 724, 1024, 1448, 2048, 2896, 4096};
  const int numTables = 41;

  // Build saw wave tables
  for (int i = 0; i < numTables; i++) {
    int h = tableHarmonicsSeries[i];
    int waveFrameSize = calculateWaveFrameSize(h);
    std::vector<float> buffer(waveFrameSize);
    for (int j = 0; j < waveFrameSize; j++) {
      float x = (static_cast<float>(j) / static_cast<float>(waveFrameSize)) *
                m_two_pi;
      float value = 0.0f;
      for (int k = 1; k <= h; k++) {
        float sign = (k % 2 == 0) ? 1.0f : -1.0f;
        value += (sign * m_sin(k * (x + m_pi))) / static_cast<float>(k);
      }
      buffer[j] = value * (2.0f / m_pi);
    }
    self.waveFrameTables_saw.push_back(buffer);
  }

  // Build rect wave tables
  for (int i = 0; i < numTables; i++) {
    int n = tableHarmonicsSeries[i];
    int waveFrameSize = calculateWaveFrameSize(n);
    std::vector<float> buffer(waveFrameSize);
    for (int j = 0; j < waveFrameSize; j++) {
      float x = (static_cast<float>(j) / static_cast<float>(waveFrameSize)) *
                m_two_pi;
      float value = 0.0f;
      for (int k = 1; k <= n; k += 2) {
        float y =
            (1.0f / static_cast<float>(k)) * m_sin(static_cast<float>(k) * x);
        value += y;
      }
      buffer[j] = value * (4.0f / m_pi);
    }
    self.waveFrameTables_rect.push_back(buffer);
  }

  // Build tri wave tables
  for (int i = 0; i < numTables; i++) {
    int n = tableHarmonicsSeries[i];
    int waveFrameSize = calculateWaveFrameSize(n);
    std::vector<float> buffer(waveFrameSize);
    for (int j = 0; j < waveFrameSize; j++) {
      float x = (static_cast<float>(j) / static_cast<float>(waveFrameSize)) *
                m_two_pi;
      float value = 0.0f;
      int harmonicIndex = 0;
      for (int k = 1; k <= n; k += 2) {
        float sign = (harmonicIndex % 2 == 0) ? 1.0f : -1.0f;
        float y = sign * (1.0f / static_cast<float>(k * k)) *
                  m_sin(static_cast<float>(k) * x);
        value += y;
        harmonicIndex++;
      }
      buffer[j] = value * (8.0f / (m_pi * m_pi));
    }
    self.waveFrameTables_tri.push_back(buffer);
  }

  int numHarmonicsMax = tableHarmonicsSeries[numTables - 1];
  self.tableIndexMapper.resize(numHarmonicsMax + 1);
  for (int nh = 0; nh <= numHarmonicsMax; nh++) {
    int idx = -1;
    for (int i = numTables - 1; i >= 0; i--) {
      if (tableHarmonicsSeries[i] <= nh) {
        idx = i;
        break;
      }
    }
    self.tableIndexMapper[nh] = (idx == -1) ? 0 : idx;
  }

  self.numHarmonicsMax = numHarmonicsMax;
  self.initialized = true;
}

inline float blWave_getWaveformSample(const BlWave &self,
                                      BlWaveWaveform waveform, float pp,
                                      float normFreq) {
  if (!self.initialized)
    return 0.0f;

  if (waveform == BlWaveWaveform::sine) {
    return m_sin(pp * m_two_pi);
  }

  pp -= m_floor(pp);
  int nh = static_cast<int>(clampValue(
      (0.45f / normFreq), 1.0f, static_cast<float>(self.numHarmonicsMax)));
  int ti = self.tableIndexMapper[nh];

  const std::vector<float> *waveFrame;
  switch (waveform) {
  case BlWaveWaveform::saw:
    waveFrame = &self.waveFrameTables_saw[ti];
    break;
  case BlWaveWaveform::rect:
    waveFrame = &self.waveFrameTables_rect[ti];
    break;
  case BlWaveWaveform::tri:
    waveFrame = &self.waveFrameTables_tri[ti];
    break;
  default:
    return 0.0f;
  }

  return readWaveFrameInterpolated(waveFrame->data(), waveFrame->size(), pp);
}

class BlWaveProvider {
public:
  void setupTables() { blWave_buildWaveTables(blWaveInstance); }

  // In Safari on iOS, calling time-consuming operations within a Worklet slows
  // down subsequent operations, so the waveform table is created on the main
  // thread and injected
  void setBlWaveInstance(BlWave blWave) { blWaveInstance = std::move(blWave); }

  float getWaveformSample(BlWaveWaveform waveform, float pp, float normFreq) {
    return blWave_getWaveformSample(blWaveInstance, waveform, pp, normFreq);
  }

private:
  BlWave blWaveInstance;
};

inline BlWaveProvider blWaveProvider;

} // namespace dsp
