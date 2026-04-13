#include "./base/api.h"
#include "./synthesizer-root.h"

namespace dsp {

IDspCore *createDspCoreInstance() {
  konsole.debugLog("createDspCoreInstance");
  return new SynthesizerRoot();
}

} // namespace dsp