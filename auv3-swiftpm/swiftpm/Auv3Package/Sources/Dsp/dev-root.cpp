#include "./base/parameter-id.h"
#include "./synthesizer-root.h"

using namespace dsp;

int main() {
  printf("dev-root\n");
  SynthesizerRoot synth;
  synth.prepareProcessing(48000, 256);
  synth.setParameter(ParameterId::oscColor, 0.5);
  synth.setParameter(ParameterId::moOscColor_moOn, 1);
  synth.applyCommand(ParameterId::internalBpm, 120);
  synth.applyCommand(CommandId::setPlayState, 1);
  // todo: process 2sec buffers and save output.wav
}