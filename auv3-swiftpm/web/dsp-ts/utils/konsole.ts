export const dspEnvs = {
  isDebug: false,
}

export const konsole = {
  isDebug: false,

  log(message: string) {
    console.log(message);
  },
  debugLog(message: string) {
    if (!dspEnvs.isDebug) return;
    console.log(message);
  },
};

export function debugEmitError(message: string) {
  if (!dspEnvs.isDebug) return;
  throw new Error(message);
}
