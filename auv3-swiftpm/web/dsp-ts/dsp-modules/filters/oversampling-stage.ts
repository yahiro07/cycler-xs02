import { createOvsFilterSimple } from "@core/dsp-modules/filters/ovs-filter";
import { createOvsFilterButterworth } from "@core/dsp-modules/filters/ovs-filter-butterworth";
import { m_max } from "@core/utils/math-utils";

export type OversamplingStage = {
  ensureAllocated(maxFrames: number): void;
  readIn(
    originalBuffer: Float32Array,
    chainInput?: boolean,
  ): Float32Array | undefined;
  writeOut(): void;
};

const ovsHelper = {
  zeroStuffUpsampling(
    highResBuffer: Float32Array,
    originalBuffer: Float32Array,
    nx: number,
  ) {
    highResBuffer.fill(0);
    for (let i = 0; i < originalBuffer.length; i++) {
      // Zero-stuff upsampling reduces average energy by ~1/nx.
      // Compensate here so the following interpolation LPF (unity DC gain)
      // preserves the input level for low/mid frequencies.
      highResBuffer[i * nx] = originalBuffer[i] * nx;
    }
  },
  decimate(
    highResBuffer: Float32Array,
    originalBuffer: Float32Array,
    nx: number,
    decimateOffset: number,
  ) {
    for (let i = 0; i < originalBuffer.length; i++) {
      originalBuffer[i] = highResBuffer[i * nx + decimateOffset];
    }
  },
};

export function createOversamplingStage(
  oversampleRatio: number,
  filterKind: "simple" | "butterworth8" = "butterworth8",
  cutoffScale = 1,
): OversamplingStage {
  const createFilter = () => {
    if (filterKind === "butterworth8") {
      return createOvsFilterButterworth(oversampleRatio, cutoffScale, 8);
    }
    return createOvsFilterSimple(oversampleRatio, cutoffScale);
  };
  const preFilter = createFilter();
  const postFilter = createFilter();
  const decimateOffset = m_max(0, oversampleRatio >> 1);

  const state = {
    // Buffer allocated in advance based on the maximum frame length (len=maxFrames*nx)
    highResBuffer: undefined as Float32Array | undefined,
    // Input buffer for each frame (len <= maxFrames)
    originalBuffer: undefined as Float32Array | undefined,
  };
  const self = {
    ensureAllocated(maxFrames: number) {
      const len = maxFrames * oversampleRatio;
      if (!state.highResBuffer || state.highResBuffer.length !== len) {
        state.highResBuffer = new Float32Array(len);
        preFilter.reset();
        postFilter.reset();
      }
    },
    readIn(
      originalBuffer: Float32Array,
      chainInput?: boolean,
    ): Float32Array | undefined {
      const nx = oversampleRatio;
      const { highResBuffer } = state;
      if (!highResBuffer) return undefined;
      if (chainInput) {
        ovsHelper.zeroStuffUpsampling(highResBuffer, originalBuffer, nx);
        preFilter.processSamples(highResBuffer);
      } else {
        highResBuffer.fill(0);
      }
      state.originalBuffer = originalBuffer;
      return highResBuffer;
    },
    writeOut() {
      const { highResBuffer, originalBuffer } = state;
      if (!(highResBuffer && originalBuffer)) return;
      const nx = oversampleRatio;
      postFilter.processSamples(highResBuffer);
      ovsHelper.decimate(highResBuffer, originalBuffer, nx, decimateOffset);
    },
  };
  return self;
}
