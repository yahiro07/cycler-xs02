#include "./base/parameter-id.h"
#include "./dsp-modules/basic/buffer-functions.h"
#include "./synthesizer-root.h"
#include "./utils/number-utils.h"
#include <cmath>
#include <cstdint>
#include <cstdio>
#include <cstring>
#include <vector>

using namespace dsp;

static uint32_t fourCC(const char *s) {
  return ((uint32_t)(uint8_t)s[0] << 24) | ((uint32_t)(uint8_t)s[1] << 16) |
         ((uint32_t)(uint8_t)s[2] << 8) | ((uint32_t)(uint8_t)s[3] << 0);
}

static void writeU16LE(uint8_t *buf, uint16_t v) {
  buf[0] = v & 0xFF;
  buf[1] = (v >> 8) & 0xFF;
}

static void writeU32LE(uint8_t *buf, uint32_t v) {
  buf[0] = v & 0xFF;
  buf[1] = (v >> 8) & 0xFF;
  buf[2] = (v >> 16) & 0xFF;
  buf[3] = (v >> 24) & 0xFF;
}

static void writeU32BE(uint8_t *buf, uint32_t v) {
  buf[0] = (v >> 24) & 0xFF;
  buf[1] = (v >> 16) & 0xFF;
  buf[2] = (v >> 8) & 0xFF;
  buf[3] = v & 0xFF;
}

static void writeWav(const char *filename, const float *buffer, int numFrames,
                     int sampleRate) {
  const int numChannels = 1;
  const int bitsPerSample = 16;
  const int byteRate = sampleRate * numChannels * (bitsPerSample / 8);
  const int blockAlign = numChannels * (bitsPerSample / 8);
  const int dataSize = numFrames * (bitsPerSample / 8);

  uint8_t header[44];
  writeU32BE(header + 0, fourCC("RIFF"));
  writeU32LE(header + 4, 36 + dataSize);
  writeU32BE(header + 8, fourCC("WAVE"));
  writeU32BE(header + 12, fourCC("fmt "));
  writeU32LE(header + 16, 16);
  writeU16LE(header + 20, 1); // PCM
  writeU16LE(header + 22, numChannels);
  writeU32LE(header + 24, sampleRate);
  writeU32LE(header + 28, byteRate);
  writeU16LE(header + 32, blockAlign);
  writeU16LE(header + 34, bitsPerSample);
  writeU32BE(header + 36, fourCC("data"));
  writeU32LE(header + 40, dataSize);

  std::vector<uint8_t> wavData(dataSize);
  for (int i = 0; i < numFrames; i++) {
    float clamped = clampValue(buffer[i], -1.0f, 1.0f);
    int16_t value = static_cast<int16_t>(std::round(clamped * 32767.0f));
    wavData[i * 2 + 0] = value & 0xFF;
    wavData[i * 2 + 1] = (value >> 8) & 0xFF;
  }

  FILE *f = fopen(filename, "wb");
  if (!f) {
    fprintf(stderr, "Failed to open %s for writing\n", filename);
    return;
  }
  fwrite(header, 1, 44, f);
  fwrite(wavData.data(), 1, dataSize, f);
  fclose(f);
  printf("Written: %s\n", filename);
}

int main() {
  printf("dev-root\n");

  SynthesizerRoot synth;

  const int sampleRate = 48000;
  const int durationSec = 2;
  const int totalFrames = sampleRate * durationSec;
  const int chunkSize = 256;

  synth.prepareProcessing(sampleRate, chunkSize);
  synth.setParameter(static_cast<uint64_t>(ParameterId::oscColor), 0.5f);
  synth.setParameter(static_cast<uint64_t>(ParameterId::moOscColor_moOn), 1.0f);
  synth.applyCommand(static_cast<uint64_t>(ParameterId::internalBpm), 120.0f);
  synth.applyCommand(static_cast<uint64_t>(CommandId::setPlayState), 1.0f);

  std::vector<float> outputBuffer(totalFrames, 0.0f);
  std::vector<float> blockBufferLeft(chunkSize, 0.0f);
  std::vector<float> blockBufferRight(chunkSize, 0.0f);

  for (int i = 0; i < totalFrames; i += chunkSize) {
    std::fill(blockBufferLeft.begin(), blockBufferLeft.end(), 0.0f);
    std::fill(blockBufferRight.begin(), blockBufferRight.end(), 0.0f);
    synth.processAudio(blockBufferLeft.data(), blockBufferRight.data(),
                       chunkSize);
    applyBufferGain(blockBufferLeft.data(), chunkSize, 0.5f);
    std::memcpy(outputBuffer.data() + i, blockBufferLeft.data(),
                chunkSize * sizeof(float));
  }

  writeWav("output.wav", outputBuffer.data(), totalFrames, sampleRate);
  return 0;
}