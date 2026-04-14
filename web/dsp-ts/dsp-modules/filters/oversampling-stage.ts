import { createOvsFilterButterworth } from "@dsp/dsp-modules/filters/ovs-filter-butterworth";
import { m_max } from "@dsp/utils/math-utils";

export type OversamplingStage = {
  ensureAllocated(maxFrames: number): void;
  readIn(
    originalBuffer: Float32Array,
    len: number,
    chainInput?: boolean,
  ): Float32Array | undefined;
  writeOut(): void;
};

const ovsHelper = {
  zeroStuffUpsampling(
    highResBuffer: Float32Array,
    originalBuffer: Float32Array,
    originalLength: number,
    nx: number,
  ) {
    highResBuffer.fill(0);
    for (let i = 0; i < originalLength; i++) {
      // Zero-stuff upsampling reduces average energy by ~1/nx.
      // Compensate here so the following interpolation LPF (unity DC gain)
      // preserves the input level for low/mid frequencies.
      highResBuffer[i * nx] = originalBuffer[i] * nx;
    }
  },
  decimate(
    highResBuffer: Float32Array,
    originalBuffer: Float32Array,
    originalLength: number,
    nx: number,
    decimateOffset: number,
  ) {
    for (let i = 0; i < originalLength; i++) {
      originalBuffer[i] = highResBuffer[i * nx + decimateOffset];
    }
  },
};

export function createOversamplingStage(
  oversampleRatio: number, cutoffScale = 1,
): OversamplingStage {
  const preFilter = createOvsFilterButterworth(oversampleRatio, cutoffScale, 8)
  const postFilter = createOvsFilterButterworth(oversampleRatio, cutoffScale, 8)
  const decimateOffset = m_max(0, oversampleRatio >> 1);

  const state = {
    // Buffer allocated in advance based on the maximum frame length (len=maxFrames*nx)
    highResBuffer: undefined as Float32Array | undefined,
    // Input buffer for each frame (len <= maxFrames)
    originalBuffer: undefined as Float32Array | undefined,
    originalLength: 0,
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
      originalLength: number,
      chainInput?: boolean,
    ): Float32Array | undefined {
      const nx = oversampleRatio;
      const { highResBuffer } = state;
      if (!highResBuffer) return undefined;
      if (chainInput) {
        ovsHelper.zeroStuffUpsampling(
          highResBuffer,
          originalBuffer,
          originalLength,
          nx,
        );
        preFilter.processSamples(highResBuffer, originalLength * nx);
      } else {
        highResBuffer.fill(0);
      }
      state.originalBuffer = originalBuffer;
      state.originalLength = originalLength;
      return highResBuffer;
    },
    writeOut() {
      const { highResBuffer, originalBuffer, originalLength } = state;
      if (!(highResBuffer && originalBuffer)) return;
      const nx = oversampleRatio;
      postFilter.processSamples(highResBuffer, originalLength * nx);
      ovsHelper.decimate(
        highResBuffer,
        originalBuffer,
        originalLength,
        nx,
        decimateOffset,
      );
    },
  };
  return self;
}
