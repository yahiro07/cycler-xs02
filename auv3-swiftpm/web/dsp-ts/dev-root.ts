import * as fs from "node:fs";
import { CommandId, ParameterId } from "@dsp/base/parameter-id";
import { createDspCoreInstance } from "@dsp/dsp-core-entry";
import {
  applyBufferGain,
  writeBuffer,
} from "@dsp/dsp-modules/basic/buffer-functions";
import { clampValue } from "@dsp/utils/number-utils";

function fourCC(fourcc: string): number {
  if (fourcc.length !== 4) {
    throw new Error(`FourCC must be 4 chars: "${fourcc}"`);
  }
  return (
    ((fourcc.charCodeAt(0) << 24) |
      (fourcc.charCodeAt(1) << 16) |
      (fourcc.charCodeAt(2) << 8) |
      (fourcc.charCodeAt(3) << 0)) >>>
    0
  );
}

function writeWav(filename: string, buffer: Float32Array, sampleRate: number) {
  const numChannels = 1;
  const bitsPerSample = 16;
  const byteRate = sampleRate * numChannels * (bitsPerSample / 8);
  const blockAlign = numChannels * (bitsPerSample / 8);
  const dataSize = buffer.length * (bitsPerSample / 8);

  const wavHeader = new DataView(new ArrayBuffer(44));
  wavHeader.setUint32(0, fourCC("RIFF"), false);
  wavHeader.setUint32(4, 36 + dataSize, true);
  wavHeader.setUint32(8, fourCC("WAVE"), false);
  wavHeader.setUint32(12, fourCC("fmt "), false);
  wavHeader.setUint32(16, 16, true);
  wavHeader.setUint16(20, 1, true);
  wavHeader.setUint16(22, numChannels, true);
  wavHeader.setUint32(24, sampleRate, true);
  wavHeader.setUint32(28, byteRate, true);
  wavHeader.setUint16(32, blockAlign, true);
  wavHeader.setUint16(34, bitsPerSample, true);
  wavHeader.setUint32(36, fourCC("data"), false);
  wavHeader.setUint32(40, dataSize, true);

  const wavData = new DataView(new ArrayBuffer(dataSize));
  if (0) {
    //check sine wave output
    let phase = 0;
    for (let i = 0; i < buffer.length; i++) {
      phase += 440 / sampleRate;
      phase %= 1;
      const y = Math.sin(phase * Math.PI * 2);
      const value = Math.round(y * 32767);
      wavData.setInt16(i * 2, value, true);
    }
  } else {
    for (let i = 0; i < buffer.length; i++) {
      const value = Math.round(clampValue(buffer[i], -1, 1) * 32767);
      wavData.setInt16(i * 2, value, true);
    }
  }

  const savingBuffer = new Uint8Array(44 + dataSize);
  savingBuffer.set(new Uint8Array(wavHeader.buffer.slice(0, 44)));
  savingBuffer.set(new Uint8Array(wavData.buffer), 44);

  fs.writeFileSync(filename, Buffer.from(savingBuffer));
}

function main() {
  const synth = createDspCoreInstance();

  const sampleRate = 48000;
  const durationSec = 2;
  const totalFrames = sampleRate * durationSec;
  const chunkSize = 256;

  synth.prepareProcessing(sampleRate, chunkSize);
  synth.setParameter(ParameterId.oscColor, 0.5);
  synth.setParameter(ParameterId.moOscColor_moOn, 1);
  synth.applyCommand(ParameterId.internalBpm, 120);
  synth.applyCommand(CommandId.setPlayState, 1);

  const outputBuffer = new Float32Array(totalFrames);

  const blockBufferLeft = new Float32Array(chunkSize);
  const blockBufferRight = new Float32Array(chunkSize);

  for (let i = 0; i < totalFrames; i += chunkSize) {
    blockBufferLeft.fill(0);
    blockBufferRight.fill(0);
    synth.processAudio(blockBufferLeft, blockBufferRight, chunkSize);
    writeBuffer(blockBufferLeft, blockBufferRight);
    applyBufferGain(blockBufferLeft, 0.5);
    outputBuffer.set(blockBufferLeft, i);
  }

  writeWav("output.wav", outputBuffer, sampleRate);
}

main();
