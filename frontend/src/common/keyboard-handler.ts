export function setupKeyboardHandlerForTonePreview(
  callback: (state: boolean) => void,
) {
  window.addEventListener("keydown", (e) => {
    if (e.key === " ") {
      if (!e.repeat) {
        callback(true);
      }
      e.preventDefault(); //ページスクロールを抑止
    }
  });
  window.addEventListener("keyup", (e) => {
    if (e.key === " ") {
      if (!e.repeat) {
        callback(false);
      }
      e.preventDefault();
    }
  });
}
