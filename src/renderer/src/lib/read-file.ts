export const ReadFile = (_: File) => {
  return new Promise((res) => {
    const __ = new FileReader();
    __.onload = (e) => res(e.target?.result);
    __.readAsText(_);
  });
};
