#include "./base/api.h"
#include "./synthesizer-root.h"

namespace dsp {

IDspCore *createDspCoreInstance() { return new SynthesizerRoot(); }

} // namespace dsp