const isDebug = (window as unknown as { isDebug: boolean }).isDebug;

export const konsole = {
  log(message: string) {
    console.log(message);
  },
  debugLog(message: string) {
    if (!isDebug) return;
    console.log(message);
  },
};

export function debugEmitError(message: string) {
  if (!isDebug) return;
  throw new Error(message);
}
