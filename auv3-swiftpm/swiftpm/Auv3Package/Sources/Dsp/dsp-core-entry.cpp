#include "./base/api.h"
#include "./synthesizer-root.h"

namespace dsp {

IDspCore *createDspCoreInstance() {
  konsole.debugLog("createDspCoreInstance 1925");
  return new SynthesizerRoot();
}

} // namespace dsp