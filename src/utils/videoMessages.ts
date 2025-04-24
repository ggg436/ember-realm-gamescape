
export const sendVideoMessage = (
  contentWindow: Window | null,
  action: string,
  value?: number
) => {
  if (contentWindow) {
    contentWindow.postMessage(
      JSON.stringify({ action, ...(value !== undefined ? { value } : {}) }),
      '*'
    );
  }
};
